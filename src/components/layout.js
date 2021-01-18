import React from "react"
import Helmet from "react-helmet"

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Sean MacPherson</title>
        <meta name="description" content="Hi, I'm Sean."></meta>
        <link rel="canonical" href="https://www.seanmacpherson.com" />
        <html lang="en" />
      </Helmet>
      {children}
    </div>
  )
}
