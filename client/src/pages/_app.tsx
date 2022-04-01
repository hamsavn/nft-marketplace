import type { AppProps } from 'next/app';
import { createGlobalStyle } from 'styled-components';
import Header from '@components/menu/Header';
import ScrollToTopBtn from '@components/menu/ScrollToTop';
import { Footer } from '@components/Footer';
import { ClientWrapper } from '@lib/client-wrapper';
import { ToastContainer, Slide } from 'react-toastify';

import '../../assets/animated.css';
import '../../node_modules/font-awesome/css/font-awesome.min.css';
import '../../node_modules/elegant-icons/style.css';
import '../../node_modules/et-line/style.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../assets/style.scss';
import '../../assets/style_grey.scss';
import 'react-toastify/dist/ReactToastify.css';

import { Provider } from 'react-redux';
import { store } from 'store';

import { LoadingBar } from '@components/loading-bar';

const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ClientWrapper>
        <LoadingBar />
        <GlobalStyles />
        <Header />
        <Component {...pageProps} />
        <ScrollToTopBtn />
        <Footer />
        <ToastContainer hideProgressBar autoClose={3000} transition={Slide} />
      </ClientWrapper>
    </Provider>
  );
}

export default MyApp;
