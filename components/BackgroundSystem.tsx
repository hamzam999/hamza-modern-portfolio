import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BackgroundSystem: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup — Sophisticated Dark Engine
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x101010, 0.001);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1500);
    camera.position.set(0, 50, 200);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: false, 
        powerPreference: 'high-performance' 
      });
    } catch (e) {
      console.warn('BackgroundSystem: WebGL context creation failed. Background animations will be disabled.', e);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x101010, 1);
    mountRef.current.appendChild(renderer.domElement);

    // 2. Particle Core
    const particleCount = 25000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const randoms = new Float32Array(particleCount);
    const indices = new Float32Array(particleCount);

    const size = 600;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * size;
      positions[i * 3 + 1] = (Math.random() - 0.5) * size * 0.8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * size;
      randoms[i] = Math.random();
      indices[i] = i;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geometry.setAttribute('aIndex', new THREE.BufferAttribute(indices, 1));

    // Responsive Typography Logic (NDC — -1 to 1)
    const computeLayout = (w: number, h: number) => {
      // Desktop: HAMZA on right, matching heading
      if (w > 1200) return { offX: 0.52, offY: 0.0, lw: 0.12, lh: 0.60, gap: 0.1, thick: 0.015 };
      // Tablet
      if (w > 768)  return { offX: 0.12, offY: -0.45, lw: 0.08, lh: 0.35, gap: 0.1, thick: 0.015 };
      // Mobile
      return                { offX: 0.0, offY: -0.80, lw: 0.07, lh: 0.25, gap: 0.08, thick: 0.012 };
    };

    const initialLayout = computeLayout(window.innerWidth, window.innerHeight);

    const uniforms = {
      uTime: { value: 0 },
      uSection: { value: 0 }, // 0=Hero (Kernel), 1=About (Logic), 2=Tech (Grid), 3=Work (Vortex), 4=Exp (Stack), 5=CTA (Explosion)
      uMouseX: { value: 0 },
      uMouseY: { value: 0 },
      uTextOffsetX: { value: initialLayout.offX },
      uTextOffsetY: { value: initialLayout.offY },
      uLetterW: { value: initialLayout.lw },
      uLetterH: { value: initialLayout.lh },
      uLetterGap: { value: initialLayout.gap },
      uThickness: { value: initialLayout.thick },
      uAspect: { value: window.innerWidth / window.innerHeight },
      uColorPrimary: { value: new THREE.Color('#EAEFFF') }, // Sculpt Ice Blue
      uColorAccent: { value: new THREE.Color('#9BAFFF') }   // Secondary Blue
    };

    const vertexShader = `
      uniform float uTime;
      uniform float uSection;
      uniform float uMouseX;
      uniform float uMouseY;
      uniform float uTextOffsetX;
      uniform float uTextOffsetY;
      uniform float uLetterW;
      uniform float uLetterH;
      uniform float uLetterGap;
      uniform float uThickness;
      uniform float uAspect;
      
      varying float vState;
      varying float vRandom;
      
      attribute float aRandom;
      attribute float aIndex;

      // Snoise 2D helper
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 a0 = x - floor(x + 0.5);
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vState = uSection;
        vRandom = aRandom;
        vec3 pos = position;

        // ── TYPOGRAPHY LAYER (H-A-M-Z-A) ──
        float lw = uLetterW;
        float lh = uLetterH;
        float gap = uLetterGap;
        float totalW = 5.0 * lw + 4.0 * gap;
        float startX = -totalW * 0.5;
        
        vec2 ndcText = vec2(0.0);
        bool isText = aRandom < 0.4;
        float lRand = aRandom / 0.4;
        
        // H
        if (lRand < 0.2) {
          float t = lRand * 5.0;
          float ox = startX;
          if (t < 0.4) ndcText = vec2(ox, (t/0.4)*lh - lh/2.0);
          else if (t < 0.8) ndcText = vec2(ox + lw, ((t-0.4)/0.4)*lh - lh/2.0);
          else ndcText = vec2(ox + ((t-0.8)/0.2)*lw, 0.0);
        }
        // A
        else if (lRand < 0.4) {
          float t = (lRand - 0.2) * 5.0;
          float ox = startX + lw + gap;
          if (t < 0.4) ndcText = vec2(ox + (t/0.4)*(lw/2.0), -lh/2.0 + (t/0.4)*lh);
          else if (t < 0.8) ndcText = vec2(ox + lw/2.0 + ((t-0.4)/0.4)*(lw/2.0), lh/2.0 - ((t-0.4)/0.4)*lh);
          else ndcText = vec2(ox + lw/4.0 + ((t-0.8)/0.2)*(lw/2.0), -lh/8.0);
        }
        // M
        else if (lRand < 0.6) {
          float t = (lRand - 0.4) * 5.0;
          float ox = startX + 2.0*(lw + gap);
          if (t < 0.25) ndcText = vec2(ox, t*lh*4.0 - lh/2.0);
          else if (t < 0.5) ndcText = vec2(ox + ((t-0.25)*4.0)*(lw/2.0), lh/2.0 - (t-0.25)*lh*4.0);
          else if (t < 0.75) ndcText = vec2(ox + lw/2.0 + ((t-0.50)*4.0)*(lw/2.0), (t-0.50)*lh*4.0);
          else ndcText = vec2(ox + lw, (t-0.75)*lh*4.0 - lh/2.0);
        }
        // Z
        else if (lRand < 0.8) {
          float t = (lRand - 0.6) * 5.0;
          float ox = startX + 3.0*(lw + gap);
          if (t < 0.33) ndcText = vec2(ox + t*3.0*lw, lh/2.0);
          else if (t < 0.66) ndcText = vec2(ox + lw - (t-0.33)*3.0*lw, lh/2.0 - (t-0.33)*3.0*lh);
          else ndcText = vec2(ox + (t-0.66)*3.0*lw, -lh/2.0);
        }
        // A
        else {
          float t = (lRand - 0.8) * 5.0;
          float ox = startX + 4.0*(lw + gap);
          if (t < 0.4) ndcText = vec2(ox + (t/0.4)*(lw/2.0), -lh/2.0 + (t/0.4)*lh);
          else if (t < 0.8) ndcText = vec2(ox + lw/2.0 + ((t-0.4)/0.4)*(lw/2.0), lh/2.0 - ((t-0.4)/0.4)*lh);
          else ndcText = vec2(ox + lw/4.0 + ((t-0.8)/0.2)*(lw/2.0), -lh/8.0);
        }

        // Apply thickness buzz and layout offset
        ndcText += (vec2(aRandom, fract(aRandom*10.0)) - 0.5) * uThickness;
        ndcText.x += uTextOffsetX;
        ndcText.y += uTextOffsetY;
        ndcText.x /= uAspect;

        // ── NARRATIVE STATES (0→5) ──
        
        // 0. Hero (Kernel)
        float kernelBlend = clamp(1.0 - uSection, 0.0, 1.0);
        pos.y += sin(uTime + pos.x * 0.04) * 10.0 * kernelBlend;
        
        // 1. About (Logic Trace) — Horizontal streams
        float logicBlend = clamp(uSection, 0.0, 1.0) - clamp(uSection - 2.0, 0.0, 1.0);
        float logicStream = sin(pos.x * 0.15 + uTime * 3.0) * 25.0;
        pos.y = mix(pos.y, logicStream, logicBlend * 0.9);

        // 2. Tech (Silicon Grid) — High-Precision Snap
        float gridBlend = clamp(uSection - 1.5, 0.0, 1.0) - clamp(uSection - 2.5, 0.0, 1.0);
        float gridSize = 15.0;
        vec3 gridPos = vec3(
          floor(pos.x / gridSize) * gridSize, 
          floor(pos.y / gridSize) * gridSize, 
          floor(pos.z / gridSize) * gridSize
        );
        pos = mix(pos, gridPos, gridBlend * 0.95);

        // 3. Work (Data Vortex) — High-Energy Spiral (Right Aligned)
        float vortexBlend = clamp(uSection - 2.5, 0.0, 1.0) - clamp(uSection - 3.5, 0.0, 1.0);
        float angle = atan(pos.y, pos.x) + uTime * 1.2 + aRandom * 10.0;
        float radius = length(pos.xy) * 0.4;
        vec3 vortexPos = vec3(
          cos(angle) * radius + 80.0, // Stronger right align
          sin(angle) * radius,
          pos.z + sin(radius * 0.08 + uTime * 2.0) * 30.0
        );
        pos = mix(pos, vortexPos, vortexBlend * 0.9);

        // 4. Experience (Memory Stack) — Structured Wave Field
        float stackBlend = clamp(uSection - 3.5, 0.0, 1.0) - clamp(uSection - 4.5, 0.0, 1.0);
        float wave = sin(pos.x * 0.05 + uTime * 1.5) * 40.0;
        pos.y = mix(pos.y, wave, stackBlend * 0.9);

        // 5. CTA (Output Burst) — High Kinetic Energy
        float burstBlend = clamp(uSection - 4.7, 0.0, 1.0);
        vec3 burstDir = normalize(position) * (400.0 + aRandom * 200.0);
        pos = mix(pos, burstDir, burstBlend);

        // PARALLAX & FINAL SIZE
        pos.x += uMouseX * 20.0;
        pos.y += uMouseY * 20.0;

        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = (1.5 + aRandom * 2.5) * (300.0 / -mvPos.z);
        vec4 worldClip = projectionMatrix * mvPos;

        if (isText) {
          // Extremely sharp dissolution: text dissolves by uSection 0.1 (start of scroll)
          float heroActive = clamp(1.0 - uSection / 0.1, 0.0, 1.0);
          vec4 textClip = vec4(ndcText.x * worldClip.w, ndcText.y * worldClip.w, worldClip.z, worldClip.w);
          gl_Position = mix(worldClip, textClip, heroActive);
          gl_PointSize = mix(gl_PointSize, 2.8, heroActive);
        } else {
          gl_Position = worldClip;
        }
      }
    `;

    const fragmentShader = `
      uniform vec3 uColorPrimary;
      uniform vec3 uColorAccent;
      uniform float uTime;
      varying float vState;
      varying float vRandom;

      void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        if (length(uv) > 0.5) discard;
        
        float strength = 1.0 - (length(uv) * 2.0);
        strength = pow(strength, 3.0);
        
        vec3 color = mix(uColorPrimary, uColorAccent, vRandom * 0.2);
        
        if (vState > 1.0 && vState < 2.0) { // Logic Trace flicker
          strength *= (0.7 + 0.3 * sin(uTime * 15.0 + vRandom * 100.0));
        }
        
        gl_FragColor = vec4(color, strength * 0.8);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Scroll Tracking Logic — Section Intersection Weighting
    const trackedSections = [
      { id: 'section-hero', target: 0 },
      { id: 'section-about', target: 1 },
      { id: 'section-tech', target: 2 },
      { id: 'section-work', target: 3 },
      { id: 'section-experience', target: 4 },
      { id: 'section-cta', target: 5 },
    ];

    // 3. Section Visibility Tracking
    // This is the most robust way because it works even if Lenis hijacks the scroll
    let targetUSection = 0;
    
    const updateScrollState = () => {
      let totalWeight = 0;
      let valSum = 0;
      const vh = window.innerHeight;

      trackedSections.forEach(sec => {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(vh, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          
          if (visibleHeight > 0) {
            const weight = visibleHeight / vh;
            valSum += sec.target * weight;
            totalWeight += weight;
          }
        }
      });

      if (totalWeight > 0) {
        targetUSection = valSum / totalWeight;
        if (Math.random() < 0.01) console.log('DEBUG_U_SECTION:', targetUSection);
      }
    };

    gsap.ticker.add(updateScrollState);

    // 4. Events & Animation
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      uniforms.uAspect.value = w / h;
      
      const layout = computeLayout(w, h);
      uniforms.uTextOffsetX.value = layout.offX;
      uniforms.uTextOffsetY.value = layout.offY;
      uniforms.uLetterW.value = layout.lw;
      uniforms.uLetterH.value = layout.lh;
      uniforms.uLetterGap.value = layout.gap;
      uniforms.uThickness.value = layout.thick;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      gsap.to(uniforms.uMouseX, { value: x, duration: 1.5 });
      gsap.to(uniforms.uMouseY, { value: y, duration: 1.5 });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      
      // Smooth interpolation
      const current = uniforms.uSection.value;
      uniforms.uSection.value += (targetUSection - current) * 0.05;
      
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      ScrollTrigger.getAll().forEach(st => st.kill());
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 z-[-1] pointer-events-none"
      style={{ background: '#101010' }}
      aria-hidden="true"
    />
  );
};

export default BackgroundSystem;
