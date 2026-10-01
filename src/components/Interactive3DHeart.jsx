import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, RotateCw, Hand } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playHeartbeatSound } from '../utils/soundEffects';

/**
 * Interactive3DHeart
 * Element 3D interactiv de înaltă finețe („Inima Noastră 3D • Pulsul Iubirii”):
 * - Inimă 3D sculpturală randată cu Three.js și material de rubin translucid cu reflexii speculare.
 * - Inel orbital cu mini-petale de flori și steluțe aurii.
 * - Drag / swipe interactiv cu mouse sau touch pentru rotire liberă la 360° în spațiul tridimensional.
 * - La click/tap: puls organic de bătaie de inimă dublă (thump-thump), sunet cald și emisie de scântei rose-gold.
 * - Contor intim de bătăi de inimă trimise de Cati către Ștefan.
 */
export function Interactive3DHeart() {
  const mountRef = useRef(null);
  const [heartbeatCount, setHeartbeatCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);

  // Stare internă pentru bucla de randare
  const stateRef = useRef({
    isDragging: false,
    prevPointerX: 0,
    prevPointerY: 0,
    rotX: 0.15,
    rotY: 0,
    velX: 0,
    velY: 0.008, // rotație automată lentă
    pulseScale: 1,
    targetScale: 1,
    lastPulseTime: 0
  });

  const triggerHeartPulse = () => {
    playHeartbeatSound();
    setHeartbeatCount((c) => c + 1);
    setPulseActive(true);
    setTimeout(() => setPulseActive(false), 900);

    // Declanșăm pulsație în bucla 3D
    stateRef.current.pulseScale = 1.35;
    stateRef.current.velY += 0.04;

    // Confetti romantic discret din inimă
    try {
      confetti({
        particleCount: 22,
        spread: 45,
        origin: { y: 0.72 },
        colors: ['#E11D48', '#FDA4AF', '#F43F5E', '#FEF08A'],
        ticks: 120,
        scalar: 0.8
      });
    } catch {
      // Fail safe
    }
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 320;
    const height = mount.clientHeight || 320;

    // 1. Scenă & Cameră
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // 2. Renderer WebGL cu antialias și transparență
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      mount.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL not available in Interactive3DHeart:', e);
      return;
    }

    // 3. Lumini: caldă, speculară roz și sclipire aurie
    const ambLight = new THREE.AmbientLight(0xfff1f2, 1.4);
    scene.add(ambLight);

    const dirLight1 = new THREE.DirectionalLight(0xfff7ed, 2.2);
    dirLight1.position.set(4, 6, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf43f5e, 1.8);
    dirLight2.position.set(-5, -4, 3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xfde047, 2.5, 10);
    pointLight.position.set(0, 1.5, 3.5);
    scene.add(pointLight);

    // 4. Geometrie 3D Inimă sculpturală parametrică
    const heartShape = new THREE.Shape();
    const s = 0.55;
    heartShape.moveTo(0, 1.2 * s);
    heartShape.bezierCurveTo(0, 1.7 * s, -0.7 * s, 2.4 * s, -1.9 * s, 2.4 * s);
    heartShape.bezierCurveTo(-3.3 * s, 2.4 * s, -3.5 * s, 1.2 * s, -3.5 * s, 0.3 * s);
    heartShape.bezierCurveTo(-3.5 * s, -1.0 * s, -1.8 * s, -2.4 * s, 0, -3.6 * s);
    heartShape.bezierCurveTo(1.8 * s, -2.4 * s, 3.5 * s, -1.0 * s, 3.5 * s, 0.3 * s);
    heartShape.bezierCurveTo(3.5 * s, 1.2 * s, 3.3 * s, 2.4 * s, 1.9 * s, 2.4 * s);
    heartShape.bezierCurveTo(0.7 * s, 2.4 * s, 0, 1.7 * s, 0, 1.2 * s);

    const extrudeSettings = {
      depth: 0.75,
      bevelEnabled: true,
      bevelSegments: 10,
      steps: 3,
      bevelSize: 0.35,
      bevelThickness: 0.35
    };

    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeo.center();

    // Material de rubin lucios cu reflexii elegante
    const heartMat = new THREE.MeshPhysicalMaterial({
      color: 0xbe123c,
      emissive: 0x4c0519,
      roughness: 0.18,
      metalness: 0.12,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08,
      transmission: 0.35,
      ior: 1.45,
      reflectivity: 0.9
    });

    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.scale.set(0.9, 0.9, 0.9);
    scene.add(heartMesh);

    // 5. Inel orbital de mini-flori / scântei aurii
    const orbitCount = 20;
    const orbitGeo = new THREE.BufferGeometry();
    const orbitPositions = new Float32Array(orbitCount * 3);

    for (let i = 0; i < orbitCount; i++) {
      const angle = (i / orbitCount) * Math.PI * 2;
      const radius = 2.6 + Math.sin(i * 3) * 0.25;
      orbitPositions[i * 3] = Math.cos(angle) * radius;
      orbitPositions[i * 3 + 1] = Math.sin(angle * 2) * 0.45;
      orbitPositions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    orbitGeo.setAttribute('position', new THREE.BufferAttribute(orbitPositions, 3));

    const starCanvas = document.createElement('canvas');
    starCanvas.width = 32;
    starCanvas.height = 32;
    const sctx = starCanvas.getContext('2d');
    if (sctx) {
      const g = sctx.createRadialGradient(16, 16, 0, 16, 16, 15);
      g.addColorStop(0, 'rgba(255, 255, 255, 1)');
      g.addColorStop(0.4, 'rgba(251, 191, 36, 0.9)');
      g.addColorStop(1, 'rgba(244, 63, 94, 0)');
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, 32, 32);
    }
    const starTex = new THREE.CanvasTexture(starCanvas);

    const orbitMat = new THREE.PointsMaterial({
      size: 0.28,
      map: starTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const orbitPoints = new THREE.Points(orbitGeo, orbitMat);
    scene.add(orbitPoints);

    // 6. Handlere de Pointer (Drag & Rotate în 3D)
    const dom = renderer.domElement;

    const onPointerDown = (e) => {
      stateRef.current.isDragging = true;
      stateRef.current.prevPointerX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      stateRef.current.prevPointerY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      setIsInteracting(true);
    };

    const onPointerMove = (e) => {
      if (!stateRef.current.isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      const deltaX = clientX - stateRef.current.prevPointerX;
      const deltaY = clientY - stateRef.current.prevPointerY;

      stateRef.current.velY = deltaX * 0.009;
      stateRef.current.velX = deltaY * 0.009;

      stateRef.current.prevPointerX = clientX;
      stateRef.current.prevPointerY = clientY;
    };

    const onPointerUp = () => {
      stateRef.current.isDragging = false;
      setIsInteracting(false);
    };

    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 7. Buclă de animație la 60 FPS
    let animId;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      const elapsed = clock.getElapsedTime();

      // Aplicare viteză unghiulară cu frecare lină
      const st = stateRef.current;
      if (!st.isDragging) {
        st.velY += (0.008 - st.velY) * 0.02; // revenire la rotație lentă naturală
        st.velX *= 0.94;
      }

      st.rotY += st.velY;
      st.rotX += st.velX;

      // Limitare înclinare pe axa X pentru estetică armonioasă
      st.rotX = Math.max(-0.6, Math.min(0.6, st.rotX));

      heartMesh.rotation.y = st.rotY;
      heartMesh.rotation.x = st.rotX;

      // Pulsație naturală de inimă (ritm organic: dublă bătaie)
      const basePulse = Math.sin(elapsed * 3.5);
      const secondaryPulse = Math.sin(elapsed * 7);
      const naturalBreath = 1 + (basePulse > 0.4 ? 0.04 * basePulse : 0) + (secondaryPulse > 0.6 ? 0.02 : 0);

      // Decădere pulsație manuală declanșată la atingere
      st.pulseScale += (1 - st.pulseScale) * 0.08;
      const currentScale = 0.9 * naturalBreath * st.pulseScale;
      heartMesh.scale.set(currentScale, currentScale, currentScale);

      // Rotație inel orbital opusă
      orbitPoints.rotation.y = -elapsed * 0.35;
      orbitPoints.rotation.x = 0.25 + Math.sin(elapsed * 0.5) * 0.1;

      renderer.render(scene, camera);
    };

    renderLoop();

    // 8. Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || 320;
      const h = mount.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 9. Cleanup WebGL complet
    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);

      heartGeo.dispose();
      heartMat.dispose();
      orbitGeo.dispose();
      orbitMat.dispose();
      starTex.dispose();

      renderer.dispose();
      if (mount && renderer.domElement && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative mx-auto my-14 w-full max-w-xl px-4 text-center">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-rose-200/90 bg-gradient-to-b from-[#FFFDF9]/95 via-[#FFF5F2]/90 to-[#FEEDEB]/80 p-6 sm:p-9 shadow-[0_20px_50px_rgba(225,29,72,0.12)] backdrop-blur-md">
        
        {/* Antet dedicat */}
        <div className="flex flex-col items-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs sm:text-sm font-semibold text-rose-800 uppercase tracking-widest shadow-xs">
            <Sparkles className="h-4 w-4 text-rose-600" />
            Inimă 3D interactivă
          </span>

          <h3 className="mt-3 font-serif text-3xl font-medium text-ink sm:text-4xl">
            Inima noastră
          </h3>

          <p className="mt-2 max-w-md text-sm text-ink-subtle leading-relaxed">
            Atinge ca să-i dai o bătaie, trage ca s-o vezi din toate părțile.
          </p>
        </div>

        {/* Zona canvas 3D interactivă */}
        <div
          className="relative mx-auto my-4 flex h-64 w-64 sm:h-80 sm:w-80 items-center justify-center cursor-grab active:cursor-grabbing select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Fundal radial de auroră caldă în spatele inimii */}
          <div className="pointer-events-none absolute h-56 w-56 rounded-full bg-gradient-to-tr from-rose-500/20 via-pink-400/25 to-amber-300/20 blur-2xl" />

          {/* Canvas WebGL Three.js */}
          <div ref={mountRef} className="h-full w-full" />

          {/* Buton flotant de declanșare puls la atingere */}
          <button
            type="button"
            onClick={triggerHeartPulse}
            aria-label="Trimite o bătaie de inimă"
            className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
          />

          {/* Asistență vizuală discretă de interacțiune */}
          <AnimatePresence>
            {!isInteracting && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1 text-xs font-medium text-rose-900 shadow-sm border border-rose-200/80 backdrop-blur-xs"
              >
                <Hand className="h-3.5 w-3.5 text-rose-600 animate-bounce" />
                <span>Apasă pentru puls • Rotește</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Buton de acțiune & contor live de bătăi */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={triggerHeartPulse}
            className="group flex min-h-[48px] items-center gap-2.5 rounded-full bg-gradient-to-r from-rose-700 via-rose-800 to-rose-950 px-8 py-3 text-base font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer active:scale-95"
          >
            <Heart className={`h-5 w-5 fill-rose-300 text-rose-300 transition-transform ${pulseActive ? 'scale-130' : 'group-hover:scale-115'}`} />
            <span>Trimite un puls 💗</span>
          </button>

          <div className="text-xs sm:text-sm font-serif italic text-rose-900/90 font-medium">
            {heartbeatCount === 0 ? (
              <span>Inima așteaptă primul tău semn...</span>
            ) : (
              <span>
                Ai trimis <span className="font-sans font-bold text-rose-700">{heartbeatCount}</span> {heartbeatCount === 1 ? 'bătaie' : 'bătăi'} de inimă ❤️
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Interactive3DHeart;
