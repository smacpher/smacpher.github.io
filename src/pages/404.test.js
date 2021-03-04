import NotFound from "./404.js"
import React from "react"
import renderer from "react-test-renderer"

describe("NotFound", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<NotFound />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
