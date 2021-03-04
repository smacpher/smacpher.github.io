import React from "react"
import { TestScheduler } from "jest"
import { Vector3 } from "three"
import { compute_differentials } from "./physics.js"
import renderer from "react-test-renderer"

describe("Two body problem", () => {
  test("Test `compute_differentials`", () => {
    const differentials = compute_differentials(
      1.0,
      1.0,
      new Vector3(1.0, 1.0, 1.0),
      new Vector3(1.0, 1.0, 1.0),
      new Vector3(0.0, 0.0, 0.0),
      new Vector3(0.0, 0.0, 0.0)
    )

    // Test that exactly 4 objects were returned.
    expect(differentials.length).toBe(4)

    // Test the value of the objects.
    // Note: This test isn't correct yet!!!
    expect(differentials).toStrictEqual([
      new Vector3(NaN, NaN, NaN),
      new Vector3(NaN, NaN, NaN),
      new Vector3(1.0, 1.0, 1.0),
      new Vector3(1.0, 1.0, 1.0),
    ])
  })
})
