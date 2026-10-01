import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Story3DScene
 * Scenă 3D WebGL de fundal cu Three.js (60 FPS):
 * - Petale 3D delicate de trandafir / flori de cireș plutind organic cu fizică de vânt și cădere.
 * - Praf stelar auriu / particule de lumină romantică cu blending aditiv.
 * - Reacție subtilă la mișcarea mouse-ului (paralaxă fluidă cu lerp).
 * - Răspuns dinamic la viteza de derulare a paginii (scroll velocity) care agită briza de petale.
 * - Adaptare cromatică fină în funcție de etapa deblocată (Suceava -> Distanță -> Oradea -> Oficial Noi).
 */
export function Story3DScene({ stage = 1 }) {
  const containerRef = useRef(null);
  const stateRef = useRef({
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    scrollY: 0,
    scrollSpeed: 0,
    lastScrollY: 0,
    stage: stage
  });

  useEffect(() => {
    stateRef.current.stage = stage;
  }, [stage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Verificăm dacă utilizatorul preferă mișcare redusă
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Inițializare Scenă, Cameră și Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 18);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.domElement.style.pointerEvents = 'none';
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL not available for Story3DScene:', e);
      return;
    }

    // Lumini calde ambientale
    const ambientLight = new THREE.AmbientLight(0xfff5f0, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffdfd0, 1.5);
    dirLight.position.set(5, 10, 8);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xf43f5e, 2.5, 35);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // 2. Generare textură Canvas pentru Petale de Flori (Gradient trandafiriu delicat)
    const createPetalTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      const grad = ctx.createRadialGradient(64, 50, 5, 64, 64, 60);
      grad.addColorStop(0, 'rgba(255, 235, 240, 0.98)');
      grad.addColorStop(0.4, 'rgba(244, 114, 182, 0.85)');
      grad.addColorStop(0.8, 'rgba(225, 29, 72, 0.65)');
      grad.addColorStop(1, 'rgba(190, 18, 60, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(64, 64, 45, 58, 0, 0, Math.PI * 2);
      ctx.fill();

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const petalTexture = createPetalTexture();

    // 3. Geometrie curbată organic pentru Petale 3D
    const petalCount = prefersReducedMotion ? 12 : 38;
    const petalGeometry = new THREE.PlaneGeometry(0.85, 1.25, 4, 6);
    const posAttr = petalGeometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const u = posAttr.getX(i);
      const v = posAttr.getY(i);
      // Curbură naturală de petală de trandafir
      posAttr.setZ(i, -0.22 * (u * u) + 0.12 * Math.sin(v * 2.8));
    }
    petalGeometry.computeVertexNormals();

    const petalMaterial = new THREE.MeshStandardMaterial({
      map: petalTexture,
      transparent: true,
      opacity: 0.88,
      roughness: 0.35,
      metalness: 0.05,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    // Instanțiere grup de petale independente cu fizică individuală
    const petals = [];
    const petalGroup = new THREE.Group();

    for (let i = 0; i < petalCount; i++) {
      const mesh = new THREE.Mesh(petalGeometry, petalMaterial);
      const x = (Math.random() - 0.5) * 32;
      const y = (Math.random() - 0.5) * 26;
      const z = (Math.random() - 0.5) * 16 - 2;

      mesh.position.set(x, y, z);
      const scale = 0.55 + Math.random() * 0.75;
      mesh.scale.set(scale, scale, scale);

      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      petals.push({
        mesh,
        baseX: x,
        baseY: y,
        baseZ: z,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.025,
        rotSpeedZ: (Math.random() - 0.5) * 0.015,
        fallSpeed: 0.012 + Math.random() * 0.018,
        swaySpeed: 0.6 + Math.random() * 0.8,
        swayAmplitude: 0.8 + Math.random() * 1.2,
        seed: Math.random() * 100
      });

      petalGroup.add(mesh);
    }
    scene.add(petalGroup);

    // 4. Praf stelar auriu / particule de lumină (Points cu Additive Blending)
    const stardustCount = prefersReducedMotion ? 40 : 130;
    const stardustGeo = new THREE.BufferGeometry();
    const stardustPositions = new Float32Array(stardustCount * 3);
    const stardustScales = new Float32Array(stardustCount);

    for (let i = 0; i < stardustCount; i++) {
      stardustPositions[i * 3] = (Math.random() - 0.5) * 38;
      stardustPositions[i * 3 + 1] = (Math.random() - 0.5) * 32;
      stardustPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4;
      stardustScales[i] = 0.5 + Math.random() * 1.5;
    }

    stardustGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(stardustPositions, 3)
    );

    const createStarSprite = () => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      if (!ctx) return new THREE.Texture();

      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      g.addColorStop(0, 'rgba(255, 255, 255, 1)');
      g.addColorStop(0.25, 'rgba(253, 230, 138, 0.9)'); // Gold
      g.addColorStop(0.65, 'rgba(244, 63, 94, 0.4)'); // Rose
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    };

    const stardustMaterial = new THREE.PointsMaterial({
      size: 0.42,
      map: createStarSprite(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75
    });

    const stardust = new THREE.Points(stardustGeo, stardustMaterial);
    scene.add(stardust);

    // 5. Handlere de evenimente: Mouse și Scroll
    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      stateRef.current.mouse.targetX = normX * 1.8;
      stateRef.current.mouse.targetY = normY * 1.2;
    };

    const handleScroll = () => {
      const currentY = window.scrollY || document.documentElement.scrollTop;
      const delta = currentY - stateRef.current.lastScrollY;
      stateRef.current.scrollSpeed = delta;
      stateRef.current.lastScrollY = currentY;
      stateRef.current.scrollY = currentY;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // 6. Buclă de animație fluidă la 60 FPS
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const currentStage = stateRef.current.stage;

      // Amortizare lină lerp pentru paralaxa camerei
      const mouse = stateRef.current.mouse;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      camera.position.x = mouse.x * 0.9;
      camera.position.y = mouse.y * 0.7;
      camera.lookAt(0, 0, 0);

      // Decăderea vitezei de scroll (aerodinamică fină)
      stateRef.current.scrollSpeed *= 0.92;
      const scrollWind = Math.max(-0.25, Math.min(0.25, stateRef.current.scrollSpeed * 0.005));

      // Reacția luminii și a elementelor 3D la etapa activă
      if (currentStage === 0) {
        petalGroup.visible = false;
        stardust.visible = true;
        pointLight.color.setHex(0xf59e0b);
        pointLight.intensity = 1.0;
      } else if (currentStage >= 4) {
        // Oficial Noi: nuanțe aurii-roșiatice intense & petale festive
        petalGroup.visible = true;
        stardust.visible = true;
        pointLight.color.setHex(0xe11d48);
        pointLight.intensity = 2.8;
      } else if (currentStage === 3) {
        // Răsărit Oradea: auriu cald
        petalGroup.visible = true;
        stardust.visible = true;
        pointLight.color.setHex(0xf59e0b);
        pointLight.intensity = 2.2;
      } else if (currentStage === 2) {
        // Puntea de noapte & FaceTime: cer înstelat, mai mult stardust celest
        petalGroup.visible = false;
        stardust.visible = true;
        pointLight.color.setHex(0x818cf8);
        pointLight.intensity = 1.6;
      } else {
        // Suceava: primăvară caldă, petale de flori & lumină roz pudrat
        petalGroup.visible = true;
        stardust.visible = true;
        pointLight.color.setHex(0xf43f5e);
        pointLight.intensity = 1.8;
      }

      // Animație Petale 3D
      petals.forEach((p) => {
        p.mesh.rotation.x += p.rotSpeedX;
        p.mesh.rotation.y += p.rotSpeedY;
        p.mesh.rotation.z += p.rotSpeedZ;

        // Cădere lină cu revenire în partea superioară + impuls din scroll
        p.mesh.position.y -= p.fallSpeed + scrollWind;
        p.mesh.position.x += Math.sin(elapsedTime * p.swaySpeed + p.seed) * 0.015;
        p.mesh.position.z += Math.cos(elapsedTime * 0.5 + p.seed) * 0.008;

        if (p.mesh.position.y < -14) {
          p.mesh.position.y = 14;
          p.mesh.position.x = (Math.random() - 0.5) * 32;
        } else if (p.mesh.position.y > 14) {
          p.mesh.position.y = -14;
          p.mesh.position.x = (Math.random() - 0.5) * 32;
        }
      });

      // Rotație lentă a prafului stelar
      stardust.rotation.y = elapsedTime * 0.02;
      stardust.rotation.x = Math.sin(elapsedTime * 0.015) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup conform standardelor 3D (eliberare memorie GPU fără scurgeri)
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      petalGeometry.dispose();
      petalMaterial.dispose();
      petalTexture.dispose();

      stardustGeo.dispose();
      stardustMaterial.dispose();

      renderer.dispose();
      if (container && renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-1 overflow-hidden"
    />
  );
}

export default Story3DScene;
