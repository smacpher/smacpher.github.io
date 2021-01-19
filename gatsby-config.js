module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
        omitGoogleFont: true,
      },
    },
    {
      resolve: `gatsby-plugin-typescript`,
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [`G-VKB3HGM2PQ`],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Sean MacPherson`,
        short_name: `SM`,
        start_url: `/`,
        background_color: `#FCF8E8`,
        theme_color: `#FCF8E8`,
        display: `standalone`,
        icon: `src/images/favicon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-react-helmet`,
    },
    {
      resolve: `gatsby-plugin-offline`,
    },
  ],
}
