import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/style.css";
import Layout from "../components/Layout";
import { appWithTranslation } from "next-i18next";

function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <title>Echo Photos</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="apple-itunes-app"
          content="app-id=1499073049, app-clip-bundle-id=LVS4T6PPZ4.ch.echolabs.echo.Clip, app-clip-display=card"
        />
        <meta name="description" content="Supreme Photo sharing" />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}

export default appWithTranslation(App);
