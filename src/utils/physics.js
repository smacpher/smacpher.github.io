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
