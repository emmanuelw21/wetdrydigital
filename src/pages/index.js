import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Avatar from '../components/Avatar'
import BaseModel from '../components/BaseModel'
import ThirdPersonControls from '../components/ThirdPersonControls'

const IndexPage = () => {
  const avatarRef = useRef()

  return (
    <main>
      <h1>Collection of Things</h1>
      <Canvas style={{ height: '100vh', width: '100vw' }} backgroundColor="lightblue">
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <BaseModel url="/models/environment.glb" />
        <Avatar url="/models/face.glb" ref={avatarRef} />
        <ThirdPersonControls avatarRef={avatarRef} maxHeight={10} />
      </Canvas>
    </main>
  )
}

export default IndexPage
