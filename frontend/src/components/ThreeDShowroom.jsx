import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FiRotateCw, FiSun, FiMoon, FiSliders } from 'react-icons/fi';

const ThreeDShowroom = ({ product }) => {
  const mountRef = useRef(null);
  const [activeColor, setActiveColor] = useState('#6366f1'); // Default Indigo
  const [activeFinish, setActiveFinish] = useState('metallic'); // metallic, glossy, matte
  const [lightingMode, setLightingMode] = useState('studio'); // studio, cyberpunk, neon-gold
  const [isRotating, setIsRotating] = useState(true);

  // Keep refs of mesh parts to update materials dynamically
  const materialRefs = useRef({
    cushionLeft: null,
    cushionRight: null,
    cupLeft: null,
    cupRight: null,
    band: null,
    accent: null
  });

  const colors = [
    { name: 'Hyper Indigo', value: '#6366f1' },
    { name: 'Cyber Crimson', value: '#ef4444' },
    { name: 'Aurora Emerald', value: '#10b981' },
    { name: 'Vaporwave Pink', value: '#ec4899' },
    { name: 'Luxury Gold', value: '#eab308' },
    { name: 'Stealth Black', value: '#1e293b' }
  ];

  // Update materials when color or finish changes
  useEffect(() => {
    const colorVal = new THREE.Color(activeColor);
    let metalness = 0.9;
    let roughness = 0.15;
    let clearcoat = 1.0;

    if (activeFinish === 'glossy') {
      metalness = 0.2;
      roughness = 0.05;
      clearcoat = 1.0;
    } else if (activeFinish === 'matte') {
      metalness = 0.0;
      roughness = 0.85;
      clearcoat = 0.0;
    }

    Object.values(materialRefs.current).forEach((mat) => {
      if (mat) {
        mat.color.copy(colorVal);
        mat.metalness = metalness;
        mat.roughness = roughness;
        if (mat.clearcoat !== undefined) mat.clearcoat = clearcoat;
        mat.needsUpdate = true;
      }
    });
  }, [activeColor, activeFinish]);

  useEffect(() => {
    if (!mountRef.current) return;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#09090b'); // Dark dashboard background

    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.5, 7);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // LIGHTS GROUP
    const lightsGroup = new THREE.Group();
    scene.add(lightsGroup);

    const updateLights = (mode) => {
      // Clear old lights
      while (lightsGroup.children.length > 0) {
        lightsGroup.remove(lightsGroup.children[0]);
      }

      const ambientLight = new THREE.AmbientLight('#ffffff', 0.2);
      lightsGroup.add(ambientLight);

      if (mode === 'studio') {
        const dirLight1 = new THREE.DirectionalLight('#ffffff', 1.2);
        dirLight1.position.set(5, 10, 7);
        lightsGroup.add(dirLight1);

        const fillLight = new THREE.DirectionalLight('#818cf8', 0.5);
        fillLight.position.set(-5, 3, -5);
        lightsGroup.add(fillLight);
      } else if (mode === 'cyberpunk') {
        const neonPink = new THREE.PointLight('#ec4899', 3, 15);
        neonPink.position.set(4, 3, 3);
        lightsGroup.add(neonPink);

        const neonCyan = new THREE.PointLight('#06b6d4', 3, 15);
        neonCyan.position.set(-4, -3, 3);
        lightsGroup.add(neonCyan);

        const rimLight = new THREE.DirectionalLight('#ffffff', 0.5);
        rimLight.position.set(0, 5, -5);
        lightsGroup.add(rimLight);
      } else if (mode === 'neon-gold') {
        const goldLight = new THREE.PointLight('#fbbf24', 4, 15);
        goldLight.position.set(3, 5, 2);
        lightsGroup.add(goldLight);

        const warmLight = new THREE.DirectionalLight('#f97316', 1);
        warmLight.position.set(-3, -2, 4);
        lightsGroup.add(warmLight);
      }
    };

    updateLights(lightingMode);

    // HEADPHONE MODEL CONSTRUCT
    const headphoneGroup = new THREE.Group();
    scene.add(headphoneGroup);

    // Common Materials
    const baseColor = new THREE.Color(activeColor);
    const primaryMat = new THREE.MeshPhysicalMaterial({
      color: baseColor,
      metalness: activeFinish === 'metallic' ? 0.9 : activeFinish === 'glossy' ? 0.2 : 0.0,
      roughness: activeFinish === 'metallic' ? 0.15 : activeFinish === 'glossy' ? 0.05 : 0.85,
      clearcoat: activeFinish === 'matte' ? 0 : 1,
      clearcoatRoughness: 0.1
    });

    const blackPlasticMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.5,
      metalness: 0.1
    });

    const cushionMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.9,
      metalness: 0.0
    });

    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8
    });

    // 1. Headband Arch
    const bandGeo = new THREE.TorusGeometry(2, 0.15, 16, 100, Math.PI);
    const band = new THREE.Mesh(bandGeo, primaryMat);
    band.rotation.x = 0;
    band.position.y = 0.5;
    headphoneGroup.add(band);
    materialRefs.current.band = primaryMat;

    // 2. Ear Cups (Left and Right)
    const cupGeo = new THREE.CylinderGeometry(0.7, 0.8, 0.5, 32);
    
    const cupLeft = new THREE.Mesh(cupGeo, primaryMat);
    cupLeft.position.set(-2, 0.4, 0);
    cupLeft.rotation.z = Math.PI / 2;
    headphoneGroup.add(cupLeft);
    materialRefs.current.cupLeft = primaryMat;

    const cupRight = new THREE.Mesh(cupGeo, primaryMat);
    cupRight.position.set(2, 0.4, 0);
    cupRight.rotation.z = -Math.PI / 2;
    headphoneGroup.add(cupRight);
    materialRefs.current.cupRight = primaryMat;

    // 3. Cushions (Inner soft parts)
    const cushionGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.25, 32);
    
    const cushionLeft = new THREE.Mesh(cushionGeo, cushionMat);
    cushionLeft.position.set(-1.8, 0.4, 0);
    cushionLeft.rotation.z = Math.PI / 2;
    headphoneGroup.add(cushionLeft);

    const cushionRight = new THREE.Mesh(cushionGeo, cushionMat);
    cushionRight.position.set(1.8, 0.4, 0);
    cushionRight.rotation.z = -Math.PI / 2;
    headphoneGroup.add(cushionRight);

    // 4. Accent Rings / LED lines
    const ringGeo = new THREE.TorusGeometry(0.68, 0.03, 8, 32);
    const glowRingLeft = new THREE.Mesh(ringGeo, glowMat);
    glowRingLeft.position.set(-2.26, 0.4, 0);
    glowRingLeft.rotation.y = Math.PI / 2;
    headphoneGroup.add(glowRingLeft);

    const glowRingRight = new THREE.Mesh(ringGeo, glowMat);
    glowRingRight.position.set(2.26, 0.4, 0);
    glowRingRight.rotation.y = Math.PI / 2;
    headphoneGroup.add(glowRingRight);

    // 5. Connecting struts
    const strutGeo = new THREE.BoxGeometry(0.1, 0.8, 0.1);
    const strutLeft = new THREE.Mesh(strutGeo, blackPlasticMat);
    strutLeft.position.set(-2, 1, 0);
    headphoneGroup.add(strutLeft);

    const strutRight = new THREE.Mesh(strutGeo, blackPlasticMat);
    strutRight.position.set(2, 1, 0);
    headphoneGroup.add(strutRight);

    // Subtle Ground Shadow/Reflector
    const shadowGeo = new THREE.RingGeometry(0.1, 2.5, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = Math.PI / 2;
    shadow.position.y = -1.8;
    scene.add(shadow);

    // ANIMATION & INTERACTION MOUSE CONTROL
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      
      headphoneGroup.rotation.y += deltaX * 0.01;
      headphoneGroup.rotation.x += deltaY * 0.01;

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Responsive sizing
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // LOOP
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isRotating && !isDragging) {
        headphoneGroup.rotation.y += 0.007;
      }

      // Add a slight hover float effect
      headphoneGroup.position.y = Math.sin(Date.now() * 0.0015) * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('mousedown', handleMouseDown);
      if (mountRef.current && dom) {
        mountRef.current.removeChild(dom);
      }
      renderer.dispose();
    };
  }, [lightingMode, isRotating]);

  const [activeHotspot, setActiveHotspot] = useState(null);

  const hotspots = [
    { id: 'cushion', label: 'Ear Cushions', x: '35%', y: '55%', detail: 'Breathable Memory Foam with magnetic attach mechanics and cooling gel layer.' },
    { id: 'driver', label: 'Drivers', x: '65%', y: '50%', detail: 'Custom 40mm Beryllium diaphragms delivering ultra-low distortion and premium response.' },
    { id: 'headband', label: 'Headband', x: '50%', y: '22%', detail: 'Reinforced carbon fiber core wrapped in premium full-grain leather for ergonomic comfort.' }
  ];

  return (
    <div className="flex flex-col lg:flex-row bg-slate-900/60 dark:bg-slate-950/40 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-800 shadow-2xl h-[520px]">
      {/* 3D Viewport */}
      <div className="relative flex-grow h-[350px] lg:h-full cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />
        
        {/* Interactive Spec Hotspots */}
        {hotspots.map((hs) => (
          <div 
            key={hs.id} 
            style={{ position: 'absolute', left: hs.x, top: hs.y }}
            className="z-10 group"
          >
            <button
              onClick={() => setActiveHotspot(activeHotspot === hs.id ? null : hs.id)}
              className="w-5 h-5 bg-indigo-500 hover:bg-indigo-400 border border-white/40 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg animate-pulse transition-all cursor-pointer pointer-events-auto"
            >
              +
            </button>
            {activeHotspot === hs.id && (
              <div className="absolute left-6 top-1/2 -translate-y-1/2 w-48 bg-slate-950/90 border border-slate-800 p-2.5 rounded-lg text-[10px] text-white shadow-xl pointer-events-auto z-20">
                <p className="font-bold text-indigo-400 mb-0.5">{hs.label}</p>
                <p className="text-slate-300 leading-normal">{hs.detail}</p>
              </div>
            )}
          </div>
        ))}

        {/* Interactive Overlay HUD */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 rounded-full uppercase">
            3D Studio Space
          </span>
          <h4 className="text-white font-bold text-lg mt-1 truncate max-w-[200px]">
            {product?.title || 'CyberSound Pro X'}
          </h4>
        </div>

        {/* Orbit Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] text-slate-400 flex items-center gap-1.5 pointer-events-none shadow-lg">
          <FiRotateCw className="animate-spin text-indigo-400" /> Click & Drag to Orbit 3D Model
        </div>

        {/* Play/Pause Rotation Toggle */}
        <button 
          onClick={() => setIsRotating(!isRotating)}
          className="absolute top-4 right-4 bg-slate-950/70 hover:bg-slate-900 border border-white/10 p-2.5 rounded-full text-white transition-colors"
          title="Toggle Auto Rotation"
        >
          <FiRotateCw className={isRotating ? 'animate-spin-slow text-emerald-400' : 'text-slate-400'} size={15} />
        </button>
      </div>

      {/* Control Panel */}
      <div className="w-full lg:w-[320px] bg-slate-950/90 p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
        <div>
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-5">
            <FiSliders className="text-indigo-400" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Customize Model</h4>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Body Shell Color</label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setActiveColor(c.value)}
                  style={{ backgroundColor: c.value }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform duration-200 ${
                    activeColor === c.value ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Finish Type Selection */}
          <div className="mb-6">
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Material Finish</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {['metallic', 'glossy', 'matte'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFinish(f)}
                  className={`py-1.5 text-[11px] font-bold rounded-lg border capitalize transition-all ${
                    activeFinish === f
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Lighting Mode Presets */}
          <div className="mb-6">
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Lighting Environment</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { id: 'studio', label: 'Studio', icon: <FiSun /> },
                { id: 'cyberpunk', label: 'Neon', icon: <FiMoon /> },
                { id: 'neon-gold', label: 'Luxury', icon: <FiSliders /> }
              ].map((env) => (
                <button
                  key={env.id}
                  onClick={() => setLightingMode(env.id)}
                  className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                    lightingMode === env.id
                      ? 'bg-purple-600 border-purple-400 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {env.icon}
                  {env.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl text-center">
          <p className="text-[11px] text-slate-400">
            Interactive visualizer simulated with physics-based rendering engines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreeDShowroom;
