import type { AppProps } from 'next/app';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import GlobalStyle from '../components/globalstyles';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Layout from '../components/Layout';
import ShoppingCartProvider from '../context/ShoppingCartContext';
config.autoAddCss = false;

const theme: DefaultTheme = {
  colors: {
    primary: '#f37f01',
    secundary: '#777'
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <ShoppingCartProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ShoppingCartProvider>
        <GlobalStyle />
      </ThemeProvider>
    </>
  )
}