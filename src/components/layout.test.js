import Layout from "./layout.js"
import React from "react"
import renderer from "react-test-renderer"

describe("Layout", () => {
  test("renders correctly", () => {
    const tree = renderer.create(<Layout />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
