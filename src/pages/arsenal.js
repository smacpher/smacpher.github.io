import { GiphyFetch } from "@giphy/js-fetch-api"
import { Gif } from "@giphy/react-components"
import React, { useEffect, useState } from "react"
import Layout from "../components/layout"

async function fetchRandomArsenalGif() {
  // TODO(smacpher): Template this in as an environment variable.
  const giphyFetch = new GiphyFetch("R7cDO5GMntuxh6T5QIduELpIEJODMVwV")

  // Generate some random offset since Giphy doesn't randomize results automatically.
  // Search for Arsenal gifs, limiting to just one result.
  const { data: gif } = await giphyFetch.random({
    tag: "arsenal",
    type: "gifs",
    rating: "pg",
  })

  return gif
}

export default function Arsenal() {
  // Setup state to hold random Arsenal gif.
  const [gif, setGif] = useState(null)

  // Fetch a random Arsenal `gif`.
  useEffect(() => {
    async function _setGif() {
      setGif(await fetchRandomArsenalGif())
    }

    _setGif()
  }, [])

  return (
    <Layout>
      <div className="center">
        {gif != null ? <Gif gif={gif} width={300} /> : <p>Loading...</p>}
      </div>
    </Layout>
  )
}
