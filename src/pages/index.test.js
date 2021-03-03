import Home from "./index.js"
import React from "react"
import renderer from "react-test-renderer"

describe("Home", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Home />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
