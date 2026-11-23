import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ScientificUniverseCanvas({
  density = "high", // 'high' | 'subtle'
  className = "",
  showFloatingObjects = true,
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b18, 0.025);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, 16);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch (err) {
      console.warn("WebGL not supported or disabled, skipping 3D background", err);
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x101a35, 1.8);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00d9ff, 3.5, 30);
    cyanLight.position.set(8, 6, 8);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 3.5, 30);
    purpleLight.position.set(-8, -6, 8);
    scene.add(purpleLight);

    const aquaLight = new THREE.DirectionalLight(0x43e6cf, 1.2);
    aquaLight.position.set(0, 10, 5);
    scene.add(aquaLight);

    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    // Helper Materials
    const cyanWireMat = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      emissive: 0x00d9ff,
      emissiveIntensity: 0.6,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });

    const purpleWireMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.5,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x43e6cf,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8,
      ior: 1.45,
    });

    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      emissive: 0x00a3cc,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.85,
      roughness: 0.2,
    });

    const chipMat = new THREE.MeshStandardMaterial({
      color: 0x101a35,
      roughness: 0.3,
      metalness: 0.8,
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffb703,
      emissive: 0xffb703,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.2,
    });

    const floatingItems = [];

    if (showFloatingObjects) {
      // 1. Digital Molecule (Right side)
      const moleculeGroup = new THREE.Group();
      const centerAtom = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0x00d9ff,
          emissive: 0x00d9ff,
          emissiveIntensity: 0.7,
          roughness: 0.2,
        })
      );
      moleculeGroup.add(centerAtom);

      const atomPositions = [
        [1.6, 1.2, 0],
        [-1.6, 1.2, 0],
        [0, -1.8, 0.8],
        [0.8, -0.6, -1.4],
      ];

      atomPositions.forEach((pos) => {
        const satAtom = new THREE.Mesh(
          new THREE.SphereGeometry(0.45, 16, 16),
          new THREE.MeshStandardMaterial({
            color: 0x8b5cf6,
            emissive: 0x8b5cf6,
            emissiveIntensity: 0.8,
            roughness: 0.3,
          })
        );
        satAtom.position.set(pos[0], pos[1], pos[2]);
        moleculeGroup.add(satAtom);

        // Cylinder bond
        const p1 = new THREE.Vector3(0, 0, 0);
        const p2 = new THREE.Vector3(...pos);
        const distance = p1.distanceTo(p2);
        const cylinder = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, distance, 8),
          new THREE.MeshStandardMaterial({
            color: 0x43e6cf,
            emissive: 0x43e6cf,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.75,
          })
        );
        cylinder.position.copy(p1).lerp(p2, 0.5);
        cylinder.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          p2.clone().sub(p1).normalize()
        );
        moleculeGroup.add(cylinder);
      });

      moleculeGroup.position.set(7.5, 2.5, -1);
      objectsGroup.add(moleculeGroup);
      floatingItems.push({
        obj: moleculeGroup,
        baseY: 2.5,
        rotSpeed: { x: 0.004, y: 0.007, z: 0.002 },
        floatSpeed: 0.0015,
        phase: 0,
      });

      // 2. Holographic Data Cube (Left upper side)
      const cubeGroup = new THREE.Group();
      const outerCube = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 1.8, 1.8),
        cyanWireMat
      );
      cubeGroup.add(outerCube);

      const innerCore = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.7, 0),
        new THREE.MeshStandardMaterial({
          color: 0x8b5cf6,
          emissive: 0x8b5cf6,
          emissiveIntensity: 0.9,
          roughness: 0.1,
        })
      );
      cubeGroup.add(innerCore);

      cubeGroup.position.set(-7.5, 3.2, 0);
      objectsGroup.add(cubeGroup);
      floatingItems.push({
        obj: cubeGroup,
        baseY: 3.2,
        rotSpeed: { x: 0.006, y: 0.005, z: 0.003 },
        floatSpeed: 0.0018,
        phase: 1.2,
      });

      // 3. AI Processor Microchip (Bottom Left)
      const chipGroup = new THREE.Group();
      const chipBase = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.18, 2.2),
        chipMat
      );
      chipGroup.add(chipBase);

      const chipDie = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.22, 1.2),
        new THREE.MeshStandardMaterial({
          color: 0x00d9ff,
          emissive: 0x00d9ff,
          emissiveIntensity: 0.8,
          roughness: 0.2,
          metalness: 0.9,
        })
      );
      chipGroup.add(chipDie);

      // Pins around border
      for (let i = -0.9; i <= 0.9; i += 0.3) {
        const pin1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.25), goldMat);
        pin1.position.set(i, 0, 1.15);
        chipGroup.add(pin1);

        const pin2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.25), goldMat);
        pin2.position.set(i, 0, -1.15);
        chipGroup.add(pin2);

        const pin3 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.08, 0.1), goldMat);
        pin3.position.set(1.15, 0, i);
        chipGroup.add(pin3);

        const pin4 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.08, 0.1), goldMat);
        pin4.position.set(-1.15, 0, i);
        chipGroup.add(pin4);
      }

      chipGroup.position.set(-6.8, -3.2, -1);
      chipGroup.rotation.set(0.6, 0.4, 0.2);
      objectsGroup.add(chipGroup);
      floatingItems.push({
        obj: chipGroup,
        baseY: -3.2,
        rotSpeed: { x: 0.003, y: 0.005, z: 0.002 },
        floatSpeed: 0.0012,
        phase: 2.4,
      });

      // 4. Lab Conical Flask / Beaker (Bottom Right)
      const flaskGroup = new THREE.Group();
      // Glass body
      const coneBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 1.4, 2.2, 24, 1, true),
        glassMat
      );
      flaskGroup.add(coneBody);

      // Neck
      const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.9, 24, 1, true),
        glassMat
      );
      neck.position.y = 1.45;
      flaskGroup.add(neck);

      // Liquid inside
      const liquid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 1.3, 1.0, 24),
        liquidMat
      );
      liquid.position.y = -0.55;
      flaskGroup.add(liquid);

      flaskGroup.position.set(7.2, -3.4, 0);
      flaskGroup.rotation.set(0.2, 0.1, -0.15);
      objectsGroup.add(flaskGroup);
      floatingItems.push({
        obj: flaskGroup,
        baseY: -3.4,
        rotSpeed: { x: 0.002, y: 0.006, z: 0.001 },
        floatSpeed: 0.0016,
        phase: 3.5,
      });

      // 5. Floating Geometric Tech Elements (Polyhedra & Torus)
      const icosa = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.9, 0),
        purpleWireMat
      );
      icosa.position.set(5.2, 5.0, -3);
      objectsGroup.add(icosa);
      floatingItems.push({
        obj: icosa,
        baseY: 5.0,
        rotSpeed: { x: 0.008, y: 0.006, z: 0.004 },
        floatSpeed: 0.002,
        phase: 4.2,
      });

      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(0.8, 0.08, 12, 32),
        new THREE.MeshStandardMaterial({
          color: 0x43e6cf,
          emissive: 0x43e6cf,
          emissiveIntensity: 0.8,
          wireframe: true,
        })
      );
      torus.position.set(-5.5, 4.8, -2);
      objectsGroup.add(torus);
      floatingItems.push({
        obj: torus,
        baseY: 4.8,
        rotSpeed: { x: 0.007, y: 0.009, z: 0.003 },
        floatSpeed: 0.0022,
        phase: 5.1,
      });
    }

    // Particle Star Field
    const isMobile = width < 768;
    const particleCount = isMobile
      ? 450
      : density === "high"
      ? 1400
      : 700;

    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color(0x00d9ff), // Electric cyan
      new THREE.Color(0x8b5cf6), // Purple
      new THREE.Color(0x287bff), // Neon blue
      new THREE.Color(0x43e6cf), // Aqua
      new THREE.Color(0xffffff), // White
    ];

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 36;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 26;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 24;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colorArray[i * 3] = c.r;
      colorArray[i * 3 + 1] = c.g;
      colorArray[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

    // Particle texture generator (smooth circular glow)
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.3, "rgba(0,217,255,0.8)");
    gradient.addColorStop(0.7, "rgba(139,92,246,0.3)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Tracking for subtle parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera parallax interpolation
      targetCameraX = mouseX * 2.5;
      targetCameraY = -mouseY * 2.0;
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Rotate particle cloud gently
      if (!prefersReducedMotion) {
        particles.rotation.y = elapsed * 0.02;
        particles.rotation.x = elapsed * 0.01;

        // Animate floating items
        floatingItems.forEach((item) => {
          item.obj.rotation.x += item.rotSpeed.x;
          item.obj.rotation.y += item.rotSpeed.y;
          item.obj.rotation.z += item.rotSpeed.z;

          // Vertical hover oscillation
          item.obj.position.y =
            item.baseY + Math.sin(elapsed * 1.5 + item.phase) * 0.45;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
    };
  }, [density, showFloatingObjects]);

  return (
    <div
      ref={mountRef}
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}
