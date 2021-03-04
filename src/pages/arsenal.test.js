import Arsenal from "./arsenal.js"
import React from "react"
import renderer from "react-test-renderer"

describe("Arsenal", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Arsenal />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
