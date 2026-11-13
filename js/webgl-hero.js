/**
 * Conrado Brigaderia — Photorealistic WebGL1 3D Confectionery Hero Engine
 * Zero external runtime dependencies (Ponytail philosophy: Pure WebGL + Vanilla ES6).
 *
 * Renders a studio-photorealistic 3D Conrado Brigadeiro based on Conrado's real
 * product photography (IDs 41593, 1044, 1047, 1042):
 *  - Real photographic chocolate micro-texture (assets/brigadeiro-real-tex.png
 *    + embedded base64 data URI) providing authentic cocoa-butter grain & bump
 *  - 820 densely encrusted 3D Callebaut Belgian chocolate splits, granulados & curls
 *    pressed into a glossy dark chocolate truffle core with baked per-vertex
 *    Crevice Ambient Occlusion (AO)
 *  - High-detail 36-pleat white confectionery wrapper (Forminha Plissada) with flat
 *    circular base + delicate sheer inner liner (Tapetinho), paper subsurface warmth,
 *    and deep interior contact shadow
 *  - Physical Studio Lighting: Cook-Torrance GGX microfacet BRDF, dielectric Fresnel
 *    (F0 = 0.045), dual-lobe specular (tempered satin chocolate + wet ganache crevices),
 *    analytic Studio Softbox IBL reflections, warm cocoa/paper SSS, and ACES Filmic
 *    tone mapping + sRGB gamma correction.
 */
