import "../styles/threebody.css"

import { Canvas, useFrame } from "react-three-fiber"
import React, { useRef } from "react"

import Layout from "../components/layout"

function Sphere(props) {
  const time = useRef(0.0)

  // Create a reference that will point to our mesh.
  // Note: Gives direct access mesh to update it without triggering full re-renders?
  const mesh = useRef()

  // Rotate the mesh every frame.
  useFrame(() => {
    time.current += 0.01

    mesh.current.rotation.x = mesh.current.rotation.y += 0.01

    mesh.current.position.x = 1 * Math.cos(time.current)
    mesh.current.position.z = 1 * Math.sin(time.current)
  })

  return (
    <mesh {...props} ref={mesh}>
      <sphereBufferGeometry args={[0.5, 30, 30]} />
      {/* <boxBufferGeometry args={[1, 1, 1]} /> */}
      <meshPhongMaterial color={"blue"} />
    </mesh>
  )
}

export default function ThreeBody() {
  // Create a reference that will point to our sphere mesh.
  const mesh = useRef()

  return (
    <div className="center canvas-wrapper">
      <Canvas className="canvas">
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Sphere position={[0, 0, 0]} />
      </Canvas>
    </div>
  )
}
