import Head from "next/head";

export default function Seo() {
  return (
    <Head>
      <title>Shopee Product Scraper</title>
      <meta name='description' content='Shopee Product Scraper' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='theme-color' content='#000000' />
      <link rel='manifest' href='/manifest.json' />
      <link rel='apple-touch-icon' href='/logo192.png' />
      <link rel='shortcut icon' href='/favicon.ico' />

      <meta property='og:title' content='Shopee Product Scraper' />
      <meta property='og:description' content='Shopee Product Scraper' />
      <meta property='og:image' content='/logo192.png' />
      <meta
        property='og:url'
        content='https://shopee-product-scraper.vercel.app/'
      />
      <meta property='og:type' content='website' />
      <meta property='og:site_name' content='Shopee Product Scraper' />
      <meta property='og:locale' content='id_ID' />

      <meta name='twitter:card' content='summary' />
      <meta name='twitter:site' content='@hadzamis' />
      <meta name='twitter:creator' content='@hadzamis' />
      <meta name='twitter:title' content='Shopee Product Scraper' />
      <meta name='twitter:description' content='Shopee Product Scraper' />
    </Head>
  );
}
