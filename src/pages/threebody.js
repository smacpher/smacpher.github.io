import "../styles/threebody.css"

import { Camera, MeshPhongMaterial, PerspectiveCamera, Vector3 } from "three"
import { Canvas, MeshProps, useFrame } from "react-three-fiber"
import React, { useRef } from "react"

import Layout from "../components/layout"

/**
 * Calculating simple circular orbits
 *
 * I need a way to calculate where the spheres travel over time.
 * We only have differential equations that describe each sphere motion, since there
 * isn't a closed solution for the three-body problem.
 *
 * To start, I'm going to try to animate the sphere to travel in a circular orbit around the screen.
 *
 * One way to do this is to use the parametric representation of a circle:
 *
 * x = cos(t)
 * y = sin(t)
 *
 * These two equations trace a circle as your vary t.
 *
 * Put these equations into https://www.desmos.com/calculator to see them in action.
 *
 * Two body system (https://towardsdatascience.com/modelling-the-three-body-problem-in-classical-mechanics-using-python-9dc270ad7767)
 *
 * Newton's Law of Gravitation: F = ((G * m1 * m2) / r^2) * r
 * where G is the universal gravitational constant: 6.67408 × 10-11 m3 kg-1 s-2;
 * r^2 is the distance between the two bodies;
 * and r is a unit vector that points away from the body m1 towards m2.
 *
 * To get the acceleration of one of the bodies, we can plug that equation in to
 * Newton's second law of motion: F = ma and solve for a:
 *
 * ((G * m1 * m2) / r^2) * r = m1 * a
 *
 * a can also be re-written as: a = d^2r / dt^2 (second deriv. of the position vector, r, w.r.t to time.) so we're left
 * with (flipped left and right side, too):
 *
 * m1 * d^2r / dt^2 = ((G * m1 * m2) / r^2) * r
 *
 * unpacking the unit vector, r, gives us:
 *
 * m1 * d^2r / dt^2 = ((G * m1 * m2) / r^3) * r12
 *
 * We now have a second-order differential equation to describe the acceleration of the bodies due to gravity.
 *
 * Further break it down into two first-order differential equations, to make it easier to work with:
 * Note: this equation applies to both bodies so we index it with i to make it generic.
 *
 * Substituting a = d^2r / dt^2 = dv / dt = v (a is just change in velocity over time)
 * and v = dr/dt gives us two new first-order differential equations:
 *
 * one that describes the change in velocity in terms of position and mass:
 * m_i * dv_i / dt = ((G * m_i * m_j) / r_ij^3) * r_ij
 *
 * and one that describes the change in position in terms of velocity:
 * dr/dt = v_i
 *
 * given initial position and velocity vectors for the two bodies, we can calculate their change in velocities at
 * each time step, use that to calculate their instantaneous velocity (add that to their previous velocities) and then since
 * velocity is just change in position over time, add that to the current position vector to get the next one.
 *
 * Before integrating these equations, first non-dimensionalize them. We convert all quantities that have dimensions (e.g. m/s, kg, etc.)
 * into ones that don't have dimensional quantities by dividing them by some reference value with the same dimension. This helps
 * scale quantities to make our numerical methods converge faster and make calculations computationally cheaper since all values
 * will be relatively close to 1. Also gives a reference point for scale. Everything is described wrt to the reference quantities
 * (e.g 2x the reference quantity).
 *
 * Divide both sides by a fixed reference quantity. Can lump this amount into a constant K:
 *
 * leaves us with:
 * m_i * dv_i / dt = K_1 * ((m_i * m_j) / r_ij ^ 3) * r_ij
 * dr_i / dt = K_2 * v_i
 */

function Sphere({ meshRef, ...props }) {
  return (
    <mesh ref={meshRef} {...props}>
      <sphereBufferGeometry args={[0.5, 30, 30]} />
      <meshPhongMaterial color={"blue"} />
    </mesh>
  )
}

// Define the universal gravitation constant.
const G = 6.67408e-11 // N-m2/kg2

// Define reference quantities
const m_nd = 1.989e30 // kg, mass of the sun
const r_nd = 5.326e12 // m, distance between stars in Alpha Centauri
const v_nd = 30000 // m/s, relative velocity of earth around the sun
const t_nd = 79.91 * 365 * 24 * 3600 * 0.51 // orbital period of Alpha Centauri

function compute_differentials(m1, m2, v1, v2, r1, r2) {
  // Calculate the vector between the two bodies.
  const r12 = r1.clone().sub(r2)

  // Calculate the length or "norm" of the vector between the two bodies.
  const r_norm = r12.length()

  // Calculate the velocity differentials for both bodies.
  const dv1_dt = r12.negate().multiplyScalar(m2 / r_norm ** 3)
  const dv2_dt = r1.multiplyScalar(m1 / r_norm ** 3)

  // Calculate the positional differentials for both bodies.
  const dr1_dt = v1
  const dr2_dt = v2

  return [dv1_dt, dv2_dt, dr1_dt, dr2_dt]
}

function compute_center_of_mass_vectors(m1, m2, v1, v2, r1, r2) {
  const v_center_of_mass = new Vector3()
  v_center_of_mass
    .add(v1.multiplyScalar(m1))
    .add(v2.multiplyScalar(m2))
    .divideScalar(m1 + m2)

  const r_center_of_mass = new Vector3()
  r_center_of_mass
    .add(r1.multiplyScalar(m1))
    .add(r2.multiplyScalar(m2))
    .divideScalar(m1 + m2)

  return [v_center_of_mass, r_center_of_mass]
}

function ThreeBodySimulation() {
  // Create a reference to hold our time counter.
  const time = useRef(0.0)

  const body1 = useRef()
  const body2 = useRef()

  // Define masses of the bodies.
  const m1 = 1.1 // Alpha Centauri A
  const m2 = 0.907 // Alpha Centauri B

  // Define initial position vectors.
  const r1 = new Vector3(-1.0, 0, 0) // m
  const r2 = new Vector3(1.0, 0, 0) // m

  // Define initial velocities
  const v1 = new Vector3(0.01, 0.01, 0) // m/s
  const v2 = new Vector3(-0.05, 0, -0.1) // m/s

  // Find center of mass.
  useFrame(() => {
    const [dv1_dt, dv2_dt, dr1_dt, dr2_dt] = compute_differentials(
      m1,
      m2,
      v1,
      v2,
      r1,
      r2
    )

    // Calculate new instantaneous velocities by adding change in velocity to previous velocity.
    const new_v1 = v1.add(dv1_dt)
    const new_v2 = v2.add(dv2_dt)

    // Calculate new position by adding new velo
    // body1.current.position.add(new_v1)
    // body2.current.position.add(new_v2)
  })

  return (
    <>
      <Sphere meshRef={body1} position={[r1.x, r1.y, r1.z]} />
      <Sphere meshRef={body2} position={[r2.x, r2.y, r2.z]} />
    </>
  )
}

export default function ThreeBody() {
  // Note: The `Canvas` component represents a scene on the HTML canvas in vanilla three.js.

  const camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 7, 7)

  return (
    <div className="center canvas-wrapper">
      <Canvas camera={camera}>
        <axesHelper args={[5]} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <ThreeBodySimulation />
      </Canvas>
    </div>
  )
}