(function () {
  'use strict';

  const TARGET_CANVAS_ID = 'hero-webgl-canvas';
  const MAX_DPR = 2;

  const EMBEDDED_REAL_TEX_URI = 'data:image/jpeg;base64,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';
  const LOCAL_REAL_TEX_PATH = 'assets/brigadeiro-real-tex.png';

  // =========================================================================
  // Minimal Mat4 / Mat3 Linear Algebra Helpers (Zero Dependencies)
  // =========================================================================

  function mat4Create() {
    const out = new Float32Array(16);
    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
  }

  function mat4Identity(out) {
    out[0] = 1; out[1] = 0; out[2] = 0; out[3] = 0;
    out[4] = 0; out[5] = 1; out[6] = 0; out[7] = 0;
    out[8] = 0; out[9] = 0; out[10] = 1; out[11] = 0;
    out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;
    return out;
  }

  function mat4Perspective(out, fovYRad, aspect, near, far) {
    const f = 1.0 / Math.tan(fovYRad * 0.5);
    const nf = 1.0 / (near - far);
    out[0] = f / aspect; out[1] = 0; out[2] = 0; out[3] = 0;
    out[4] = 0; out[5] = f; out[6] = 0; out[7] = 0;
    out[8] = 0; out[9] = 0; out[10] = (far + near) * nf; out[11] = -1;
    out[12] = 0; out[13] = 0; out[14] = 2 * far * near * nf; out[15] = 0;
    return out;
  }

  function mat4Multiply(out, a, b) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }

  function mat4Translate(out, x, y, z) {
    mat4Identity(out);
    out[12] = x;
    out[13] = y;
    out[14] = z;
    return out;
  }

  function mat4RotateX(out, rad) {
    mat4Identity(out);
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    out[5] = c;
    out[6] = s;
    out[9] = -s;
    out[10] = c;
    return out;
  }

  function mat4RotateY(out, rad) {
    mat4Identity(out);
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    out[0] = c;
    out[2] = -s;
    out[8] = s;
    out[10] = c;
    return out;
  }

  function mat4RotateZ(out, rad) {
    mat4Identity(out);
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    out[0] = c;
    out[1] = s;
    out[4] = -s;
    out[5] = c;
    return out;
  }

  function mat4Scale(out, sx, sy, sz) {
    mat4Identity(out);
    out[0] = sx;
    out[5] = sy;
    out[10] = sz;
    return out;
  }

  function mat3NormalFromMat4(out3, m) {
    const a00 = m[0], a01 = m[1], a02 = m[2];
    const a10 = m[4], a11 = m[5], a12 = m[6];
    const a20 = m[8], a21 = m[9], a22 = m[10];

    const b01 = a22 * a11 - a12 * a21;
    const b11 = -a22 * a10 + a12 * a20;
    const b21 = a21 * a10 - a11 * a20;

    let det = a00 * b01 + a01 * b11 + a02 * b21;
    if (Math.abs(det) < 1e-8) {
      out3[0] = 1; out3[1] = 0; out3[2] = 0;
      out3[3] = 0; out3[4] = 1; out3[5] = 0;
      out3[6] = 0; out3[7] = 0; out3[8] = 1;
      return out3;
    }
    det = 1.0 / det;

    out3[0] = b01 * det;
    out3[1] = b11 * det;
    out3[2] = b21 * det;
    out3[3] = (-a22 * a01 + a02 * a21) * det;
    out3[4] = (a22 * a00 - a02 * a20) * det;
    out3[5] = (-a21 * a00 + a01 * a20) * det;
    out3[6] = (a12 * a01 - a02 * a11) * det;
    out3[7] = (-a12 * a00 + a02 * a10) * det;
    out3[8] = (a11 * a00 - a01 * a10) * det;
    return out3;
  }

  function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }

  function createRng(seed) {
    let s = seed >>> 0;
    return function next() {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  // =========================================================================
  // Smooth Normals Helper for Indexed Triangle Meshes
  // =========================================================================

  function computeSmoothNormals(positions, indices) {
    const normals = new Float32Array(positions.length);
    for (let i = 0; i < indices.length; i += 3) {
      const ia = indices[i] * 3;
      const ib = indices[i + 1] * 3;
      const ic = indices[i + 2] * 3;

      const ax = positions[ia], ay = positions[ia + 1], az = positions[ia + 2];
      const bx = positions[ib], by = positions[ib + 1], bz = positions[ib + 2];
      const cx = positions[ic], cy = positions[ic + 1], cz = positions[ic + 2];

      const abx = bx - ax, aby = by - ay, abz = bz - az;
      const acx = cx - ax, acy = cy - ay, acz = cz - az;

      const nx = aby * acz - abz * acy;
      const ny = abz * acx - abx * acz;
      const nz = abx * acy - aby * acx;

      normals[ia] += nx; normals[ia + 1] += ny; normals[ia + 2] += nz;
      normals[ib] += nx; normals[ib + 1] += ny; normals[ib + 2] += nz;
      normals[ic] += nx; normals[ic + 1] += ny; normals[ic + 2] += nz;
    }

    for (let i = 0; i < normals.length; i += 3) {
      const x = normals[i], y = normals[i + 1], z = normals[i + 2];
      const len = Math.hypot(x, y, z);
      if (len > 1e-6) {
        normals[i] = x / len;
        normals[i + 1] = y / len;
        normals[i + 2] = z / len;
      } else {
        normals[i] = 0;
        normals[i + 1] = 1;
        normals[i + 2] = 0;
      }
    }
    return normals;
  }

  // =========================================================================
  // Shared Truffle Core Surface Deformation Function
  // =========================================================================

  function evalCoreSurfacePoint(ux, uy, uz, baseRadius) {
    const organic =
      0.016 * Math.sin(ux * 3.1 + uy * 2.4) * Math.cos(uz * 2.9) +
      0.009 * Math.cos(ux * 5.2 - uz * 4.7 + uy * 3.0);

    let ySquash = uy;
    if (uy < -0.35) {
      const t = (-0.35 - uy) / 0.65;
      ySquash = uy + 0.16 * t * t;
    }

    const belly = 1.0 + 0.045 * Math.exp(-Math.pow((uy + 0.05) * 2.2, 2));
    const r = baseRadius * (1.0 + organic);

    return {
      x: ux * r * belly,
      y: ySquash * r * 0.91 + 0.10,
      z: uz * r * belly
    };
  }

  // =========================================================================
  // Photorealistic 3D Confectionery Geometry Builders
  // =========================================================================

  /**
   * 1. Hand-Rolled Glossy Brigadeiro Truffle Core (Massa de Brigadeiro)
   */
  function buildBrigadeiroCoreGeometry(lonSegs, latSegs, radius) {
    const vertCount = (lonSegs + 1) * (latSegs + 1);
    const positions = new Float32Array(vertCount * 3);
    const uvs = new Float32Array(vertCount * 2);
    const aos = new Float32Array(vertCount);
    const indices = new Uint16Array(lonSegs * latSegs * 6);

    let pIdx = 0;
    let uvIdx = 0;
    let aoIdx = 0;

    for (let lat = 0; lat <= latSegs; lat++) {
      const v = lat / latSegs;
      const phi = v * Math.PI;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      for (let lon = 0; lon <= lonSegs; lon++) {
        const u = lon / lonSegs;
        const theta = u * Math.PI * 2;
        const ux = sinPhi * Math.cos(theta);
        const uy = cosPhi;
        const uz = sinPhi * Math.sin(theta);

        const pt = evalCoreSurfacePoint(ux, uy, uz, radius);
        positions[pIdx++] = pt.x;
        positions[pIdx++] = pt.y;
        positions[pIdx++] = pt.z;

        uvs[uvIdx++] = u * 3.0;
        uvs[uvIdx++] = v * 3.0;

        const cupShadow = smoothstep(-0.45, 0.20, uy);
        aos[aoIdx++] = 0.08 + 0.22 * cupShadow;
      }
    }

    let iIdx = 0;
    const stride = lonSegs + 1;
    for (let lat = 0; lat < latSegs; lat++) {
      for (let lon = 0; lon < lonSegs; lon++) {
        const a = lat * stride + lon;
        const b = a + stride;
        indices[iIdx++] = a;
        indices[iIdx++] = a + 1;
        indices[iIdx++] = b;

        indices[iIdx++] = a + 1;
        indices[iIdx++] = b + 1;
        indices[iIdx++] = b;
      }
    }

    const normals = computeSmoothNormals(positions, indices);
    return { positions, normals, uvs, aos, indices };
  }

  /**
   * 2. Dense Encrusted Confeitos (820 Callebaut Belgian Chocolate Splits,
   *    Granulados & Blossom Curls Pressed Into the Brigadeiro Dome)
   *
   * Stops cleanly at uy = -0.24 (safely inside the wide 1.38 rim of the
   * pleated cup so ZERO splits can ever poke through the outer paper wall).
   */
  function buildEncrustedConfeitosGeometry(count, coreRadius) {
    const radialSegs = 10;
    const vertsPerPiece = 1 + 3 * radialSegs; // 31 verts
    const trisPerPiece = radialSegs + 2 * radialSegs * 2; // 50 tris

    const totalVerts = count * vertsPerPiece;
    const totalIndices = count * trisPerPiece * 3;

    const positions = new Float32Array(totalVerts * 3);
    const normals = new Float32Array(totalVerts * 3);
    const uvs = new Float32Array(totalVerts * 2);
    const colors = new Float32Array(totalVerts * 4);
    const aos = new Float32Array(totalVerts);
    const indices = new Uint16Array(totalIndices);

    // Authentic Callebaut Belgian Chocolate Linear RGB Palette
    // Sampled directly from Conrado real photos (IDs 41593, 1044, 1047, 1042)
    // High R:G:B ratio keeps chocolate rich, deep & cocoa-saturated (zero pale tan)
    const palette = [
      // Callebaut Meio Amargo (Belgian Dark Chocolate 54.5% - 70%)
      [0.018, 0.005, 0.0018],
      [0.025, 0.007, 0.0024],
      [0.034, 0.010, 0.0034],
      [0.046, 0.014, 0.0046],
      // Callebaut Ao Leite (Belgian Milk Chocolate 33.6%)
      [0.072, 0.022, 0.0068],
      [0.095, 0.030, 0.0092],
      [0.122, 0.039, 0.0115],
      [0.150, 0.049, 0.0140],
      // Warm Caramelized Cocoa Milk Splits (10% accent matching ID 41593)
      [0.165, 0.054, 0.0140],
      [0.190, 0.062, 0.0160]
    ];
    // ~54% Dark Belgian, ~36% Rich Milk Belgian, ~10% Warm Milk Accent
    const paletteMap = [
      0, 5, 1, 2, 6, 0, 8, 3, 4, 1,
      2, 7, 0, 5, 3, 9, 1, 4, 2, 6,
      0, 5, 3, 1, 7, 2, 4, 0, 8, 3
    ];

    const rng = createRng(20170415);
    const goldenAngle = Math.PI * (3.0 - Math.sqrt(5.0));

    let vBase = 0;
    let iIdx = 0;

    for (let c = 0; c < count; c++) {
      // Pack from crown apex (uy = +0.998) down inside the cup rim (uy = -0.24)
      const tNorm = (c + 0.5) / count;
      const uyRaw = 0.998 - tNorm * 1.238;
      const jitterY = (rng() - 0.5) * 0.018 * (1.0 - Math.abs(uyRaw) * 0.45);
      const uy = clamp(uyRaw + jitterY, -0.25, 0.999);
      const rRing = Math.sqrt(Math.max(0.0, 1.0 - uy * uy));

      const theta = c * goldenAngle + (rng() - 0.5) * 0.08;
      const ux = rRing * Math.cos(theta);
      const uz = rRing * Math.sin(theta);

      const centerPt = evalCoreSurfacePoint(ux, uy, uz, coreRadius);

      const nxCore = ux;
      const nyCore = uy * 1.06;
      const nzCore = uz;
      const nLen = Math.hypot(nxCore, nyCore, nzCore) || 1.0;
      const Nx = nxCore / nLen;
      const Ny = nyCore / nLen;
      const Nz = nzCore / nLen;

      let refX = 0.0, refY = 1.0, refZ = 0.0;
      if (Math.abs(Ny) > 0.92) {
        refX = 1.0; refY = 0.0; refZ = 0.0;
      }
      let t1x = refY * Nz - refZ * Ny;
      let t1y = refZ * Nx - refX * Nz;
      let t1z = refX * Ny - refY * Nx;
      const t1Len = Math.hypot(t1x, t1y, t1z) || 1.0;
      t1x /= t1Len; t1y /= t1Len; t1z /= t1Len;

      const t2x = t1y * Nz - t1z * Ny;
      const t2y = t1z * Nx - t1x * Nz;
      const t2z = t1x * Ny - t1y * Nx;

      const yaw = rng() * Math.PI * 2.0;
      const cosYaw = Math.cos(yaw);
      const sinYaw = Math.sin(yaw);

      let Ux = t1x * cosYaw + t2x * sinYaw;
      let Uy = t1y * cosYaw + t2y * sinYaw;
      let Uz = t1z * cosYaw + t2z * sinYaw;

      let Wx = -t1x * sinYaw + t2x * cosYaw;
      let Wy = -t1y * sinYaw + t2y * cosYaw;
      let Wz = -t1z * sinYaw + t2z * cosYaw;

      const pitch = (rng() - 0.5) * 0.30;
      const roll = (rng() - 0.5) * 0.28;
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      const cr = Math.cos(roll), sr = Math.sin(roll);

      const Nx1 = Nx * cp + Wx * sp;
      const Ny1 = Ny * cp + Wy * sp;
      const Nz1 = Nz * cp + Wz * sp;
      Wx = Wx * cp - Nx * sp;
      Wy = Wy * cp - Ny * sp;
      Wz = Wz * cp - Nz * sp;

      const Ux2 = Ux * cr - Nx1 * sr;
      const Uy2 = Uy * cr - Ny1 * sr;
      const Uz2 = Uz * cr - Nz1 * sr;
      const Nx2 = Nx1 * cr + Ux * sr;
      const Ny2 = Ny1 * cr + Uy * sr;
      const Nz2 = Nz1 * cr + Uz * sr;
      Ux = Ux2; Uy = Uy2; Uz = Uz2;

      const typeRoll = rng();
      let halfW, halfL, height, cornerExp, curlFactor, bendFactor, taperFactor, isCylindrical;

      if (typeRoll < 0.70) {
        // Crisp Callebaut Chocolate Split (rectangular faceted slab with clean chamfered edges)
        halfW = 0.050 + rng() * 0.020;
        halfL = 0.068 + rng() * 0.028;
        height = 0.044 + rng() * 0.016;
        cornerExp = 0.38 + rng() * 0.08;
        curlFactor = (rng() - 0.5) * 0.06;
        bendFactor = (rng() - 0.5) * 0.05;
        taperFactor = (rng() - 0.5) * 0.14;
        isCylindrical = false;
      } else if (typeRoll < 0.90) {
        // Artisanal Granulado / Vermicelli (longer rounded cocoa stick)
        halfW = 0.032 + rng() * 0.010;
        halfL = 0.092 + rng() * 0.034;
        height = 0.052 + rng() * 0.015;
        cornerExp = 0.76;
        curlFactor = 0.0;
        bendFactor = (rng() - 0.5) * 0.16;
        taperFactor = 0.0;
        isCylindrical = true;
      } else {
        // Callebaut Shaved Blossom / Thin Curl
        halfW = 0.048 + rng() * 0.018;
        halfL = 0.076 + rng() * 0.024;
        height = 0.050 + rng() * 0.018;
        cornerExp = 0.50;
        curlFactor = (rng() > 0.5 ? 1.0 : -1.0) * (0.20 + rng() * 0.14);
        bendFactor = (rng() - 0.5) * 0.10;
        taperFactor = (rng() - 0.5) * 0.16;
        isCylindrical = false;
      }

      const baseCol = palette[paletteMap[(c + Math.floor(rng() * 5)) % paletteMap.length]];
      const shadeJitter = 0.88 + rng() * 0.24;
      const colR = baseCol[0] * shadeJitter;
      const colG = baseCol[1] * shadeJitter;
      const colB = baseCol[2] * shadeJitter;
      // Tempered satin chocolate roughness (0.27..0.38 — NOT wet plastic)
      const pieceRoughness = 0.27 + rng() * 0.11;

      const uvOffU = rng();
      const uvOffV = rng();

      // Gentle rim contact darkening near the paper cup edge
      const cupOcclusion = smoothstep(-0.34, 0.02, uy) * 0.52 + 0.48;

      // Vertex 0: Center face
      {
        const dst3 = vBase * 3;
        const dst2 = vBase * 2;
        const dst4 = vBase * 4;
        const crownH = height * (isCylindrical ? 1.02 : 0.96);

        positions[dst3] = centerPt.x + Nx2 * crownH;
        positions[dst3 + 1] = centerPt.y + Ny2 * crownH;
        positions[dst3 + 2] = centerPt.z + Nz2 * crownH;

        normals[dst3] = Nx2;
        normals[dst3 + 1] = Ny2;
        normals[dst3 + 2] = Nz2;

        uvs[dst2] = uvOffU;
        uvs[dst2 + 1] = uvOffV;

        colors[dst4] = colR;
        colors[dst4 + 1] = colG;
        colors[dst4 + 2] = colB;
        colors[dst4 + 3] = pieceRoughness;

        aos[vBase] = 1.0 * cupOcclusion;
      }

      // Faceted split profile vs slightly rounder granulado profile
      const ringRadii = isCylindrical ? [0.64, 0.92, 1.02] : [0.80, 0.96, 1.02];
      const ringHeights = isCylindrical ? [0.88, 0.50, -0.34] : [0.93, 0.72, -0.34];
      const ringOutWeights = isCylindrical ? [0.28, 0.76, 0.96] : [0.10, 0.68, 0.96];
      const ringUpWeights = isCylindrical ? [0.96, 0.65, 0.28] : [0.995, 0.73, 0.28];
      const ringAos = [0.96, 0.64, 0.05];

      for (let rIdx = 0; rIdx < 3; rIdx++) {
        const rScale = ringRadii[rIdx];
        const hBase = ringHeights[rIdx] * height;
        const wOut = ringOutWeights[rIdx];
        const wUp = ringUpWeights[rIdx];
        const baseAo = ringAos[rIdx] * cupOcclusion;

        for (let s = 0; s < radialSegs; s++) {
          const vIdx = vBase + 1 + rIdx * radialSegs + s;
          const phi = (s / radialSegs) * Math.PI * 2.0;
          const cosP = Math.cos(phi);
          const sinP = Math.sin(phi);

          const sx = (cosP >= 0.0 ? 1.0 : -1.0) * Math.pow(Math.abs(cosP), cornerExp);
          const sz = (sinP >= 0.0 ? 1.0 : -1.0) * Math.pow(Math.abs(sinP), cornerExp);

          const taper = 1.0 + taperFactor * sz;
          const lx = (sx * halfW * taper + bendFactor * halfW * sz * sz) * rScale;
          const lz = (sz * halfL) * rScale;
          const ly = hBase + curlFactor * height * sx * rScale;

          const outLen = Math.hypot(cosP, sinP) || 1.0;
          const onx = (cosP / outLen) * wOut - curlFactor * 0.20 * wUp;
          const onz = (sinP / outLen) * wOut;
          const ony = wUp;
          const onNorm = Math.hypot(onx, ony, onz) || 1.0;
          const lnx = onx / onNorm;
          const lny = ony / onNorm;
          const lnz = onz / onNorm;

          const px = centerPt.x + Ux * lx + Nx2 * ly + Wx * lz;
          const py = centerPt.y + Uy * lx + Ny2 * ly + Wy * lz;
          const pz = centerPt.z + Uz * lx + Nz2 * ly + Wz * lz;

          const wnx = Ux * lnx + Nx2 * lny + Wx * lnz;
          const wny = Uy * lnx + Ny2 * lny + Wy * lnz;
          const wnz = Uz * lnx + Nz2 * lny + Wz * lnz;

          const dst3 = vIdx * 3;
          const dst2 = vIdx * 2;
          const dst4 = vIdx * 4;

          positions[dst3] = px;
          positions[dst3 + 1] = py;
          positions[dst3 + 2] = pz;

          normals[dst3] = wnx;
          normals[dst3 + 1] = wny;
          normals[dst3 + 2] = wnz;

          uvs[dst2] = uvOffU + sx * rScale * 0.28;
          uvs[dst2 + 1] = uvOffV + sz * rScale * 0.28;

          colors[dst4] = colR;
          colors[dst4 + 1] = colG;
          colors[dst4 + 2] = colB;
          colors[dst4 + 3] = pieceRoughness;

          aos[vIdx] = baseAo;
        }
      }

      for (let s = 0; s < radialSegs; s++) {
        const sNext = (s + 1) % radialSegs;
        indices[iIdx++] = vBase;
        indices[iIdx++] = vBase + 1 + sNext;
        indices[iIdx++] = vBase + 1 + s;
      }

      for (let rIdx = 0; rIdx < 2; rIdx++) {
        const ringStartA = vBase + 1 + rIdx * radialSegs;
        const ringStartB = vBase + 1 + (rIdx + 1) * radialSegs;
        for (let s = 0; s < radialSegs; s++) {
          const sNext = (s + 1) % radialSegs;
          const a = ringStartA + s;
          const aNext = ringStartA + sNext;
          const b = ringStartB + s;
          const bNext = ringStartB + sNext;

          indices[iIdx++] = a;
          indices[iIdx++] = aNext;
          indices[iIdx++] = b;

          indices[iIdx++] = aNext;
          indices[iIdx++] = bNext;
          indices[iIdx++] = b;
        }
      }

      vBase += vertsPerPiece;
    }

    return { positions, normals, uvs, colors, aos, indices };
  }

  /**
   * 3. Realistic 36-Pleat Confectionery Wrapper (Forminha Plissada with Flat Base)
   */
  function buildForminhaPlissadaGeometry(lonSegs, latSegs, nPleats) {
    const vertCount = (lonSegs + 1) * (latSegs + 1);
    const positions = new Float32Array(vertCount * 3);
    const uvs = new Float32Array(vertCount * 2);
    const aos = new Float32Array(vertCount);
    const indices = new Uint16Array(lonSegs * latSegs * 6);

    let pIdx = 0;
    let uvIdx = 0;
    let aoIdx = 0;

    const baseR = 0.80;
    const baseY = -0.88;
    const rimR = 1.38;
    const rimY = 0.08;
    const wallThickness = 0.024;

    for (let lat = 0; lat <= latSegs; lat++) {
      const v = lat / latSegs;

      // Cross-section parameterization:
      //  0.00 -> 0.06: Flat inner cup floor (r = 0 -> baseR)
      //  0.06 -> 0.46: Inner pleated wall (bottom -> rim)
      //  0.46 -> 0.54: Rounded scalloped paper top lip
      //  0.54 -> 0.94: Outer pleated wall (rim -> bottom)
      //  0.94 -> 1.00: Flat outer cup bottom (baseR -> 0)
      let wallT, sideSign, lipRound, floorFactor;
      if (v < 0.06) {
        floorFactor = v / 0.06;
        wallT = 0.0;
        sideSign = -1.0;
        lipRound = 0.0;
      } else if (v < 0.46) {
        floorFactor = 1.0;
        wallT = (v - 0.06) / 0.40;
        sideSign = -1.0;
        lipRound = 0.0;
      } else if (v <= 0.54) {
        floorFactor = 1.0;
        const lt = (v - 0.46) / 0.08;
        const angle = lt * Math.PI;
        wallT = 1.0;
        sideSign = -Math.cos(angle);
        lipRound = Math.sin(angle);
      } else if (v <= 0.94) {
        floorFactor = 1.0;
        wallT = 1.0 - (v - 0.54) / 0.40;
        sideSign = 1.0;
        lipRound = 0.0;
      } else {
        floorFactor = 1.0 - (v - 0.94) / 0.06;
        wallT = 0.0;
        sideSign = 1.0;
        lipRound = 0.0;
      }

      const flareT = Math.pow(wallT, 0.92);

      for (let lon = 0; lon <= lonSegs; lon++) {
        const u = lon / lonSegs;
        const theta = u * Math.PI * 2.0;

        const pleatPhase = theta * nPleats;
        // Crisp pleated accordion wave
        const pleatWave = 0.82 * Math.cos(pleatPhase) + 0.18 * Math.cos(pleatPhase * 2.0);
        const petalWave = 0.5 + 0.5 * Math.cos(theta * 4.0);

        const pleatAmp = (0.012 + 0.052 * Math.pow(wallT, 1.1)) * pleatWave * floorFactor;
        const scallopY = (0.020 * (0.5 + 0.5 * Math.cos(pleatPhase)) + 0.044 * petalWave) * Math.pow(wallT, 1.5);

        const rMid = baseR * floorFactor + (rimR - baseR + 0.038 * petalWave * wallT) * flareT + pleatAmp;
        const yMid = baseY + (rimY - baseY) * wallT + scallopY + 0.010 * lipRound;

        const r = Math.max(0.0, rMid + sideSign * (wallThickness * 0.5) * floorFactor);
        const y = yMid - sideSign * (wallThickness * 0.22);

        positions[pIdx++] = r * Math.cos(theta);
        positions[pIdx++] = y;
        positions[pIdx++] = r * Math.sin(theta);

        uvs[uvIdx++] = theta;
        uvs[uvIdx++] = sideSign;

        const pleatCreaseAo = 0.74 + 0.26 * (0.5 + 0.5 * Math.cos(pleatPhase));
        let contactAo;
        if (sideSign < -0.2) {
          contactAo = 0.14 + 0.84 * Math.pow(wallT, 2.2);
        } else if (sideSign <= 0.2) {
          // Smooth top lip crest: full studio illumination
          contactAo = 0.96;
        } else {
          contactAo = (0.60 + 0.40 * Math.pow(wallT, 0.45)) * pleatCreaseAo;
        }
        aos[aoIdx++] = clamp(contactAo, 0.10, 1.0);
      }
    }

    let iIdx = 0;
    const stride = lonSegs + 1;
    for (let lat = 0; lat < latSegs; lat++) {
      for (let lon = 0; lon < lonSegs; lon++) {
        const a = lat * stride + lon;
        const b = a + stride;
        indices[iIdx++] = a;
        indices[iIdx++] = a + 1;
        indices[iIdx++] = b;

        indices[iIdx++] = a + 1;
        indices[iIdx++] = b + 1;
        indices[iIdx++] = b;
      }
    }

    const normals = computeSmoothNormals(positions, indices);
    return { positions, normals, uvs, aos, indices };
  }

  /**
   * 4. Delicate Inner Translucent Lace Liner (Tapetinho de Celofane Rendado)
   */
  function buildInnerLinerGeometry(lonSegs, latSegs, nPleats) {
    const vertCount = (lonSegs + 1) * (latSegs + 1);
    const positions = new Float32Array(vertCount * 3);
    const uvs = new Float32Array(vertCount * 2);
    const aos = new Float32Array(vertCount);
    const indices = new Uint16Array(lonSegs * latSegs * 6);

    let pIdx = 0;
    let uvIdx = 0;
    let aoIdx = 0;

    const innerBaseR = 1.04;
    const innerBaseY = -0.18;
    const outerRimR = 1.32;
    const outerRimY = 0.15;
    const thickness = 0.008;

    for (let lat = 0; lat <= latSegs; lat++) {
      const v = lat / latSegs;
      let wallT, sideSign, lipLift;
      if (v < 0.48) {
        wallT = v / 0.48;
        sideSign = -1.0;
        lipLift = 0.0;
      } else if (v <= 0.52) {
        const lt = (v - 0.48) / 0.04;
        wallT = 1.0;
        sideSign = -Math.cos(lt * Math.PI);
        lipLift = Math.sin(lt * Math.PI);
      } else {
        wallT = 1.0 - (v - 0.52) / 0.48;
        sideSign = 1.0;
        lipLift = 0.0;
      }

      for (let lon = 0; lon <= lonSegs; lon++) {
        const u = lon / lonSegs;
        const theta = u * Math.PI * 2.0;

        const cornerFlare = Math.pow(0.5 + 0.5 * Math.sin(theta * 4.0 + 0.78), 1.4);
        const microScallop = 0.5 + 0.5 * Math.cos(theta * nPleats * 1.5);

        const rMid = innerBaseR + (outerRimR - innerBaseR + 0.055 * cornerFlare) * wallT
                   + 0.016 * Math.cos(theta * nPleats) * wallT;
        const yMid = innerBaseY + (outerRimY - innerBaseY + 0.036 * cornerFlare + 0.014 * microScallop) * wallT
                   + 0.004 * lipLift;

        const r = rMid + sideSign * (thickness * 0.5);
        const y = yMid - sideSign * (thickness * 0.28);

        positions[pIdx++] = r * Math.cos(theta);
        positions[pIdx++] = y;
        positions[pIdx++] = r * Math.sin(theta);

        uvs[uvIdx++] = theta;
        uvs[uvIdx++] = wallT;

        aos[aoIdx++] = 0.22 + 0.78 * Math.pow(wallT, 1.4);
      }
    }

    let iIdx = 0;
    const stride = lonSegs + 1;
    for (let lat = 0; lat < latSegs; lat++) {
      for (let lon = 0; lon < lonSegs; lon++) {
        const a = lat * stride + lon;
        const b = a + stride;
        indices[iIdx++] = a;
        indices[iIdx++] = a + 1;
        indices[iIdx++] = b;

        indices[iIdx++] = a + 1;
        indices[iIdx++] = b + 1;
        indices[iIdx++] = b;
      }
    }

    const normals = computeSmoothNormals(positions, indices);
    return { positions, normals, uvs, aos, indices };
  }

  /**
   * 5. Delicate Macro-Suspended Callebaut Chocolate Flakes (14 Slow-Floating Splits)
   * Flat rectangular beveled chocolate flakes in rich dark & milk cocoa tones,
   * orbiting in a graceful wide peripheral halo behind/around the silhouette so
   * they stay inside the viewport and never photobomb across the center face.
   */
  function buildFloatingFlakesGeometry(count) {
    const radialSegs = 8;
    const ringSegs = 4;
    const vertsPerFlake = (radialSegs + 1) * (ringSegs + 1);
    const trisPerFlake = radialSegs * ringSegs * 2;

    const totalVerts = count * vertsPerFlake;
    const totalIndices = count * trisPerFlake * 3;

    const positions = new Float32Array(totalVerts * 3);
    const normals = new Float32Array(totalVerts * 3);
    const orbitParams = new Float32Array(totalVerts * 4);
    const motionParams = new Float32Array(totalVerts * 4);
    const colors = new Float32Array(totalVerts * 3);
    const indices = new Uint16Array(totalIndices);

    // Rich dark & milk Belgian chocolate flakes only (no pale tan capsules)
    const palette = [
      [0.025, 0.007, 0.0024],
      [0.048, 0.014, 0.0046],
      [0.095, 0.030, 0.0092],
      [0.145, 0.046, 0.0135]
    ];

    const rng = createRng(20170909);
    const halfW = 0.036;
    const halfL = 0.056;
    const halfH = 0.014;

    const tplPos = [];
    const tplNorm = [];
    for (let r = 0; r <= ringSegs; r++) {
      const v = r / ringSegs;
      const phi = (v - 0.5) * Math.PI;
      const ny = Math.sin(phi);
      const nr = Math.cos(phi);

      for (let s = 0; s <= radialSegs; s++) {
        const theta = (s / radialSegs) * Math.PI * 2.0;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const sx = (cosT >= 0 ? 1 : -1) * Math.pow(Math.abs(cosT), 0.42);
        const sz = (sinT >= 0 ? 1 : -1) * Math.pow(Math.abs(sinT), 0.42);

        tplPos.push(nr * sx * halfW, ny * halfH, nr * sz * halfL);
        tplNorm.push(nr * cosT, ny, nr * sinT);
      }
    }

    let vBase = 0;
    let iIdx = 0;

    for (let c = 0; c < count; c++) {
      const orbitRadius = 1.56 + rng() * 0.24;
      const baseAngle = c * 2.399963 + (rng() - 0.5) * 0.25;
      const orbitSpeed = (rng() > 0.25 ? 1 : -1) * (0.06 + rng() * 0.07);
      const baseY = -0.52 + (c / Math.max(count - 1, 1)) * 1.48 + (rng() - 0.5) * 0.14;

      const spinSpeed = 0.42 + rng() * 0.65;
      const phase = rng() * Math.PI * 2;
      const bobAmp = 0.04 + rng() * 0.06;
      const scale = 0.76 + rng() * 0.38;

      const col = palette[c % palette.length];

      const tiltA = rng() * Math.PI;
      const tiltB = rng() * Math.PI * 2;
      const ca = Math.cos(tiltA), sa = Math.sin(tiltA);
      const cb = Math.cos(tiltB), sb = Math.sin(tiltB);

      for (let v = 0; v < vertsPerFlake; v++) {
        const lx = tplPos[v * 3];
        const ly = tplPos[v * 3 + 1];
        const lz = tplPos[v * 3 + 2];

        const lnx = tplNorm[v * 3];
        const lny = tplNorm[v * 3 + 1];
        const lnz = tplNorm[v * 3 + 2];

        const py1 = ly * ca - lz * sa;
        const pz1 = ly * sa + lz * ca;
        const px2 = lx * cb - py1 * sb;
        const py2 = lx * sb + py1 * cb;

        const ny1 = lny * ca - lnz * sa;
        const nz1 = lny * sa + lnz * ca;
        const nx2 = lnx * cb - ny1 * sb;
        const ny2 = lnx * sb + ny1 * cb;

        const dst3 = (vBase + v) * 3;
        positions[dst3] = px2;
        positions[dst3 + 1] = py2;
        positions[dst3 + 2] = pz1;

        normals[dst3] = nx2;
        normals[dst3 + 1] = ny2;
        normals[dst3 + 2] = nz1;

        colors[dst3] = col[0];
        colors[dst3 + 1] = col[1];
        colors[dst3 + 2] = col[2];

        const dst4 = (vBase + v) * 4;
        orbitParams[dst4] = orbitRadius;
        orbitParams[dst4 + 1] = baseAngle;
        orbitParams[dst4 + 2] = orbitSpeed;
        orbitParams[dst4 + 3] = baseY;

        motionParams[dst4] = spinSpeed;
        motionParams[dst4 + 1] = phase;
        motionParams[dst4 + 2] = bobAmp;
        motionParams[dst4 + 3] = scale;
      }

      const stride = radialSegs + 1;
      for (let r = 0; r < ringSegs; r++) {
        for (let s = 0; s < radialSegs; s++) {
          const a = vBase + r * stride + s;
          const b = a + stride;
          indices[iIdx++] = a;
          indices[iIdx++] = b;
          indices[iIdx++] = a + 1;
          indices[iIdx++] = b;
          indices[iIdx++] = b + 1;
          indices[iIdx++] = a + 1;
        }
      }

      vBase += vertsPerFlake;
    }

    return { positions, normals, orbitParams, motionParams, colors, indices };
  }

  // =========================================================================
  // Synchronous Fallback + Real Photo WebGL Texture Builder
  // =========================================================================

  function createBrigadeiroPhotoTexture(gl, onTextureUpdated) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);

    const size = 64;
    const data = new Uint8Array(size * size * 4);
    const rng = createRng(163801042);
    for (let y = 0; y < size; y++) {
      const v = (y / size) * Math.PI * 2.0;
      for (let x = 0; x < size; x++) {
        const u = (x / size) * Math.PI * 2.0;
        const cell =
          Math.sin(u * 4.0 + Math.cos(v * 3.0)) *
          Math.cos(v * 4.0 - Math.sin(u * 3.0));
        const grain = (rng() - 0.5) * 16.0;
        const r = clamp(Math.round(108 + cell * 18 + grain), 45, 165);
        const g = clamp(Math.round(56 + cell * 10 + grain * 0.6), 20, 95);
        const b = clamp(Math.round(28 + cell * 5 + grain * 0.4), 8, 52);

        const idx = (y * size + x) * 4;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);

    function uploadImageToTexture(img) {
      if (!gl || gl.isContextLost()) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.generateMipmap(gl.TEXTURE_2D);
      if (typeof onTextureUpdated === 'function') {
        onTextureUpdated();
      }
    }

    let fullResLoaded = false;
    const embeddedImg = new Image();
    embeddedImg.onload = function () {
      if (!fullResLoaded) {
        uploadImageToTexture(embeddedImg);
      }
    };
    embeddedImg.src = EMBEDDED_REAL_TEX_URI;

    const localImg = new Image();
    localImg.onload = function () {
      fullResLoaded = true;
      uploadImageToTexture(localImg);
    };
    localImg.src = LOCAL_REAL_TEX_PATH;

    return tex;
  }

  // =========================================================================
  // Custom GLSL ES 1.00 Shaders (GGX PBR + Studio Softbox IBL + SSS + ACES)
  // =========================================================================

  const DESSERT_VERTEX_SHADER = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aUv;
    attribute float aAo;

    uniform mat4 uModelMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjMatrix;
    uniform mat3 uNormalMatrix;

    varying vec3 vWorldPos;
    varying vec3 vWorldNormal;
    varying vec3 vLocalPos;
    varying vec3 vLocalNormal;
    varying vec2 vUv;
    varying float vAo;

    void main(void) {
      vec4 worldPos = uModelMatrix * vec4(aPosition, 1.0);
      vWorldPos = worldPos.xyz;
      vWorldNormal = normalize(uNormalMatrix * aNormal);
      vLocalPos = aPosition;
      vLocalNormal = normalize(aNormal);
      vUv = aUv;
      vAo = aAo;

      gl_Position = uProjMatrix * uViewMatrix * worldPos;
    }
  `;

  const ENCRUSTED_VERTEX_SHADER = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aUv;
    attribute vec4 aColor;
    attribute float aAo;

    uniform mat4 uModelMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjMatrix;
    uniform mat3 uNormalMatrix;

    varying vec3 vWorldPos;
    varying vec3 vWorldNormal;
    varying vec3 vLocalPos;
    varying vec3 vLocalNormal;
    varying vec2 vUv;
    varying vec4 vColor;
    varying float vAo;

    void main(void) {
      vec4 worldPos = uModelMatrix * vec4(aPosition, 1.0);
      vWorldPos = worldPos.xyz;
      vWorldNormal = normalize(uNormalMatrix * aNormal);
      vLocalPos = aPosition;
      vLocalNormal = normalize(aNormal);
      vUv = aUv;
      vColor = aColor;
      vAo = aAo;

      gl_Position = uProjMatrix * uViewMatrix * worldPos;
    }
  `;

  const PBR_STUDIO_LIBRARY = `
    const float PI = 3.14159265359;

    float gyroid(vec3 p) {
      return dot(sin(p), cos(p.yzx));
    }

    float cocoaMicroNoise(vec3 p) {
      float n1 = gyroid(p * 30.0);
      float n2 = gyroid(p * 64.0 + vec3(2.1, 1.3, 3.7)) * 0.45;
      return (n1 + n2) * 0.35;
    }

    vec3 cocoaBumpGrad(vec3 p) {
      float eps = 0.005;
      float c = cocoaMicroNoise(p);
      float dx = cocoaMicroNoise(p + vec3(eps, 0.0, 0.0)) - c;
      float dy = cocoaMicroNoise(p + vec3(0.0, eps, 0.0)) - c;
      float dz = cocoaMicroNoise(p + vec3(0.0, 0.0, eps)) - c;
      return vec3(dx, dy, dz) / eps;
    }

    vec3 sampleTriplanarPhoto(sampler2D tex, vec3 p, vec3 n, float scale) {
      vec3 w = pow(abs(n), vec3(4.0));
      w /= max(w.x + w.y + w.z, 1e-5);
      vec3 tx = texture2D(tex, p.yz * scale).rgb;
      vec3 ty = texture2D(tex, p.xz * scale).rgb;
      vec3 tz = texture2D(tex, p.xy * scale).rgb;
      vec3 srgb = tx * w.x + ty * w.y + tz * w.z;
      return pow(max(srgb, vec3(0.0)), vec3(2.2));
    }

    float D_GGX(float NoH, float roughness) {
      float a = roughness * roughness;
      float a2 = a * a;
      float d = (NoH * a2 - NoH) * NoH + 1.0;
      return a2 / max(PI * d * d, 1e-6);
    }

    float V_SmithGGX(float NoV, float NoL, float roughness) {
      float a = roughness * roughness;
      float gv = NoL * sqrt((NoV - a * NoV) * NoV + a);
      float gl = NoV * sqrt((NoL - a * NoL) * NoL + a);
      return 0.5 / max(gv + gl, 1e-5);
    }

    vec3 F_Schlick(float VoH, vec3 f0) {
      float f = pow(clamp(1.0 - VoH, 0.0, 1.0), 5.0);
      return f0 + (vec3(1.0) - f0) * f;
    }

    vec3 F_SchlickRoughness(float NoV, vec3 f0, float roughness) {
      float f = pow(clamp(1.0 - NoV, 0.0, 1.0), 5.0);
      return f0 + (max(vec3(1.0 - roughness), f0) - f0) * f;
    }

    float computeSpecularAO(float NoV, float ao, float roughness) {
      return clamp(pow(NoV + ao, exp2(-16.0 * roughness - 1.0)) - 1.0 + ao, 0.0, 1.0);
    }

    vec3 evalStudioSoftboxIBL(vec3 R, float roughness) {
      float blur = 0.08 + roughness * roughness * 0.68;

      // Overhead Studio Softbox
      vec3 keyDir = normalize(vec3(0.30, 0.82, 0.49));
      vec3 keyRight = normalize(cross(vec3(0.0, 0.0, 1.0), keyDir));
      vec3 keyUp = cross(keyDir, keyRight);
      float kDot = dot(R, keyDir);
      float ku = abs(dot(R, keyRight));
      float kv = abs(dot(R, keyUp));
      float keyBox = step(0.0, kDot)
                   * (1.0 - smoothstep(0.34 - blur * 0.4, 0.45 + blur, ku))
                   * (1.0 - smoothstep(0.24 - blur * 0.4, 0.35 + blur, kv));

      // Front-Left Fill Strip Softbox
      vec3 fillDir = normalize(vec3(-0.74, 0.38, 0.55));
      float fillDot = max(dot(R, fillDir), 0.0);
      float fillStrip = pow(fillDot, mix(12.0, 2.5, roughness));

      // Warm Golden Back-Rim Card
      vec3 rimDir = normalize(vec3(-0.42, 0.58, -0.70));
      float rimDot = max(dot(R, rimDir), 0.0);
      float rimCard = pow(rimDot, mix(9.0, 2.0, roughness));

      // Ground bounce hints subtly at the Anger Orange hero backdrop
      float skyGrad = smoothstep(-0.35, 0.85, R.y);
      vec3 domeEnv = mix(vec3(0.22, 0.055, 0.012), vec3(0.20, 0.18, 0.16), skyGrad);

      return domeEnv
           + vec3(1.55, 1.46, 1.34) * keyBox
           + vec3(0.55, 0.49, 0.43) * fillStrip
           + vec3(0.85, 0.52, 0.22) * rimCard;
    }

    vec3 acesFilmic(vec3 x) {
      float a = 2.51;
      float b = 0.03;
      float c = 2.43;
      float d = 0.59;
      float e = 0.14;
      return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
    }
  `;

  const DESSERT_FRAGMENT_SHADER = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
    #else
      precision mediump float;
    #endif

    uniform vec3 uCameraPos;
    uniform float uMaterialId;
    uniform sampler2D uPhotoTex;

    varying vec3 vWorldPos;
    varying vec3 vWorldNormal;
    varying vec3 vLocalPos;
    varying vec3 vLocalNormal;
    varying vec2 vUv;
    varying float vAo;

    ` + PBR_STUDIO_LIBRARY + `

    void main(void) {
      vec3 N = normalize(vWorldNormal);
      vec3 V = normalize(uCameraPos - vWorldPos);
      float NoV = max(dot(N, V), 1e-4);

      vec3 L1 = normalize(vec3(1.8, 3.2, 2.4));
      vec3 L2 = normalize(vec3(-2.4, 1.2, 1.8));
      vec3 L3 = normalize(vec3(-1.6, 2.2, -2.2));

      vec3 linearColor = vec3(0.0);

      if (uMaterialId < 0.5) {
        // Material 0: Deep Glossy Brigadeiro Truffle Core in the crevices
        vec3 photoCol = sampleTriplanarPhoto(uPhotoTex, vLocalPos, vLocalNormal, 1.2);
        vec3 grad = cocoaBumpGrad(vLocalPos * 1.4);
        N = normalize(N - grad * 0.025);
        NoV = max(dot(N, V), 1e-4);

        vec3 baseAlbedo = mix(vec3(0.012, 0.0035, 0.0012), photoCol * 0.14, 0.40);
        float roughness = 0.12;
        vec3 f0 = vec3(0.046);

        float ao = clamp(vAo, 0.05, 1.0);
        float specAo = computeSpecularAO(NoV, ao, roughness);

        vec3 H1 = normalize(L1 + V);
        float NoL1 = max(dot(N, L1), 0.0);
        float NoH1 = max(dot(N, H1), 0.0);
        float VoH1 = max(dot(V, H1), 0.0);

        vec3 spec1 = D_GGX(NoH1, roughness) * V_SmithGGX(NoV, NoL1, roughness) * F_Schlick(VoH1, f0) * NoL1 * vec3(1.8, 1.7, 1.55);
        vec3 R = reflect(-V, N);
        vec3 ibl = evalStudioSoftboxIBL(R, roughness) * F_SchlickRoughness(NoV, f0, roughness);

        vec3 diffuse = baseAlbedo * (NoL1 * 1.3 + 0.25) * ao;
        linearColor = diffuse + (spec1 + ibl * 0.75) * specAo;

      } else if (uMaterialId < 1.5) {
        // Material 1: Crisp 36-Pleat White Confectionery Wrapper (Forminha Plissada)
        float theta = vUv.x;
        float sideSign = vUv.y;
        float wallT = clamp((vLocalPos.y + 0.88) / 1.02, 0.0, 1.0);
        float isOuter = smoothstep(-0.25, 0.25, sideSign);

        // Crisp radial pleat normal accent + subtle paper fiber grain
        float pleatWave = sin(theta * 36.0);
        float fiber = gyroid(vLocalPos * 54.0) * 0.012;
        vec3 tangentXZ = normalize(vec3(-vLocalPos.z, 0.0, vLocalPos.x) + vec3(1e-5, 0.0, 0.0));
        N = normalize(N + tangentXZ * (pleatWave * 0.16 * isOuter) + vec3(fiber));
        NoV = max(dot(N, V), 1e-4);

        // Clean warm bakery ivory-white paper outside, deep contact shadow deep inside bowl,
        // seamlessly matching bright paper across the scalloped lip (where wallT ~ 1.0)
        vec3 outerPaper = vec3(0.88, 0.83, 0.77);
        vec3 innerPaper = mix(vec3(0.11, 0.04, 0.02), vec3(0.84, 0.78, 0.71), smoothstep(0.32, 0.92, wallT));
        vec3 paperAlbedo = mix(innerPaper, outerPaper, isOuter);

        float roughness = 0.68;
        vec3 f0 = vec3(0.025);
        float ao = clamp(vAo, 0.08, 1.0);

        float NoL1 = max(dot(N, L1), 0.0);
        float wrapL1 = max((dot(N, L1) + 0.45) / 1.45, 0.0);
        float NoL2 = max((dot(N, L2) + 0.35) / 1.35, 0.0);
        float NoL3 = max(dot(N, L3), 0.0);

        // Subtle warm Anger Orange (#ff4100) bounce on underside of paper cup
        float underBounce = max(-N.y * 0.55 + 0.25, 0.0);
        vec3 envBounce = vec3(0.32, 0.09, 0.02) * underBounce * isOuter;

        // Warm paper subsurface translucency along thin pleated rim
        float backLight = max(dot(-N, L1), 0.0) * 0.45 + max(dot(-N, L3), 0.0) * 0.55;
        float pleatThinness = (0.25 + 0.75 * wallT) * (0.65 + 0.35 * cos(theta * 36.0));
        vec3 paperSSS = vec3(0.95, 0.68, 0.44) * backLight * pleatThinness * 0.32 * ao;

        vec3 H1 = normalize(L1 + V);
        float NoH1 = max(dot(N, H1), 0.0);
        float VoH1 = max(dot(V, H1), 0.0);
        vec3 spec1 = D_GGX(NoH1, roughness) * V_SmithGGX(NoV, NoL1, roughness) * F_Schlick(VoH1, f0) * NoL1;

        vec3 diffuse = paperAlbedo * (
          wrapL1 * vec3(1.10, 1.06, 1.00) +
          NoL2 * vec3(0.40, 0.37, 0.34) +
          NoL3 * vec3(0.32, 0.24, 0.16) +
          vec3(0.22, 0.19, 0.17) +
          envBounce
        ) * ao;

        linearColor = diffuse + paperSSS + spec1 * ao * 0.5;

      } else {
        // Material 2: Sheer Lace Inner Liner (Tapetinho Rendado)
        float theta = vUv.x;
        float wallT = vUv.y;

        float rimLace = smoothstep(0.68, 0.96, wallT) * (0.5 + 0.5 * sin(theta * 54.0));
        vec3 linerBase = mix(vec3(0.79, 0.73, 0.67), vec3(0.95, 0.92, 0.88), 0.45 + 0.55 * rimLace);

        float wrapL1 = max((dot(N, L1) + 0.55) / 1.55, 0.0);
        float fresnel = pow(1.0 - NoV, 2.2);
        float ao = clamp(vAo, 0.24, 1.0);

        linearColor = (linerBase * (wrapL1 * 1.08 + 0.36) + vec3(0.95, 0.90, 0.84) * fresnel * 0.28) * ao;
      }

      vec3 mapped = acesFilmic(linearColor * 1.02);
      vec3 srgb = pow(mapped, vec3(1.0 / 2.2));
      gl_FragColor = vec4(srgb, 1.0);
    }
  `;

  const ENCRUSTED_FRAGMENT_SHADER = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
    #else
      precision mediump float;
    #endif

    uniform vec3 uCameraPos;
    uniform sampler2D uPhotoTex;

    varying vec3 vWorldPos;
    varying vec3 vWorldNormal;
    varying vec3 vLocalPos;
    varying vec3 vLocalNormal;
    varying vec2 vUv;
    varying vec4 vColor;
    varying float vAo;

    ` + PBR_STUDIO_LIBRARY + `

    void main(void) {
      vec3 N = normalize(vWorldNormal);
      vec3 V = normalize(uCameraPos - vWorldPos);

      // 1. Sample real Conrado brigadeiro micro-grain photo texture for genuine cocoa texture & bump
      vec3 uvPhotoSrgb = texture2D(uPhotoTex, vUv * 1.45).rgb;
      vec3 uvPhotoLin = pow(max(uvPhotoSrgb, vec3(0.0)), vec3(2.2));
      vec3 triPhotoLin = sampleTriplanarPhoto(uPhotoTex, vLocalPos, vLocalNormal, 2.4);
      vec3 photoLin = mix(uvPhotoLin, triPhotoLin, 0.35);
      float photoLum = dot(photoLin, vec3(0.299, 0.587, 0.114));

      // Micro-bump from real photo grain + seamless 3D cocoa gyroid
      float photoDx = dot(texture2D(uPhotoTex, vUv * 1.45 + vec2(0.015, 0.0)).rgb - uvPhotoSrgb, vec3(0.333));
      float photoDy = dot(texture2D(uPhotoTex, vUv * 1.45 + vec2(0.0, 0.015)).rgb - uvPhotoSrgb, vec3(0.333));
      vec3 grad = cocoaBumpGrad(vLocalPos * 1.5);
      N = normalize(N - grad * 0.016 + vec3(photoDx, photoDy, 0.0) * 0.28);
      float NoV = max(dot(N, V), 1e-4);

      // 2. Keep clean Belgian Callebaut split colors modulated subtly by photographic micro-grain
      float grainMod = clamp(0.86 + (photoLum - 0.11) * 1.6, 0.78, 1.22);
      vec3 splitAlbedo = vColor.rgb * grainMod;

      // Deep wet ganache crevice darkening at embedded base skirt
      float ao = clamp(vAo, 0.05, 1.0);
      float creviceMask = smoothstep(0.05, 0.48, ao);
      vec3 crevicePaste = vec3(0.008, 0.0022, 0.0007);
      vec3 baseAlbedo = mix(crevicePaste, splitAlbedo, creviceMask);

      // 3. Tempered Satin Chocolate Roughness (0.27..0.38 on splits, glossy 0.11 in wet crevices)
      float roughness = mix(0.11, clamp(vColor.a + (0.12 - photoLum) * 0.08, 0.25, 0.40), creviceMask);
      float clearcoatRoughness = mix(0.09, 0.18, creviceMask);
      vec3 f0 = vec3(0.045);

      vec3 L1 = normalize(vec3(1.8, 3.2, 2.4));
      vec3 L2 = normalize(vec3(-2.4, 1.3, 1.8));
      vec3 L3 = normalize(vec3(-1.6, 2.3, -2.2));

      float NoL1 = max(dot(N, L1), 0.0);
      float NoL2 = max(dot(N, L2), 0.0);
      float NoL3 = max(dot(N, L3), 0.0);

      float wrap1 = max((dot(N, L1) + 0.32) / 1.32, 0.0);
      float wrap2 = max((dot(N, L2) + 0.28) / 1.28, 0.0);

      // Cook-Torrance GGX Specular (Tempered Satin Primary + Subtle Cocoa Butter Coat)
      vec3 H1 = normalize(L1 + V);
      float NoH1 = max(dot(N, H1), 0.0);
      float VoH1 = max(dot(V, H1), 0.0);
      vec3 F1 = F_Schlick(VoH1, f0);
      vec3 specKey = D_GGX(NoH1, roughness) * V_SmithGGX(NoV, NoL1, roughness) * F1 * NoL1;
      float ccWeight = mix(0.55, 0.14, creviceMask);
      vec3 ccKey = D_GGX(NoH1, clearcoatRoughness) * V_SmithGGX(NoV, NoL1, clearcoatRoughness) * F1 * NoL1 * ccWeight;

      vec3 H2 = normalize(L2 + V);
      float NoH2 = max(dot(N, H2), 0.0);
      float VoH2 = max(dot(V, H2), 0.0);
      vec3 specFill = D_GGX(NoH2, roughness) * V_SmithGGX(NoV, NoL2, roughness) * F_Schlick(VoH2, f0) * NoL2;

      vec3 H3 = normalize(L3 + V);
      float NoH3 = max(dot(N, H3), 0.0);
      float VoH3 = max(dot(V, H3), 0.0);
      vec3 specRim = D_GGX(NoH3, roughness * 0.92) * V_SmithGGX(NoV, NoL3, roughness * 0.92) * F_Schlick(VoH3, f0) * NoL3;

      vec3 R = reflect(-V, N);
      vec3 F_ibl = F_SchlickRoughness(NoV, f0, roughness);
      vec3 iblPrimary = evalStudioSoftboxIBL(R, roughness) * F_ibl * 0.72;
      vec3 iblClearcoat = evalStudioSoftboxIBL(R, clearcoatRoughness) * F_ibl * (0.14 * ccWeight / 0.14);

      float specAo = computeSpecularAO(NoV, ao, roughness);

      // Rich Warm Cocoa Subsurface Scattering at bevel edges
      float sssWrap = clamp(dot(N, L1) + 0.50, 0.0, 1.0) * (1.0 - NoL1);
      float backScatter = pow(clamp(dot(-V, L1 + N * 0.45), 0.0, 1.0), 3.0);
      vec3 sssColor = (baseAlbedo * vec3(1.85, 0.58, 0.14) + vec3(0.032, 0.007, 0.001))
                    * (sssWrap * 0.55 + backScatter * 0.35) * ao;

      vec3 diffuse = baseAlbedo * (
        wrap1 * vec3(2.25, 2.08, 1.88) +
        wrap2 * vec3(0.80, 0.70, 0.60) +
        NoL3  * vec3(0.88, 0.56, 0.28) +
        vec3(0.24, 0.18, 0.13)
      ) * ao;

      vec3 directSpec = (specKey + ccKey) * vec3(1.75, 1.62, 1.46)
                      + specFill * vec3(0.65, 0.58, 0.50)
                      + specRim * vec3(1.10, 0.72, 0.34);

      vec3 linearColor = diffuse + sssColor + (directSpec + iblPrimary + iblClearcoat) * specAo;

      vec3 mapped = acesFilmic(linearColor * 1.02);
      vec3 srgb = pow(mapped, vec3(1.0 / 2.2));
      gl_FragColor = vec4(srgb, 1.0);
    }
  `;

  const SPRINKLE_VERTEX_SHADER = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec4 aOrbitParams;
    attribute vec4 aMotionParams;
    attribute vec3 aColor;

    uniform mat4 uViewMatrix;
    uniform mat4 uProjMatrix;
    uniform float uTime;
    uniform vec2 uPointer;
    uniform float uScroll;
    uniform float uSceneScale;

    varying vec3 vWorldPos;
    varying vec3 vWorldNormal;
    varying vec3 vColor;

    void main(void) {
      float orbitRadius = aOrbitParams.x * (1.0 + uScroll * 0.10);
      float baseAngle = aOrbitParams.y;
      float orbitSpeed = aOrbitParams.z;
      float baseY = aOrbitParams.w;

      float spinSpeed = aMotionParams.x;
      float phase = aMotionParams.y;
      float bobAmp = aMotionParams.z;
      float scale = aMotionParams.w * uSceneScale;

      float spinA = uTime * spinSpeed + phase;
      float spinB = uTime * spinSpeed * 0.63 + phase * 1.4;
      float ca = cos(spinA), sa = sin(spinA);
      float cb = cos(spinB), sb = sin(spinB);

      vec3 p = aPosition * scale;
      vec3 n = aNormal;

      p = vec3(p.x, p.y * ca - p.z * sa, p.y * sa + p.z * ca);
      p = vec3(p.x * cb + p.z * sb, p.y, -p.x * sb + p.z * cb);

      n = vec3(n.x, n.y * ca - n.z * sa, n.y * sa + n.z * ca);
      n = vec3(n.x * cb + n.z * sb, n.y, -n.x * sb + n.z * cb);

      float angle = baseAngle + uTime * orbitSpeed + uScroll * 0.55 + uPointer.x * 0.22;
      float depthFactor = 0.35 + 0.65 * ((orbitRadius - 1.55) / 0.5);

      // Push z slightly behind front center so floating flakes gracefully frame the silhouette
      // without ever crossing directly in front of the brigadeiro center face
      float rawX = cos(angle) * orbitRadius * uSceneScale;
      float rawZ = sin(angle) * orbitRadius * uSceneScale;
      float frameZ = rawZ > 0.25 ? (0.25 - (rawZ - 0.25) * 0.55) : rawZ;

      vec3 center = vec3(
        rawX + uPointer.x * 0.14 * depthFactor,
        (baseY + sin(uTime * 1.15 + phase) * bobAmp + uScroll * 0.24) * uSceneScale - uPointer.y * 0.12 * depthFactor,
        frameZ
      );

      vec3 worldPos = center + p;
      vWorldPos = worldPos;
      vWorldNormal = normalize(n);
      vColor = aColor;

      gl_Position = uProjMatrix * uViewMatrix * vec4(worldPos, 1.0);
    }
  `;

  const SPRINKLE_FRAGMENT_SHADER = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
    #else
      precision mediump float;
    #endif

    uniform vec3 uCameraPos;

    varying vec3 vWorldPos;
    varying vec3 vWorldNormal;
    varying vec3 vColor;

    ` + PBR_STUDIO_LIBRARY + `

    void main(void) {
      vec3 N = normalize(vWorldNormal);
      vec3 V = normalize(uCameraPos - vWorldPos);
      float NoV = max(dot(N, V), 1e-4);

      float roughness = 0.30;
      vec3 f0 = vec3(0.045);

      vec3 L1 = normalize(vec3(1.8, 3.2, 2.4));
      vec3 L2 = normalize(vec3(-2.2, 1.2, 1.6));

      float NoL1 = max(dot(N, L1), 0.0);
      float wrap1 = max((dot(N, L1) + 0.35) / 1.35, 0.0);
      float wrap2 = max((dot(N, L2) + 0.30) / 1.30, 0.0);

      vec3 H1 = normalize(L1 + V);
      float NoH1 = max(dot(N, H1), 0.0);
      float VoH1 = max(dot(V, H1), 0.0);
      vec3 spec1 = D_GGX(NoH1, roughness) * V_SmithGGX(NoV, NoL1, roughness) * F_Schlick(VoH1, f0) * NoL1;

      vec3 R = reflect(-V, N);
      vec3 ibl = evalStudioSoftboxIBL(R, roughness) * F_SchlickRoughness(NoV, f0, roughness) * 0.65;

      vec3 linearColor = vColor * (wrap1 * 2.1 + wrap2 * 0.75 + 0.30) + spec1 * 1.55 + ibl;
      vec3 mapped = acesFilmic(linearColor * 1.02);
      vec3 srgb = pow(mapped, vec3(1.0 / 2.2));
      gl_FragColor = vec4(srgb, 1.0);
    }
  `;

  // =========================================================================
  // WebGL Compilation & Buffer Helpers
  // =========================================================================

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createProgram(gl, vsSource, fsSource) {
    const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      return null;
    }
    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return null;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return null;
    }
    return program;
  }

  function createArrayBuffer(gl, data) {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buf;
  }

  function createIndexBuffer(gl, data) {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buf;
  }

  function uploadDessertMesh(gl, geo) {
    return {
      posBuf: createArrayBuffer(gl, geo.positions),
      normBuf: createArrayBuffer(gl, geo.normals),
      uvBuf: createArrayBuffer(gl, geo.uvs),
      aoBuf: createArrayBuffer(gl, geo.aos),
      idxBuf: createIndexBuffer(gl, geo.indices),
      count: geo.indices.length
    };
  }

  function uploadEncrustedMesh(gl, geo) {
    return {
      posBuf: createArrayBuffer(gl, geo.positions),
      normBuf: createArrayBuffer(gl, geo.normals),
      uvBuf: createArrayBuffer(gl, geo.uvs),
      colorBuf: createArrayBuffer(gl, geo.colors),
      aoBuf: createArrayBuffer(gl, geo.aos),
      idxBuf: createIndexBuffer(gl, geo.indices),
      count: geo.indices.length
    };
  }

  function uploadSprinklesMesh(gl, geo) {
    return {
      posBuf: createArrayBuffer(gl, geo.positions),
      normBuf: createArrayBuffer(gl, geo.normals),
      orbitBuf: createArrayBuffer(gl, geo.orbitParams),
      motionBuf: createArrayBuffer(gl, geo.motionParams),
      colorBuf: createArrayBuffer(gl, geo.colors),
      idxBuf: createIndexBuffer(gl, geo.indices),
      count: geo.indices.length
    };
  }

  // =========================================================================
  // Class State Helpers
  // =========================================================================

  function setCanvasStateClass(canvas, container, isReady) {
    const addCls = isReady ? 'webgl-ready' : 'webgl-fallback';
    const remCls = isReady ? 'webgl-fallback' : 'webgl-ready';
    canvas.classList.remove(remCls);
    canvas.classList.add(addCls);
    if (container && container !== canvas) {
      container.classList.remove(remCls);
      container.classList.add(addCls);
    }
  }

  // =========================================================================
  // Main Initialization
  // =========================================================================

  function initConradoWebGL() {
    const canvas = document.getElementById(TARGET_CANVAS_ID);
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      return;
    }

    const container = canvas.closest('.hero-canvas-wrap') || canvas.parentElement;

    const contextOptions = {
      alpha: true,
      antialias: true,
      depth: true,
      stencil: false,
      powerPreference: 'high-performance',
      premultipliedAlpha: true
    };

    let gl = null;
    try {
      gl = canvas.getContext('webgl', contextOptions) ||
           canvas.getContext('experimental-webgl', contextOptions);
    } catch (_) {
      gl = null;
    }

    if (!gl) {
      setCanvasStateClass(canvas, container, false);
      return;
    }

    let destroyed = false;
    let rafId = null;
    let isCanvasVisible = true;
    let isDocHidden = Boolean(document.hidden);

    const motionQuery = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    let prefersReducedMotion = Boolean(motionQuery && motionQuery.matches);

    let dessertProg = null;
    let encrustedProg = null;
    let sprinkleProg = null;
    let dessertUniforms = null;
    let encrustedUniforms = null;
    let sprinkleUniforms = null;
    let dessertAttribs = null;
    let encrustedAttribs = null;
    let sprinkleAttribs = null;
    let meshes = null;
    let encrustedMesh = null;
    let sprinkleMesh = null;
    let photoTex = null;

    function destroyGLResources() {
      if (!gl) return;
      if (meshes) {
        for (let i = 0; i < meshes.length; i++) {
          const m = meshes[i].mesh;
          gl.deleteBuffer(m.posBuf);
          gl.deleteBuffer(m.normBuf);
          gl.deleteBuffer(m.uvBuf);
          gl.deleteBuffer(m.aoBuf);
          gl.deleteBuffer(m.idxBuf);
        }
      }
      if (encrustedMesh) {
        gl.deleteBuffer(encrustedMesh.posBuf);
        gl.deleteBuffer(encrustedMesh.normBuf);
        gl.deleteBuffer(encrustedMesh.uvBuf);
        gl.deleteBuffer(encrustedMesh.colorBuf);
        gl.deleteBuffer(encrustedMesh.aoBuf);
        gl.deleteBuffer(encrustedMesh.idxBuf);
      }
      if (sprinkleMesh) {
        gl.deleteBuffer(sprinkleMesh.posBuf);
        gl.deleteBuffer(sprinkleMesh.normBuf);
        gl.deleteBuffer(sprinkleMesh.orbitBuf);
        gl.deleteBuffer(sprinkleMesh.motionBuf);
        gl.deleteBuffer(sprinkleMesh.colorBuf);
        gl.deleteBuffer(sprinkleMesh.idxBuf);
      }
      if (photoTex) gl.deleteTexture(photoTex);
      if (dessertProg) gl.deleteProgram(dessertProg);
      if (encrustedProg) gl.deleteProgram(encrustedProg);
      if (sprinkleProg) gl.deleteProgram(sprinkleProg);

      meshes = null;
      encrustedMesh = null;
      sprinkleMesh = null;
      photoTex = null;
      dessertProg = null;
      encrustedProg = null;
      sprinkleProg = null;
    }

    function initGLPipeline() {
      dessertProg = createProgram(gl, DESSERT_VERTEX_SHADER, DESSERT_FRAGMENT_SHADER);
      encrustedProg = createProgram(gl, ENCRUSTED_VERTEX_SHADER, ENCRUSTED_FRAGMENT_SHADER);
      sprinkleProg = createProgram(gl, SPRINKLE_VERTEX_SHADER, SPRINKLE_FRAGMENT_SHADER);

      if (!dessertProg || !encrustedProg || !sprinkleProg) {
        destroyGLResources();
        return false;
      }

      dessertAttribs = {
        aPosition: gl.getAttribLocation(dessertProg, 'aPosition'),
        aNormal: gl.getAttribLocation(dessertProg, 'aNormal'),
        aUv: gl.getAttribLocation(dessertProg, 'aUv'),
        aAo: gl.getAttribLocation(dessertProg, 'aAo')
      };

      dessertUniforms = {
        uModelMatrix: gl.getUniformLocation(dessertProg, 'uModelMatrix'),
        uViewMatrix: gl.getUniformLocation(dessertProg, 'uViewMatrix'),
        uProjMatrix: gl.getUniformLocation(dessertProg, 'uProjMatrix'),
        uNormalMatrix: gl.getUniformLocation(dessertProg, 'uNormalMatrix'),
        uCameraPos: gl.getUniformLocation(dessertProg, 'uCameraPos'),
        uMaterialId: gl.getUniformLocation(dessertProg, 'uMaterialId'),
        uPhotoTex: gl.getUniformLocation(dessertProg, 'uPhotoTex')
      };

      encrustedAttribs = {
        aPosition: gl.getAttribLocation(encrustedProg, 'aPosition'),
        aNormal: gl.getAttribLocation(encrustedProg, 'aNormal'),
        aUv: gl.getAttribLocation(encrustedProg, 'aUv'),
        aColor: gl.getAttribLocation(encrustedProg, 'aColor'),
        aAo: gl.getAttribLocation(encrustedProg, 'aAo')
      };

      encrustedUniforms = {
        uModelMatrix: gl.getUniformLocation(encrustedProg, 'uModelMatrix'),
        uViewMatrix: gl.getUniformLocation(encrustedProg, 'uViewMatrix'),
        uProjMatrix: gl.getUniformLocation(encrustedProg, 'uProjMatrix'),
        uNormalMatrix: gl.getUniformLocation(encrustedProg, 'uNormalMatrix'),
        uCameraPos: gl.getUniformLocation(encrustedProg, 'uCameraPos'),
        uPhotoTex: gl.getUniformLocation(encrustedProg, 'uPhotoTex')
      };

      sprinkleAttribs = {
        aPosition: gl.getAttribLocation(sprinkleProg, 'aPosition'),
        aNormal: gl.getAttribLocation(sprinkleProg, 'aNormal'),
        aOrbitParams: gl.getAttribLocation(sprinkleProg, 'aOrbitParams'),
        aMotionParams: gl.getAttribLocation(sprinkleProg, 'aMotionParams'),
        aColor: gl.getAttribLocation(sprinkleProg, 'aColor')
      };

      sprinkleUniforms = {
        uViewMatrix: gl.getUniformLocation(sprinkleProg, 'uViewMatrix'),
        uProjMatrix: gl.getUniformLocation(sprinkleProg, 'uProjMatrix'),
        uCameraPos: gl.getUniformLocation(sprinkleProg, 'uCameraPos'),
        uTime: gl.getUniformLocation(sprinkleProg, 'uTime'),
        uPointer: gl.getUniformLocation(sprinkleProg, 'uPointer'),
        uScroll: gl.getUniformLocation(sprinkleProg, 'uScroll'),
        uSceneScale: gl.getUniformLocation(sprinkleProg, 'uSceneScale')
      };

      const coreRadius = 1.00;
      meshes = [
        {
          mesh: uploadDessertMesh(gl, buildBrigadeiroCoreGeometry(64, 48, coreRadius)),
          materialId: 0.0
        },
        {
          mesh: uploadDessertMesh(gl, buildForminhaPlissadaGeometry(288, 44, 36)),
          materialId: 1.0
        },
        {
          mesh: uploadDessertMesh(gl, buildInnerLinerGeometry(216, 20, 36)),
          materialId: 2.0
        }
      ];

      encrustedMesh = uploadEncrustedMesh(gl, buildEncrustedConfeitosGeometry(820, coreRadius));
      sprinkleMesh = uploadSprinklesMesh(gl, buildFloatingFlakesGeometry(14));

      photoTex = createBrigadeiroPhotoTexture(gl, function () {
        if (!destroyed && isCanvasVisible && !isDocHidden) {
          renderFrame();
        }
      });

      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);
      gl.clearColor(0.0, 0.0, 0.0, 0.0);

      return true;
    }

    if (!initGLPipeline()) {
      setCanvasStateClass(canvas, container, false);
      return;
    }

    setCanvasStateClass(canvas, container, true);

    const projMatrix = mat4Create();
    const viewMatrix = mat4Create();
    const modelMatrix = mat4Create();
    const normalMatrix = new Float32Array(9);

    const tmpT = mat4Create();
    const tmpRX = mat4Create();
    const tmpRY = mat4Create();
    const tmpRZ = mat4Create();
    const tmpS = mat4Create();
    const tmpA = mat4Create();
    const tmpB = mat4Create();

    let viewportAspect = 1.0;
    let cameraZ = 5.45;
    let sceneScale = 1.00;

    let targetPtrX = 0.0;
    let targetPtrY = 0.0;
    let currPtrX = 0.0;
    let currPtrY = 0.0;

    let targetScroll = 0.0;
    let currScroll = 0.0;

    let simTime = prefersReducedMotion ? 1.15 : 0.0;
    let lastTimestamp = 0;

    function updateCanvasSize() {
      if (destroyed || !gl) return false;
      const rect = canvas.getBoundingClientRect();
      const cssW = rect.width;
      const cssH = rect.height;
      if (cssW <= 0 || cssH <= 0) return false;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const pixelW = Math.max(1, Math.round(cssW * dpr));
      const pixelH = Math.max(1, Math.round(cssH * dpr));

      if (canvas.width !== pixelW || canvas.height !== pixelH) {
        canvas.width = pixelW;
        canvas.height = pixelH;
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      viewportAspect = canvas.width / canvas.height;

      cameraZ = viewportAspect < 1.0 ? 5.75 / Math.max(viewportAspect, 0.72) : 5.65;
      sceneScale = viewportAspect < 0.85 ? 0.94 : 1.00;

      mat4Perspective(projMatrix, (34 * Math.PI) / 180, viewportAspect, 0.1, 35.0);
      mat4Translate(viewMatrix, 0.0, 0.05, -cameraZ);
      return true;
    }

    function updateScrollTarget() {
      const vh = Math.max(window.innerHeight || 800, 320);
      targetScroll = clamp((window.scrollY || window.pageYOffset || 0) / vh, 0.0, 1.5);
    }

    const maxAttribs = Math.max(
      dessertAttribs.aPosition, dessertAttribs.aNormal, dessertAttribs.aUv, dessertAttribs.aAo,
      encrustedAttribs.aPosition, encrustedAttribs.aNormal, encrustedAttribs.aUv,
      encrustedAttribs.aColor, encrustedAttribs.aAo,
      sprinkleAttribs.aPosition, sprinkleAttribs.aNormal,
      sprinkleAttribs.aOrbitParams, sprinkleAttribs.aMotionParams, sprinkleAttribs.aColor
    ) + 1;

    function enableOnlyAttribs(activeIndices) {
      for (let i = 0; i < maxAttribs; i++) {
        if (activeIndices.indexOf(i) !== -1) {
          gl.enableVertexAttribArray(i);
        } else {
          gl.disableVertexAttribArray(i);
        }
      }
    }

    function bindAttrib(loc, buffer, size) {
      if (loc < 0) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    }

    function renderFrame() {
      if (destroyed || !gl || gl.isContextLost()) return;
      if (canvas.width === 0 || canvas.height === 0) return;

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const t = simTime;
      const ptrX = prefersReducedMotion ? 0.0 : currPtrX;
      const ptrY = prefersReducedMotion ? 0.0 : currPtrY;
      const scroll = prefersReducedMotion ? 0.0 : currScroll;

      const floatY = prefersReducedMotion ? 0.0 : Math.sin(t * 1.05) * 0.050;
      const parallaxY = -scroll * 0.30;
      const rotY = t * 0.24 + ptrX * 0.50 + scroll * 1.25;
      const rotX = 0.50 + Math.sin(t * 0.65) * 0.030 + ptrY * 0.26 + scroll * 0.18;
      const rotZ = -0.04 + Math.cos(t * 0.50) * 0.022 - ptrX * 0.10;

      mat4Translate(tmpT, 0.0, floatY + parallaxY - 0.10, 0.0);
      mat4RotateY(tmpRY, rotY);
      mat4RotateX(tmpRX, rotX);
      mat4RotateZ(tmpRZ, rotZ);
      mat4Scale(tmpS, sceneScale, sceneScale, sceneScale);

      mat4Multiply(tmpA, tmpT, tmpRX);
      mat4Multiply(tmpB, tmpA, tmpRZ);
      mat4Multiply(tmpA, tmpB, tmpRY);
      mat4Multiply(modelMatrix, tmpA, tmpS);

      mat3NormalFromMat4(normalMatrix, modelMatrix);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, photoTex);

      gl.useProgram(dessertProg);
      enableOnlyAttribs([
        dessertAttribs.aPosition,
        dessertAttribs.aNormal,
        dessertAttribs.aUv,
        dessertAttribs.aAo
      ]);

      gl.uniformMatrix4fv(dessertUniforms.uModelMatrix, false, modelMatrix);
      gl.uniformMatrix4fv(dessertUniforms.uViewMatrix, false, viewMatrix);
      gl.uniformMatrix4fv(dessertUniforms.uProjMatrix, false, projMatrix);
      gl.uniformMatrix3fv(dessertUniforms.uNormalMatrix, false, normalMatrix);
      gl.uniform3f(dessertUniforms.uCameraPos, 0.0, -0.05, cameraZ);
      gl.uniform1i(dessertUniforms.uPhotoTex, 0);

      for (let i = 0; i < meshes.length; i++) {
        const item = meshes[i];
        const m = item.mesh;

        gl.uniform1f(dessertUniforms.uMaterialId, item.materialId);

        bindAttrib(dessertAttribs.aPosition, m.posBuf, 3);
        bindAttrib(dessertAttribs.aNormal, m.normBuf, 3);
        bindAttrib(dessertAttribs.aUv, m.uvBuf, 2);
        bindAttrib(dessertAttribs.aAo, m.aoBuf, 1);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.idxBuf);
        gl.drawElements(gl.TRIANGLES, m.count, gl.UNSIGNED_SHORT, 0);
      }

      gl.useProgram(encrustedProg);
      enableOnlyAttribs([
        encrustedAttribs.aPosition,
        encrustedAttribs.aNormal,
        encrustedAttribs.aUv,
        encrustedAttribs.aColor,
        encrustedAttribs.aAo
      ]);

      gl.uniformMatrix4fv(encrustedUniforms.uModelMatrix, false, modelMatrix);
      gl.uniformMatrix4fv(encrustedUniforms.uViewMatrix, false, viewMatrix);
      gl.uniformMatrix4fv(encrustedUniforms.uProjMatrix, false, projMatrix);
      gl.uniformMatrix3fv(encrustedUniforms.uNormalMatrix, false, normalMatrix);
      gl.uniform3f(encrustedUniforms.uCameraPos, 0.0, -0.05, cameraZ);
      gl.uniform1i(encrustedUniforms.uPhotoTex, 0);

      bindAttrib(encrustedAttribs.aPosition, encrustedMesh.posBuf, 3);
      bindAttrib(encrustedAttribs.aNormal, encrustedMesh.normBuf, 3);
      bindAttrib(encrustedAttribs.aUv, encrustedMesh.uvBuf, 2);
      bindAttrib(encrustedAttribs.aColor, encrustedMesh.colorBuf, 4);
      bindAttrib(encrustedAttribs.aAo, encrustedMesh.aoBuf, 1);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, encrustedMesh.idxBuf);
      gl.drawElements(gl.TRIANGLES, encrustedMesh.count, gl.UNSIGNED_SHORT, 0);

      gl.useProgram(sprinkleProg);
      enableOnlyAttribs([
        sprinkleAttribs.aPosition,
        sprinkleAttribs.aNormal,
        sprinkleAttribs.aOrbitParams,
        sprinkleAttribs.aMotionParams,
        sprinkleAttribs.aColor
      ]);

      gl.uniformMatrix4fv(sprinkleUniforms.uViewMatrix, false, viewMatrix);
      gl.uniformMatrix4fv(sprinkleUniforms.uProjMatrix, false, projMatrix);
      gl.uniform3f(sprinkleUniforms.uCameraPos, 0.0, -0.05, cameraZ);
      gl.uniform1f(sprinkleUniforms.uTime, t);
      gl.uniform2f(sprinkleUniforms.uPointer, ptrX, ptrY);
      gl.uniform1f(sprinkleUniforms.uScroll, scroll);
      gl.uniform1f(sprinkleUniforms.uSceneScale, sceneScale);

      bindAttrib(sprinkleAttribs.aPosition, sprinkleMesh.posBuf, 3);
      bindAttrib(sprinkleAttribs.aNormal, sprinkleMesh.normBuf, 3);
      bindAttrib(sprinkleAttribs.aOrbitParams, sprinkleMesh.orbitBuf, 4);
      bindAttrib(sprinkleAttribs.aMotionParams, sprinkleMesh.motionBuf, 4);
      bindAttrib(sprinkleAttribs.aColor, sprinkleMesh.colorBuf, 3);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sprinkleMesh.idxBuf);
      gl.drawElements(gl.TRIANGLES, sprinkleMesh.count, gl.UNSIGNED_SHORT, 0);
    }

    function shouldAnimate() {
      return !destroyed &&
             !prefersReducedMotion &&
             isCanvasVisible &&
             !isDocHidden &&
             gl &&
             !gl.isContextLost();
    }

    function stopLoop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function tick(now) {
      if (!shouldAnimate()) {
        rafId = null;
        return;
      }

      if (lastTimestamp === 0) {
        lastTimestamp = now;
      }
      const dt = Math.min((now - lastTimestamp) * 0.001, 0.05);
      lastTimestamp = now;

      simTime += dt;

      const ptrAlpha = 1.0 - Math.exp(-7.5 * dt);
      const scrollAlpha = 1.0 - Math.exp(-8.5 * dt);

      currPtrX += (targetPtrX - currPtrX) * ptrAlpha;
      currPtrY += (targetPtrY - currPtrY) * ptrAlpha;
      currScroll += (targetScroll - currScroll) * scrollAlpha;

      renderFrame();
      rafId = requestAnimationFrame(tick);
    }

    function syncLoopState() {
      if (shouldAnimate()) {
        if (rafId === null) {
          lastTimestamp = 0;
          rafId = requestAnimationFrame(tick);
        }
      } else {
        stopLoop();
        if (prefersReducedMotion && isCanvasVisible && !isDocHidden) {
          renderFrame();
        }
      }
    }

    function onPointerMove(e) {
      const vw = Math.max(window.innerWidth || 1, 1);
      const vh = Math.max(window.innerHeight || 1, 1);
      targetPtrX = clamp((e.clientX / vw) * 2.0 - 1.0, -1.0, 1.0);
      targetPtrY = clamp((e.clientY / vh) * 2.0 - 1.0, -1.0, 1.0);
    }

    function onPointerReset() {
      targetPtrX = 0.0;
      targetPtrY = 0.0;
    }

    function onScroll() {
      updateScrollTarget();
      if (!('IntersectionObserver' in window)) {
        const rect = canvas.getBoundingClientRect();
        const nowVisible = rect.bottom > 0 && rect.top < (window.innerHeight || 800);
        if (nowVisible !== isCanvasVisible) {
          isCanvasVisible = nowVisible;
          syncLoopState();
        }
      }
    }

    function onResize() {
      if (updateCanvasSize()) {
        renderFrame();
      }
    }

    function onVisibilityChange() {
      isDocHidden = Boolean(document.hidden);
      syncLoopState();
    }

    function onReducedMotionChange(e) {
      prefersReducedMotion = Boolean(e.matches);
      if (prefersReducedMotion) {
        simTime = 1.15;
      }
      syncLoopState();
    }

    function onContextLost(e) {
      e.preventDefault();
      stopLoop();
      setCanvasStateClass(canvas, container, false);
    }

    function onContextRestored() {
      if (destroyed) return;
      if (initGLPipeline() && updateCanvasSize()) {
        setCanvasStateClass(canvas, container, true);
        renderFrame();
        syncLoopState();
      } else {
        setCanvasStateClass(canvas, container, false);
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointercancel', onPointerReset, { passive: true });
    document.addEventListener('mouseleave', onPointerReset, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    canvas.addEventListener('webglcontextlost', onContextLost, false);
    canvas.addEventListener('webglcontextrestored', onContextRestored, false);

    let resizeObserver = null;
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(function () {
        onResize();
      });
      resizeObserver.observe(canvas);
    }

    let intersectionObserver = null;
    if ('IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver(
        function (entries) {
          for (let i = 0; i < entries.length; i++) {
            if (entries[i].target === canvas) {
              isCanvasVisible = entries[i].isIntersecting;
              syncLoopState();
            }
          }
        },
        { threshold: 0 }
      );
      intersectionObserver.observe(canvas);
    }

    if (motionQuery) {
      if (typeof motionQuery.addEventListener === 'function') {
        motionQuery.addEventListener('change', onReducedMotionChange);
      } else if (typeof motionQuery.addListener === 'function') {
        motionQuery.addListener(onReducedMotionChange);
      }
    }

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      stopLoop();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointercancel', onPointerReset);
      document.removeEventListener('mouseleave', onPointerReset);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      canvas.removeEventListener('webglcontextlost', onContextLost, false);
      canvas.removeEventListener('webglcontextrestored', onContextRestored, false);

      if (resizeObserver) resizeObserver.disconnect();
      if (intersectionObserver) intersectionObserver.disconnect();

      if (motionQuery) {
        if (typeof motionQuery.removeEventListener === 'function') {
          motionQuery.removeEventListener('change', onReducedMotionChange);
        } else if (typeof motionQuery.removeListener === 'function') {
          motionQuery.removeListener(onReducedMotionChange);
        }
      }
      destroyGLResources();
    }

    window.addEventListener('pagehide', destroy, { once: true });

    window.ConradoWebGLHero = {
      isReady: function () {
        return !destroyed && Boolean(gl) && !gl.isContextLost();
      },
      destroy: destroy
    };

    updateScrollTarget();
    currScroll = targetScroll;
    if (updateCanvasSize()) {
      renderFrame();
    }
    syncLoopState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConradoWebGL);
  } else {
    initConradoWebGL();
  }
})();
