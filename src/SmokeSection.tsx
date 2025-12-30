// components/SmokeSection.jsx
"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function SmokeSection({ particleCount = 150 }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const spacerBeforeRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    smokeParticles: [],
    material: null,
    animId: null,
    lastScrollY: 0,
    scrollProgress: 0, // 0..1
    vacuum: 0, // 0..1, 1 means vacuum on (pulled)
    opacity: 0, // 0..1, controls smoke visibility
    sectionOffsetTop: 0, // position of section in document flow
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Basic three setup ---
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // transparent
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );
    camera.position.z = 1000;

    // lighting
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(-1, 0, 1);
    scene.add(dir);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // load texture
    const loader = new THREE.TextureLoader();
    const smokeURL =
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png";

    // We'll create one material (shared) and many meshes (planes).
    const smokeMaterial = new THREE.MeshLambertMaterial({
      map: loader.load(smokeURL),
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.NormalBlending,
      color: new THREE.Color(0xFFFFFF),
    });

    const smokeGeo = new THREE.PlaneGeometry(300, 300);
    const smokeParticles = [];

    // Particle initial positions distributed across screen for wavy effect
    // We'll store base positions on the mesh.userData for deterministic movement.
    // When particleProgress=1, we want particles centered around x=0, spread from -800 to +800
    // So baseX should be around -1500 to -500, and travel should be around 1500
    for (let i = 0; i < particleCount; i++) {
      const m = new THREE.Mesh(smokeGeo, smokeMaterial);
      // Distribute particles starting from left side
      // When particleProgress=1, they'll be at baseX + 1500, which centers them around 0
      const x = -1500 + (i / particleCount) * 1000; // start from -1500 to -500
      const y = (Math.random() - 0.5) * window.innerHeight * 1.5;
      const z = (Math.random() - 0.5) * 1000;
      m.position.set(x, y, z);
      m.rotation.z = Math.random() * Math.PI * 2;
      const scl = 0.8 + Math.random() * 2.2;
      m.scale.setScalar(scl);
      m.userData = {
        baseX: x,
        baseY: y,
        baseZ: z,
        seed: Math.random(),
        baseScale: scl,
        wavePhase: Math.random() * Math.PI * 2, // phase for wavy movement
        waveAmplitude: 50 + Math.random() * 100, // amplitude for wavy movement
        waveFrequency: 0.5 + Math.random() * 1.5, // frequency for wavy movement
      };
      scene.add(m);
      smokeParticles.push(m);
    }

    // Save refs to stateRef for use in animation and cleanup
    stateRef.current.renderer = renderer;
    stateRef.current.scene = scene;
    stateRef.current.camera = camera;
    stateRef.current.smokeParticles = smokeParticles;
    stateRef.current.material = smokeMaterial;

    // Resize handler
    function onResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", onResize);

    // Scroll mapping
    // We'll compute `progress` (0..1) when the section crosses the viewport.
    function computeProgress() {
      if (!spacerBeforeRef.current) return { progress: 0, opacity: 0 };
      
      // Get the position of the spacer before the section (which represents where section starts in scroll)
      const spacerRect = spacerBeforeRef.current.getBoundingClientRect();
      const h = window.innerHeight;
      const scrollY = window.scrollY;
      
      // Calculate the section's position in document flow
      // Extended section: 100vh for fade in + 200vh for holding full screen + 100vh for fade out = 400vh total
      const sectionTop = spacerRect.top + scrollY;
      const sectionHeight = h * 4; // 4 viewport heights total
      const sectionBottom = sectionTop + sectionHeight;
      
      // Calculate progress based on scroll position relative to section
      const viewportTop = scrollY;
      
      // Progress: 0 when viewport top reaches section start, 1 when viewport top reaches section end
      let progress = (viewportTop - sectionTop) / sectionHeight;
      progress = Math.max(0, Math.min(1, progress));
      
      // Calculate opacity with extended full-screen period:
      // - Fade in: progress 0->0.25 (first 25% = 1vh)
      // - Full opacity: progress 0.25->0.75 (middle 50% = 2vh - this is the "2 extra scrolls")
      // - Fade out: progress 0.75->1 (last 25% = 1vh)
      let opacity = 0;
      if (progress < 0.2) {
        // Fade in slowly when arriving (first viewport)
        opacity = progress / 0.2;
      } else if (progress < 0.5) {
        // Full opacity - hold for 2 extra scrolls (middle 2 viewports)
        opacity = 1;
      } else {
        // Fade out slowly when scrolling past (last viewport)
        opacity = 1 - (progress - 0.5) / 0.5;
      }
      
      // Hide navbar when smoke is visible (opacity > 0.1)
      if (opacity > 0.1) {
        document.body.classList.add('smoke-active');
      } else {
        document.body.classList.remove('smoke-active');
      }
      
      return { progress, opacity };
    }

    let scrollTimeout = null;
    function onScroll() {
      const cur = window.scrollY;
      const dirDown = cur > stateRef.current.lastScrollY;
      stateRef.current.lastScrollY = cur;

      const { progress, opacity } = computeProgress();
      
      // Smooth tween to new scrollProgress and opacity (gsap for polish)
      gsap.to(stateRef.current, {
        duration: 0.6,
        scrollProgress: progress,
        opacity: opacity,
        ease: "power2.out",
      });

      // Update material opacity based on computed opacity
      gsap.to(smokeMaterial, {
        duration: 0.8,
        opacity: opacity * 0.9, // multiply by base opacity
        ease: "power2.out",
      });

      // If scrolling up, enable vacuum a bit, else reduce vacuum.
    //   if (!dirDown) {
    //     // scrolling up -> vacuum on gently
    //     gsap.to(stateRef.current, { duration: 0.6, vacuum: 1, ease: "power2.out" });
    //   } else {
    //     // scrolling down -> vacuum off
    //     gsap.to(stateRef.current, { duration: 0.6, vacuum: 0, ease: "power2.out" });
    //   }

      // small debounce to force vacuum off if user stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // when user stops scrolling, leak vacuum back to 0 slowly
        gsap.to(stateRef.current, { duration: 1.2, vacuum: 0, ease: "power2.out" });
      }, 350);
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    // animation loop
    let prevTime = performance.now();
    function animate(now) {
      const dt = (now - prevTime) / 1000;
      prevTime = now;

      const s = stateRef.current;
      const particles = s.smokeParticles;
      const prog = s.scrollProgress; // 0..1 (over entire 400vh scroll)
      const vac = s.vacuum; // 0..1
      const opacity = s.opacity; // 0..1

      // Map progress to particle movement progress:
      // - During fade in (0->0.25): particles move from left to center (0->1)
      // - During hold (0.25->0.75): particles stay at center (1)
      // - During fade out (0.75->1): particles move from center to right (1->0, but we want them to stay visible)
      let particleProgress = 0;
      if (prog < 0.25) {
        // Fade in: particles move into view
        particleProgress = prog / 0.25; // 0 -> 1
      } else if (prog < 0.75) {
        // Hold period: particles stay at full position
        particleProgress = 1;
      } else {
        // Fade out: particles can move slightly but stay mostly visible
        particleProgress = 1 - (prog - 0.75) * 0.5; // 1 -> 0.5 (so they don't disappear completely)
      }

      // parameters
      const travel = 1500; // how far particles travel to the right when progress=1
      // With baseX from -1500 to -500, and travel=1500, final positions will be 0 to 1000
      // This centers particles on screen when particleProgress=1
      const rotSpeed = 0.15;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const u = p.userData;
        // time-based for wavy movement
        const t = now * 0.0008 + u.seed * 10;
        
        // Wavy horizontal movement - multiple sine waves for organic wavy pattern
        const wave1 = Math.sin(t * u.waveFrequency + u.wavePhase) * u.waveAmplitude;
        const wave2 = Math.sin(t * u.waveFrequency * 0.7 + u.wavePhase + Math.PI / 3) * (u.waveAmplitude * 0.6);
        const wave3 = Math.cos(t * u.waveFrequency * 0.5 + u.wavePhase + Math.PI / 2) * (u.waveAmplitude * 0.4);
        const wavyOffset = wave1 + wave2 + wave3;
        
        // base target x = baseX + particleProgress * travel + wavy offset
        // During hold period, particleProgress stays at 1, so particles stay in position
        // We want particles to be centered around screen center (x=0) when particleProgress=1
        // So: baseX starts negative, and travel should bring them to center area
        const targetX = u.baseX + particleProgress * travel + wavyOffset;
        // Vacuum adds extra left pull: when vac > 0, blend target back toward very-left value
        const vacuumPullX = -1200; // extreme left when vacuum is on
        const finalX = THREE.MathUtils.lerp(targetX, vacuumPullX, vac * 0.95);
        // smooth movement
        p.position.x += (finalX - p.position.x) * (0.1 + particleProgress * 0.06);

        // Wavy vertical movement - sine waves for up/down wavy motion
        const verticalWave1 = Math.sin(t * 0.8 + u.seed * 5) * (60 + u.seed * 80);
        const verticalWave2 = Math.cos(t * 0.6 + u.seed * 7) * (40 + u.seed * 60);
        const verticalOffset = verticalWave1 + verticalWave2;
        // During hold period, keep particles centered vertically
        const verticalProg = particleProgress;
        const ty = u.baseY + verticalOffset + (verticalProg - 0.5) * 80;
        p.position.y += (ty - p.position.y) * 0.07;

        // z nudging with wavy pattern for depth
        const zWave = Math.sin(t * 0.5 + u.seed * 3) * 150;
        // During hold period, keep particles at good depth
        const zProg = particleProgress;
        const tz = u.baseZ + (zProg - 0.5) * 250 + zWave;
        p.position.z += (tz - p.position.z) * 0.05;

        // rotate slowly with slight variation
        p.rotation.z += rotSpeed * dt * (0.5 + u.seed * 0.5);
        
        // Scale based on particle progress and opacity
        const targetScale = u.baseScale * (0.8 + particleProgress * 1.8 - vac * 0.8) * (0.7 + opacity * 0.3);
        p.scale.x += (targetScale - p.scale.x) * 0.07;
        p.scale.y = p.scale.x;
      }

      renderer.render(scene, camera);
      s.animId = requestAnimationFrame(animate);
    }
    stateRef.current.animId = requestAnimationFrame(animate);

    // initial scroll compute so smoke starts at correct position if user already scrolled
    const initial = computeProgress();
    gsap.set(stateRef.current, { 
      scrollProgress: initial.progress, 
      opacity: initial.opacity,
      vacuum: 0 
    });
    // ensure material opacity initial
    smokeMaterial.opacity = initial.opacity * 0.9;

    // cleanup
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimeout);
      if (stateRef.current.animId) cancelAnimationFrame(stateRef.current.animId);
      // dispose three resources
      smokeParticles.forEach((m) => {
        scene.remove(m);
        if (m.geometry) m.geometry.dispose();
        // material is shared; dispose once below
      });
      if (smokeMaterial.map) smokeMaterial.map.dispose();
      smokeMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [particleCount]);

  return (
    <>
      {/* Spacer to maintain scroll position */}
      <div ref={spacerBeforeRef} style={{ height: "100vh" }} />
      <section
        id="smoke-section"
        ref={sectionRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 40,
        }}
      >
        {/* Canvas container */}
        <div
          ref={containerRef}
          className="smoke-container"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
        {/* overlay content (optional) */}
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            // Do not block page interactions
            pointerEvents: "none",
          }}
        >
        </div>
      </section>
      {/* Extended spacer to maintain scroll position for 2 extra scrolls (3vh total: 1vh before + 2vh extra) */}
      <div style={{ height: "300vh" }} />
    </>
  );
}
