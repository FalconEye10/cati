import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { playDialTickSound, playVaultUnlockSound } from '../utils/soundEffects';

/**
 * Vault3D
 * Model 3D interactiv de înaltă finețe al Seifului Mecanic (Three.js WebGL):
 * - Ramă circulară masivă din oțel forjat și nituri perimetrice aurii.
 * - Ușă grea de seif montată pe balamale 3D duble, cu cadran din alamă șlefuită.
 * - Roată centrală de manevră cu 3 spițe metalice și medalion monogramă „C & Ș”.
 * - 4 bolțuri radiale masive de oțel care se retrag mecanic la deschidere.
 * - Deschidere în perspectivă 3D reală pe axa Y (-75°), dezvăluind interiorul căptușit în catifea
 *   și un fascicul cald de lumină aurie care se revarsă spre privitor.
 * - Tilt interactiv cu mouse/touch pentru percepție realistă a adâncimii și a reflexiilor speculare.
 */
export function Vault3D({
  vaultState, // 'locked' | 'dialing' | 'unlocking-bolts' | 'opening-door' | 'opened'
  onTriggerUnlock
}) {
  const mountRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Stare internă pentru bucla Three.js
  const internalState = useRef({
    vaultState: vaultState,
    wheelAngle: 0,
    doorAngle: vaultState === 'opened' ? -1.35 : 0,
    boltsRetraction: vaultState === 'opened' ? 0.35 : 0,
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    isDraggingWheel: false,
    prevPointerX: 0
  });

  useEffect(() => {
    internalState.current.vaultState = vaultState;
  }, [vaultState]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 360;
    const height = mount.clientHeight || 360;

    // 1. Scenă & Cameră cu perspectivă naturală (FOV 42°)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 0, 8.8);

    // 2. Renderer WebGL fail-safe cu transparență și antialiasing
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
      renderer.toneMappingExposure = 1.2;
      mount.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL not available in Vault3D:', e);
      return;
    }

    // 3. Sistem de iluminare dramatic (Studio Lighting pentru metale lustruite)
    const ambLight = new THREE.AmbientLight(0xfff6f0, 1.2);
    scene.add(ambLight);

    // Lumină cheie superioară caldă
    const keyLight = new THREE.DirectionalLight(0xffecd2, 2.4);
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);

    // Lumină speculară rece pentru conturul de oțel
    const rimLight = new THREE.DirectionalLight(0xbfdbfe, 1.6);
    rimLight.position.set(-6, -4, 4);
    scene.add(rimLight);

    // Lumină interioară a seifului (aurie profundă, se intensifică la deschidere)
    const vaultInteriorLight = new THREE.PointLight(0xf59e0b, vaultState === 'opened' ? 3.5 : 0.2, 12);
    vaultInteriorLight.position.set(0, 0, -0.5);
    scene.add(vaultInteriorLight);

    // 4. Materiale metalice nobile
    // Oțel forjat exterior (Heavy Titanium Steel)
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x3d353a,
      metalness: 0.85,
      roughness: 0.28
    });

    // Alamă periată de colecție (Brushed Gold/Brass)
    const brassMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4af37,
      emissive: 0x3a2505,
      metalness: 0.88,
      roughness: 0.22,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15
    });

    // Oțel cromat pentru bolțuri
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.12
    });

    // Catifea interioară întunecată (Dark Burgundy Velvet)
    const velvetMat = new THREE.MeshStandardMaterial({
      color: 0x240810,
      roughness: 0.95,
      metalness: 0.05
    });

    // 5. Construcția carcasei seifului (Interiorul & Rama)
    const vaultRoot = new THREE.Group();
    scene.add(vaultRoot);

    // Interiorul seifului (cutia adâncă din spate)
    const chamberGeo = new THREE.CylinderGeometry(2.35, 2.35, 1.2, 48, 1, true);
    chamberGeo.rotateX(Math.PI / 2);
    const chamberMesh = new THREE.Mesh(chamberGeo, velvetMat);
    chamberMesh.position.z = -0.6;
    vaultRoot.add(chamberMesh);

    const backWallGeo = new THREE.CircleGeometry(2.35, 48);
    const backWallMesh = new THREE.Mesh(backWallGeo, velvetMat);
    backWallMesh.position.z = -1.2;
    vaultRoot.add(backWallMesh);

    // Inima sau comoara din interiorul seifului
    const treasureGeo = new THREE.OctahedronGeometry(0.5, 2);
    const treasureMat = new THREE.MeshPhysicalMaterial({
      color: 0xe11d48,
      emissive: 0x881337,
      metalness: 0.2,
      roughness: 0.15,
      transmission: 0.7,
      ior: 1.5
    });
    const treasureMesh = new THREE.Mesh(treasureGeo, treasureMat);
    treasureMesh.position.set(0, 0, -0.8);
    vaultRoot.add(treasureMesh);

    // Rama exterioară masivă cu profil teșit (Beveled Outer Rim)
    const outerRingGeo = new THREE.TorusGeometry(2.55, 0.28, 18, 54);
    const outerRingMesh = new THREE.Mesh(outerRingGeo, steelMat);
    vaultRoot.add(outerRingMesh);

    // Nituri aurii pe circumferința ramei (16 bucăți)
    const rivetGeo = new THREE.SphereGeometry(0.065, 12, 12);
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const rivet = new THREE.Mesh(rivetGeo, brassMat);
      rivet.position.set(Math.cos(angle) * 2.55, Math.sin(angle) * 2.55, 0.25);
      vaultRoot.add(rivet);
    }

    // 6. UȘA 3D MOBILĂ (Montată pe balama la x = -2.35)
    // Creăm un pivot la balamaua stângă
    const hingePivot = new THREE.Group();
    hingePivot.position.set(-2.35, 0, 0);
    vaultRoot.add(hingePivot);

    // Balamale cilindrice masive pe cadru
    const hingePinGeo = new THREE.CylinderGeometry(0.14, 0.14, 2.2, 24);
    const hingePinMesh = new THREE.Mesh(hingePinGeo, steelMat);
    hingePinMesh.position.set(-2.35, 0, 0.1);
    vaultRoot.add(hingePinMesh);

    // Sub-grupul ușii propriu-zise (deplasat față de pivot)
    const doorSubGroup = new THREE.Group();
    doorSubGroup.position.set(2.35, 0, 0); // readuce ușa în centru
    hingePivot.add(doorSubGroup);

    // Corpul discului ușii (Grosime masivă din oțel + alamă)
    const doorBodyGeo = new THREE.CylinderGeometry(2.3, 2.3, 0.38, 54);
    doorBodyGeo.rotateX(Math.PI / 2);
    const doorBodyMesh = new THREE.Mesh(doorBodyGeo, steelMat);
    doorBodyMesh.position.z = 0.1;
    doorSubGroup.add(doorBodyMesh);

    // Panou frontal decorativ din alamă gravată
    const brassFaceGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.08, 48);
    brassFaceGeo.rotateX(Math.PI / 2);
    const brassFaceMesh = new THREE.Mesh(brassFaceGeo, brassMat);
    brassFaceMesh.position.z = 0.32;
    doorSubGroup.add(brassFaceMesh);

    // Inel gravat concentric
    const innerRingGeo = new THREE.TorusGeometry(1.6, 0.04, 12, 48);
    const innerRingMesh = new THREE.Mesh(innerRingGeo, steelMat);
    innerRingMesh.position.z = 0.37;
    doorSubGroup.add(innerRingMesh);

    // Marcaje romane gravate (XII, III, VI, IX) create prin mici bare metalice
    const markGeo = new THREE.BoxGeometry(0.06, 0.22, 0.04);
    const marks = [
      { x: 0, y: 1.55, rot: 0 },
      { x: 1.55, y: 0, rot: Math.PI / 2 },
      { x: 0, y: -1.55, rot: 0 },
      { x: -1.55, y: 0, rot: Math.PI / 2 }
    ];
    marks.forEach(m => {
      const markMesh = new THREE.Mesh(markGeo, steelMat);
      markMesh.position.set(m.x, m.y, 0.38);
      markMesh.rotation.z = m.rot;
      doorSubGroup.add(markMesh);
    });

    // 7. BOLȚURILE RADIALE RETRACTABILE (4 bolțuri cilindrice grele de oțel)
    const boltGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.65, 20);
    const bolts = [];
    const boltAngles = [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2];

    boltAngles.forEach(angle => {
      const boltMesh = new THREE.Mesh(boltGeo, chromeMat);
      boltMesh.rotation.z = angle + Math.PI / 2;
      doorSubGroup.add(boltMesh);
      bolts.push({ mesh: boltMesh, angle });
    });

    // 8. ROATA CENTRALĂ CU 3 SPIȚE (Turnstile Handwheel)
    const wheelGroup = new THREE.Group();
    wheelGroup.position.z = 0.42;
    doorSubGroup.add(wheelGroup);

    // Butucul central al roții
    const hubGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.22, 32);
    hubGeo.rotateX(Math.PI / 2);
    const hubMesh = new THREE.Mesh(hubGeo, brassMat);
    wheelGroup.add(hubMesh);

    // Medalionul central roșu regal cu monogramele „C & Ș”
    const medalGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.08, 32);
    medalGeo.rotateX(Math.PI / 2);
    const medalMat = new THREE.MeshStandardMaterial({
      color: 0x9f1239,
      roughness: 0.3,
      metalness: 0.4
    });
    const medalMesh = new THREE.Mesh(medalGeo, medalMat);
    medalMesh.position.z = 0.12;
    wheelGroup.add(medalMesh);

    // Cele 3 spițe radiale masive de alamă cu mânere rotunde
    const spokeGeo = new THREE.CylinderGeometry(0.065, 0.065, 1.25, 16);
    const handleBallGeo = new THREE.SphereGeometry(0.12, 16, 16);

    for (let i = 0; i < 3; i++) {
      const sAngle = (i / 3) * Math.PI * 2;
      const spokeContainer = new THREE.Group();
      spokeContainer.rotation.z = sAngle;

      const spoke = new THREE.Mesh(spokeGeo, brassMat);
      spoke.position.y = 0.7;
      spokeContainer.add(spoke);

      const ball = new THREE.Mesh(handleBallGeo, steelMat);
      ball.position.y = 1.35;
      spokeContainer.add(ball);

      wheelGroup.add(spokeContainer);
    }

    // 9. Handlere de interacțiune (Mouse Tilt & Click pe seif)
    const handleMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      internalState.current.mouse.targetX = normX * 0.35;
      internalState.current.mouse.targetY = normY * 0.25;
    };

    const handlePointerDown = (e) => {
      setIsInteracting(true);
      internalState.current.isDraggingWheel = true;
      internalState.current.prevPointerX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      
      // Dacă seiful este încuiat și este atins, declanșăm deschiderea
      if (internalState.current.vaultState === 'locked' && onTriggerUnlock) {
        onTriggerUnlock();
      }
    };

    const handlePointerMove = (e) => {
      handleMouseMove(e);
      if (internalState.current.isDraggingWheel) {
        const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const deltaX = clientX - internalState.current.prevPointerX;
        internalState.current.wheelAngle += deltaX * 0.02;
        internalState.current.prevPointerX = clientX;
        if (Math.abs(deltaX) > 4) {
          playDialTickSound();
        }
      }
    };

    const handlePointerUp = () => {
      setIsInteracting(false);
      internalState.current.isDraggingWheel = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousemove', handleMouseMove);
    domElement.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);

    domElement.addEventListener('touchmove', handlePointerMove, { passive: true });
    domElement.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 10. Buclă de animație la 60 FPS
    let animId;
    let clock = new THREE.Clock();

    const animateLoop = () => {
      animId = requestAnimationFrame(animateLoop);
      const elapsed = clock.getElapsedTime();
      const st = internalState.current;

      // Amortizare lină lerp pentru înclinarea în perspectivă 3D
      const m = st.mouse;
      m.x += (m.targetX - m.x) * 0.06;
      m.y += (m.targetY - m.y) * 0.06;

      vaultRoot.rotation.y = m.x;
      vaultRoot.rotation.x = -m.y;

      // Animația comorii din interior
      treasureMesh.rotation.y = elapsed * 0.8;
      treasureMesh.rotation.x = Math.sin(elapsed * 0.6) * 0.3;

      // Actualizare în funcție de starea mecanică
      if (st.vaultState === 'dialing') {
        // Roata de combinație se învârte rapid
        st.wheelAngle += 0.08;
        wheelGroup.rotation.z = st.wheelAngle;
      } else if (st.vaultState === 'unlocking-bolts') {
        // Roata continuă lentă, bolțurile încep să se retragă
        st.wheelAngle += 0.02;
        wheelGroup.rotation.z = st.wheelAngle;
        st.boltsRetraction += (0.32 - st.boltsRetraction) * 0.12;
      } else if (st.vaultState === 'opening-door' || st.vaultState === 'opened') {
        // Bolțurile complet retrase
        st.boltsRetraction += (0.35 - st.boltsRetraction) * 0.15;

        // Ușa masivă se deschide pivotând pe balamaua stângă până la -75° (-1.35 rad)
        st.doorAngle += (-1.35 - st.doorAngle) * 0.065;
        hingePivot.rotation.y = st.doorAngle;

        // Creșterea intensității luminii aurii interioare
        vaultInteriorLight.intensity += (3.5 - vaultInteriorLight.intensity) * 0.05;
      } else {
        // Locked: rotație lentă dacă a fost învârtită manual sau repaus
        if (!st.isDraggingWheel) {
          wheelGroup.rotation.z = st.wheelAngle;
        }
      }

      // Poziționare dinamică a bolțurilor de oțel
      bolts.forEach(b => {
        const dist = 2.22 - st.boltsRetraction;
        b.mesh.position.set(
          Math.cos(b.angle) * dist,
          Math.sin(b.angle) * dist,
          0.1
        );
      });

      renderer.render(scene, camera);
    };

    animateLoop();

    // 11. Cleanup WebGL complet
    return () => {
      cancelAnimationFrame(animId);
      domElement.removeEventListener('mousemove', handleMouseMove);
      domElement.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      domElement.removeEventListener('touchmove', handlePointerMove);
      domElement.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchend', handlePointerUp);

      chamberGeo.dispose();
      backWallGeo.dispose();
      treasureGeo.dispose();
      treasureMat.dispose();
      outerRingGeo.dispose();
      rivetGeo.dispose();
      hingePinGeo.dispose();
      doorBodyGeo.dispose();
      brassFaceGeo.dispose();
      innerRingGeo.dispose();
      markGeo.dispose();
      boltGeo.dispose();
      hubGeo.dispose();
      medalGeo.dispose();
      medalMat.dispose();
      spokeGeo.dispose();
      handleBallGeo.dispose();
      steelMat.dispose();
      brassMat.dispose();
      chromeMat.dispose();
      velvetMat.dispose();

      renderer.dispose();
      if (mount && renderer.domElement && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative mx-auto flex h-64 w-64 sm:h-80 sm:w-80 items-center justify-center cursor-pointer select-none">
      {/* Pânză WebGL 3D a Seifului */}
      <div ref={mountRef} className="h-full w-full" />
    </div>
  );
}

export default Vault3D;
