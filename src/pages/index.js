import Layout from "../components/layout"
import React from "react"

export default function Home() {
  return (
    <Layout>
      <div className="center">
        <div>
          <h1>Hi, I'm Sean.</h1>
        </div>
        <div>
          <p>
            I’m passionate about using technology for good. I’m primarily
            interested in clean energy and health. I’m also deeply curious about
            the brain and understanding how to destigmatize and treat mental
            health disorders. Currently, I’m honing my math, engineering, and
            product chops at <a href="https://www.myst.ai">Myst AI</a> working
            at the intersection of technology and clean energy.
          </p>
        </div>
      </div>
    </Layout>
  )
}
