import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { VRMLoader } from '@pixiv/three-vrm'

const Scene3D = ({ onLoad }) => {
  const mountRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    camera.position.set(0, 1.5, -1)
    controls.target.set(0, 1, 0)

    const light = new THREE.DirectionalLight(0xffffff)
    light.position.set(1, 1, 1).normalize()
    scene.add(light)

    const loader = new GLTFLoader()
    loader.load(
      '/environment.glb',
      (gltf) => {
        scene.add(gltf.scene)
        
        // Load avatar after environment is loaded
        const vrmLoader = new VRMLoader()
        vrmLoader.load(
          '/avatar.vrm',
          (vrm) => {
            scene.add(vrm.scene)
            vrm.scene.position.set(0, 0, 0)
            setIsLoading(false)
            if (onLoad) onLoad()
          },
          (progress) => console.log('Loading avatar...', progress.loaded / progress.total * 100, '%'),
          (error) => console.error('An error happened loading the avatar', error)
        )
      },
      (progress) => console.log('Loading environment...', progress.loaded / progress.total * 100, '%'),
      (error) => console.error('An error happened loading the environment', error)
    )

    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [onLoad])

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
}

export default Scene3D