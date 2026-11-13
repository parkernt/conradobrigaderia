/**
 * Conrado Brigaderia — Main Application Script
 * Pure Vanilla ES6+ (Zero dependencies)
 */
(() => {
  'use strict';

  const FALLBACK_IMAGE = 'assets/product-fallback.svg';
  const DEFAULT_STORE = {
    name: 'Conrado Brigaderia',
    whatsapp: '5513981518725',
    xmenuUrl: 'https://pedido.xmenu.com.br/?loja=16380#/vitrine'
  };

  /**
   * Normalize text for accent-insensitive search using NFD decomposition.
   */
  function normalizeText(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  /**
   * Format a numeric value as Brazilian Real currency.
   */
  function formatBRL(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) {
      return 'R$ 0,00';
    }
    return num.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  /**
   * Normalize a raw product record into a consistent shape.
   */
  function normalizeProduct(raw, index) {
    const priceNum = Number(raw.price ?? raw.PrecoVenda ?? 0);
    const priceFormatted = raw.priceFormatted || formatBRL(priceNum);
    return {
      id: raw.id ?? raw.ID ?? index + 1,
      name: String(raw.name ?? raw.Nome ?? 'Produto Conrado').trim(),
      category: String(raw.category ?? raw.NomeGrupo ?? 'Outros').trim(),
      description: String(raw.description ?? raw.Descricao ?? '').trim(),
      image: String(raw.image ?? raw.photo ?? raw.httpFoto ?? '').trim() || FALLBACK_IMAGE,
      price: priceNum,
      priceFormatted,
      featured: Boolean(raw.featured),
      promo: Boolean(raw.promo ?? raw.Promocao)
    };
  }

  /**
   * Truncate description cleanly at word boundary.
   */
  function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) {
      return text;
    }
    const sliced = text.slice(0, maxLength);
    const lastSpace = sliced.lastIndexOf(' ');
    const base = lastSpace > 40 ? sliced.slice(0, lastSpace) : sliced;
    return `${base.trim()}…`;
  }

  /**
   * Attach safe image error fallback once to avoid infinite error loops.
   */
  function applyImageFallback(imgEl, src, altText) {
    imgEl.alt = altText || 'Doce artesanal Conrado Brigaderia';
    imgEl.dataset.fallbackApplied = 'false';
    imgEl.onerror = () => {
      if (imgEl.dataset.fallbackApplied === 'true') {
        imgEl.onerror = null;
        return;
      }
      imgEl.dataset.fallbackApplied = 'true';
      imgEl.src = FALLBACK_IMAGE;
    };
    imgEl.src = src || FALLBACK_IMAGE;
  }

  /**
   * Create a DOM element with optional className and textContent.
   */
  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) {
      el.className = className;
    }
    if (text !== undefined && text !== null) {
      el.textContent = text;
    }
    return el;
  }

  function init() {
    const rawData = window.CONRADO_DATA || {};
    const store = Object.assign({}, DEFAULT_STORE, rawData.store || {});
    const rawProducts = Array.isArray(rawData.products) ? rawData.products : [];
    const products = rawProducts.map(normalizeProduct);

    const rawCategories = Array.isArray(rawData.categories) ? rawData.categories : [];
    const categories = rawCategories.length > 0
      ? rawCategories.map((c) => String(c).trim()).filter(Boolean)
      : Array.from(new Set(products.map((p) => p.category)));

    // Precompute normalized search strings and category counts
    const searchIndex = new Map();
    const categoryCounts = new Map();

    products.forEach((product) => {
      searchIndex.set(
        product.id,
        normalizeText(`${product.name} ${product.description} ${product.category}`)
      );
      categoryCounts.set(product.category, (categoryCounts.get(product.category) || 0) + 1);
    });

    const state = {
      selectedCategory: 'Todos',
      searchQuery: '',
      lastTriggerEl: null
    };

    // DOM References
    const header = document.getElementById('main-header');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    const featuredGrid = document.getElementById('featured-grid');
    const categoryFilters = document.getElementById('category-filters');
    const catalogSearch = document.getElementById('catalog-search');
    const catalogClear = document.getElementById('catalog-clear');
    const catalogCount = document.getElementById('catalog-count');
    const productGrid = document.getElementById('product-grid');
    const catalogEmpty = document.getElementById('catalog-empty');

    const modal = document.getElementById('product-modal');
    const modalClose = document.getElementById('modal-close');
    const modalImg = document.getElementById('modal-img');
    const modalCategory = document.getElementById('modal-category');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalDesc = document.getElementById('modal-desc');
    const modalXmenuLink = document.getElementById('modal-xmenu-link');
    const modalWhatsappLink = document.getElementById('modal-whatsapp-link');

    // -------------------------------------------------------------------------
    // 1. Header Scroll State & Mobile Navigation
    // -------------------------------------------------------------------------
    function updateHeaderScroll() {
      if (!header) return;
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    }

    function setMobileNavOpen(isOpen) {
      if (!mobileNav || !mobileToggle) return;
      mobileNav.classList.toggle('is-open', isOpen);
      mobileToggle.classList.toggle('is-open', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      if ('hidden' in mobileNav && mobileNav.hasAttribute('hidden') && isOpen) {
        mobileNav.removeAttribute('hidden');
      }
    }

    if (header) {
      updateHeaderScroll();
      window.addEventListener('scroll', updateHeaderScroll, { passive: true });
    }

    if (mobileToggle && mobileNav) {
      mobileToggle.addEventListener('click', () => {
        const currentlyOpen = mobileNav.classList.contains('is-open');
        setMobileNavOpen(!currentlyOpen);
      });

      mobileNav.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
          setMobileNavOpen(false);
        }
      });
    }

    // Smooth anchor scrolling for internal navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        setMobileNavOpen(false);

        const headerOffset = header ? header.offsetHeight : 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: prefersReduced ? 'auto' : 'smooth'
        });
      });
    });

    // -------------------------------------------------------------------------
    // 2. Product Detail Modal
    // -------------------------------------------------------------------------
    function isModalOpen() {
      if (!modal) return false;
      return !modal.hidden && modal.classList.contains('is-open');
    }

    function openProductModal(product, triggerEl) {
      if (!modal || !product) return;

      state.lastTriggerEl = triggerEl || document.activeElement;

      if (modalImg) {
        applyImageFallback(modalImg, product.image, product.name);
      }
      if (modalCategory) {
        modalCategory.textContent = product.category;
      }
      if (modalTitle) {
        modalTitle.textContent = product.name;
      }
      if (modalPrice) {
        modalPrice.textContent = product.priceFormatted;
      }
      if (modalDesc) {
        modalDesc.textContent =
          product.description ||
          'Receita artesanal Conrado Brigaderia preparada com ingredientes selecionados.';
      }
      if (modalXmenuLink) {
        modalXmenuLink.href = store.xmenuUrl;
        modalXmenuLink.target = '_blank';
        modalXmenuLink.rel = 'noopener noreferrer';
      }
      if (modalWhatsappLink) {
        const message = `Olá! Gostaria de pedir o item *${product.name}* (${product.priceFormatted}) que vi no site da Conrado Brigaderia.`;
        modalWhatsappLink.href = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
        modalWhatsappLink.target = '_blank';
        modalWhatsappLink.rel = 'noopener noreferrer';
      }

      modal.hidden = false;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';

      if (modalClose) {
        modalClose.focus();
      }
    }

    function closeProductModal() {
      if (!modal || !isModalOpen()) return;

      modal.classList.remove('is-open');
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';

      if (state.lastTriggerEl && typeof state.lastTriggerEl.focus === 'function') {
        state.lastTriggerEl.focus();
      }
      state.lastTriggerEl = null;
    }

    if (modal) {
      if (!modal.classList.contains('is-open')) {
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
      }

      if (modalClose) {
        modalClose.addEventListener('click', closeProductModal);
      }

      modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.closest('[data-modal-close]')) {
          closeProductModal();
        }
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          if (isModalOpen()) {
            closeProductModal();
          } else if (mobileNav && mobileNav.classList.contains('is-open')) {
            setMobileNavOpen(false);
            if (mobileToggle) mobileToggle.focus();
          }
          return;
        }

        if (event.key === 'Tab' && isModalOpen()) {
          const focusable = Array.from(
            modal.querySelectorAll(
              'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => !el.hidden && el.offsetParent !== null);

          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      });
    }

    // -------------------------------------------------------------------------
    // 3. Featured Hall of Fame (#featured-grid)
    // -------------------------------------------------------------------------
    function renderFeaturedProducts() {
      if (!featuredGrid) return;

      const flagged = products.filter((p) => p.featured);
      const featured = flagged.slice(0, 4);
      if (featured.length < 4) {
        const usedIds = new Set(featured.map((p) => p.id));
        for (let i = 0; i < products.length && featured.length < 4; i += 1) {
          if (!usedIds.has(products[i].id)) {
            featured.push(products[i]);
            usedIds.add(products[i].id);
          }
        }
      }

      featuredGrid.innerHTML = '';
      const fragment = document.createDocumentFragment();

      featured.forEach((product, idx) => {
        const card = createEl('article', 'featured-card starburst-card');
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Ver detalhes de ${product.name} - ${product.priceFormatted}`);

        const mediaWrap = createEl('div', 'featured-card-media');
        const img = document.createElement('img');
        img.className = 'featured-card-img';
        img.loading = 'lazy';
        img.decoding = 'async';
        applyImageFallback(img, product.image, product.name);
        mediaWrap.appendChild(img);

        const badge = createEl('span', 'starburst-badge featured-badge', `#0${idx + 1} ÍCONE`);
        mediaWrap.appendChild(badge);

        const body = createEl('div', 'featured-card-body');
        const cat = createEl('span', 'featured-card-category', product.category);
        const title = createEl('h3', 'featured-card-title', product.name);
        const desc = createEl('p', 'featured-card-desc', truncateText(product.description, 100));

        const footer = createEl('div', 'featured-card-footer');
        const price = createEl('span', 'featured-card-price', product.priceFormatted);
        const cta = createEl('span', 'featured-card-cta', 'VER DETALHES');
        footer.appendChild(price);
        footer.appendChild(cta);

        body.appendChild(cat);
        body.appendChild(title);
        body.appendChild(desc);
        body.appendChild(footer);

        card.appendChild(mediaWrap);
        card.appendChild(body);

        card.addEventListener('click', () => openProductModal(product, card));
        card.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openProductModal(product, card);
          }
        });

        fragment.appendChild(card);
      });

      featuredGrid.appendChild(fragment);
    }

    // -------------------------------------------------------------------------
    // 4. Category Filter Pills (#category-filters)
    // -------------------------------------------------------------------------
    function renderCategoryFilters() {
      if (!categoryFilters) return;

      categoryFilters.innerHTML = '';
      const fragment = document.createDocumentFragment();

      const allCategories = ['Todos', ...categories];

      allCategories.forEach((category) => {
        const count = category === 'Todos' ? products.length : (categoryCounts.get(category) || 0);
        if (category !== 'Todos' && count === 0) return;

        const isActive = state.selectedCategory === category;
        const btn = createEl('button', `category-pill${isActive ? ' is-active' : ''}`);
        btn.type = 'button';
        btn.dataset.category = category;
        btn.setAttribute('aria-pressed', String(isActive));

        const labelSpan = createEl('span', 'category-pill-label', category);
        const countSpan = createEl('span', 'category-pill-count', `(${count})`);
        btn.appendChild(labelSpan);
        btn.appendChild(document.createTextNode(' '));
        btn.appendChild(countSpan);

        btn.addEventListener('click', () => {
          state.selectedCategory = category;
          updateCategoryPillStates();
          renderVitrine();
        });

        fragment.appendChild(btn);
      });

      categoryFilters.appendChild(fragment);
    }

    function updateCategoryPillStates() {
      if (!categoryFilters) return;
      categoryFilters.querySelectorAll('.category-pill').forEach((btn) => {
        const active = btn.dataset.category === state.selectedCategory;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
    }

    // -------------------------------------------------------------------------
    // 5. Interactive Vitrine (#product-grid, #catalog-count, #catalog-empty)
    // -------------------------------------------------------------------------
    function buildProductCard(product) {
      const card = createEl('article', 'product-card');

      const media = createEl('div', 'product-card-media');
      const img = document.createElement('img');
      img.className = 'product-card-img';
      img.loading = 'lazy';
      img.decoding = 'async';
      applyImageFallback(img, product.image, product.name);
      media.appendChild(img);

      if (product.promo) {
        const promoBadge = createEl('span', 'product-badge promo-badge', 'DESTAQUE');
        media.appendChild(promoBadge);
      }

      const content = createEl('div', 'product-card-body');
      const catEl = createEl('span', 'product-card-category', product.category);
      const titleEl = createEl('h3', 'product-card-title', product.name);
      const descEl = createEl(
        'p',
        'product-card-desc',
        truncateText(product.description || 'Produção artesanal diária na Conrado Brigaderia.', 115)
      );

      const footer = createEl('div', 'product-card-footer');
      const priceEl = createEl('span', 'product-card-price', product.priceFormatted);

      const actions = createEl('div', 'product-card-actions');
      const detailsBtn = createEl('button', 'btn-details', 'VER DETALHES');
      detailsBtn.type = 'button';
      detailsBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        openProductModal(product, detailsBtn);
      });

      const orderLink = createEl('a', 'btn-order', 'PEDIR');
      orderLink.href = store.xmenuUrl;
      orderLink.target = '_blank';
      orderLink.rel = 'noopener noreferrer';
      orderLink.setAttribute('aria-label', `Pedir ${product.name} no XMenu`);
      orderLink.addEventListener('click', (event) => {
        event.stopPropagation();
      });

      actions.appendChild(detailsBtn);
      actions.appendChild(orderLink);

      footer.appendChild(priceEl);
      footer.appendChild(actions);

      content.appendChild(catEl);
      content.appendChild(titleEl);
      content.appendChild(descEl);
      content.appendChild(footer);

      card.appendChild(media);
      card.appendChild(content);

      // Clicking the card media/title opens the detail modal
      media.style.cursor = 'pointer';
      media.addEventListener('click', () => openProductModal(product, detailsBtn));
      titleEl.style.cursor = 'pointer';
      titleEl.addEventListener('click', () => openProductModal(product, detailsBtn));

      return card;
    }

    function renderVitrine() {
      const normalizedQuery = normalizeText(state.searchQuery);

      const filtered = products.filter((product) => {
        const matchesCategory =
          state.selectedCategory === 'Todos' || product.category === state.selectedCategory;
        if (!matchesCategory) return false;

        if (!normalizedQuery) return true;
        const haystack = searchIndex.get(product.id) || '';
        return haystack.includes(normalizedQuery);
      });

      if (catalogCount) {
        const noun = filtered.length === 1 ? 'delícia' : 'delícias';
        catalogCount.textContent = `Mostrando ${filtered.length} de ${products.length} ${noun}`;
      }

      if (catalogEmpty) {
        const isEmpty = filtered.length === 0;
        catalogEmpty.hidden = !isEmpty;
        catalogEmpty.classList.toggle('is-visible', isEmpty);
      }

      if (!productGrid) return;
      productGrid.innerHTML = '';

      if (filtered.length === 0) return;

      const fragment = document.createDocumentFragment();
      filtered.forEach((product) => {
        fragment.appendChild(buildProductCard(product));
      });
      productGrid.appendChild(fragment);
    }

    // -------------------------------------------------------------------------
    // 6. Search & Clear Controls
    // -------------------------------------------------------------------------
    if (catalogSearch) {
      catalogSearch.addEventListener('input', (event) => {
        state.searchQuery = event.target.value;
        renderVitrine();
      });
    }

    if (catalogClear) {
      catalogClear.addEventListener('click', () => {
        state.searchQuery = '';
        if (catalogSearch) {
          catalogSearch.value = '';
          catalogSearch.focus();
        }
        renderVitrine();
      });
    }

    // Initial render
    renderFeaturedProducts();
    renderCategoryFilters();
    renderVitrine();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
