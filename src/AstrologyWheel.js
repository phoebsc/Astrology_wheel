import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import SplitPane, { SplitPaneLeft, SplitPaneRight, Divider } from './utility/SplitPane';
import StopButton from './StopButton';

const ThreeAstrologyWheel = () => {
  const sceneRef = useRef();
  const [animationParams, setAnimationParams] = useState({
    isAnimating: true,
    speed: 0.005,
    flipDuration: 3,
  });
  var flipStartTime;

useEffect(() => {
  // Set up scene
  const scene = new THREE.Scene();

  // Set up camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Set up renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  sceneRef.current.appendChild(renderer.domElement);

  // Function to create dividing lines
  const createDividingLines = (radius, segments) => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      vertices.push(x, y, 0);
      vertices.push(x, y, 0); // Duplicate vertices to create line segments
      vertices.push(0, 0, 0); // Center point to connect the lines
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xffffff }));
  };

  // Create concentric circles for signs, houses, and planets
  const circleRadius = [2, 1.5, 1]; // Radii for outer, middle, and inner circles

  // Function to create circles
  const createCircle = (radius, segments) => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      vertices.push(x, y, 0);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xffffff }));
  };

  // Create outer circle for signs
  const signsCircle = createCircle(circleRadius[0], 64); // Increased segments for smoother appearance
  scene.add(signsCircle);

  // Create dividing lines for signs
  const signsDividingLines = createDividingLines(circleRadius[0], 12);
  scene.add(signsDividingLines);

  // Create middle circle for houses
  const housesCircle = createCircle(circleRadius[1], 64);
  scene.add(housesCircle);

  // Create inner circle for planets (without dividing lines)
  const planetsCircle = createCircle(circleRadius[2], 64);
  scene.add(planetsCircle);

  // Create dividing lines between the outer and second circles (12 segments)
  const dividingLinesGeometry = new THREE.BufferGeometry();
  const dividingLinesVertices = [];
  for (let i = 0; i <= 12; i++) {
    const theta = (i / 12) * Math.PI * 2;
    const x = circleRadius[0] * Math.cos(theta);
    const y = circleRadius[0] * Math.sin(theta);
    dividingLinesVertices.push(x, y, 0);
    dividingLinesVertices.push(x, y, 0); // Duplicate vertices to create line segments
    dividingLinesVertices.push(0, 0, 0); // Center point to connect the lines
  }
  dividingLinesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dividingLinesVertices, 3));
  const dividingLines = new THREE.Line(dividingLinesGeometry, new THREE.LineBasicMaterial({ color: 0xffffff }));
  scene.add(dividingLines);

  // Create planets (circles) and position them on the innermost circle
  const planetColors = [
    // Colors for planets
    0xffff00, 0xaaaaaa, 0xff0000, 0xffa500, 0x666666, 0x0000ff, 0x00ff00,
  ];

  const planets = planetColors.map((color, index) => {
    const planetMaterial = new THREE.MeshBasicMaterial({ color });
    const planet = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), planetMaterial);
    const angle = (index / 7) * Math.PI * 2; // Equally spaced angles
    const x = circleRadius[2] * Math.cos(angle);
    const y = circleRadius[2] * Math.sin(angle);
    planet.position.set(x, y, 0);
    scene.add(planet);
    return planet;
  });

  let flipStartTime = null;

  // Set up animation
  // Set up animation
    const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
  const animate = () => {
    if (flipStartTime === null) {
      flipStartTime = Date.now();
    }

    const elapsedTime = (Date.now() - flipStartTime) / 1000; // Convert to seconds

    if (elapsedTime < animationParams.flipDuration) {
      // Apply easing function for acceleration and deceleration
      const progress = elapsedTime / animationParams.flipDuration;
      const easedProgress = easeInOutQuad(progress);

      // Apply rotation with easing
      const rotationAmount = (Math.PI * easedProgress * 6) / animationParams.flipDuration; // 3 circles in 5 seconds
      scene.rotation.y = rotationAmount;
    } else {
      // Stop the animation
      scene.rotation.y = 0;
    }

    if (animationParams.isAnimating) {
      requestAnimationFrame(animate);
    }

    renderer.render(scene, camera);
  };

  animate();

  // Easing function for acceleration and deceleration
  animate();

  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Clean up on unmount
  return () => {
    window.removeEventListener('resize', () => {});
    sceneRef.current.removeChild(renderer.domElement);
  };
}, []); // Empty dependency array to run the effect only once


  const handleSpeedChange = (speed) => {
    setAnimationParams((prevParams) => ({
      ...prevParams,
      speed,
    }));
  };

  return (
    <>
      <div ref={sceneRef} />
      <div>
        <button onClick={() => handleSpeedChange(0.005)}>Normal Speed</button>
        <button onClick={() => handleSpeedChange(0.01)}>Fast Speed</button>
        <button onClick={() => handleSpeedChange(0.002)}>Slow Speed</button>
      </div>
    </>
  );
};

export default ThreeAstrologyWheel;
