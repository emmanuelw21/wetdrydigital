// src/components/ThreeDScene.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';

const ThreeDScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation
    controls.minAzimuthAngle = -Math.PI / 2; // Limit horizontal rotation
    controls.maxAzimuthAngle = Math.PI / 2;

    // Add a simple box
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Cannon.js physics world
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    // Create a sphere body
    const shape = new CANNON.Sphere(1);
    const body = new CANNON.Body({
      mass: 5,
      position: new CANNON.Vec3(0, 10, 0),
      shape: shape,
    });
    world.addBody(body);

    // Sync the Cannon.js body with the Three.js mesh
    const sphereGeometry = new THREE.SphereGeometry(1);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphereMesh);

    // Create ground plane
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.position.set(0, 0, 0);
    world.addBody(groundBody);

    // Create boundary walls
    const wallShape = new CANNON.Box(new CANNON.Vec3(5, 5, 0.1));
    const wallBody = new CANNON.Body({ mass: 0 });
    wallBody.addShape(wallShape);
    wallBody.position.set(0, 5, 5);
    world.addBody(wallBody);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Step the physics world
      world.step(1 / 60);

      // Sync Cannon.js bodies with Three.js meshes
      sphereMesh.position.copy(body.position);
      sphereMesh.quaternion.copy(body.quaternion);

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef}></div>;
};

export default ThreeDScene;
