import {useEffect} from 'react';
import type {FC} from 'react';
import type {NextPage} from 'next';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import {Toaster} from 'react-hot-toast';
import {Provider as ReduxProvider} from 'react-redux';
import nProgress from 'nprogress';
import {CacheProvider} from '@emotion/react';
import type {EmotionCache} from '@emotion/cache';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {LocalizationProvider} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {RTL} from '../components/rtl';
import {SettingsButton} from '../components/settings-button';
import {SplashScreen} from '../components/splash-screen';
import {SettingsConsumer, SettingsProvider} from '../contexts/settings-context';
import {AuthConsumer, AuthProvider} from '../contexts/jwt-context';
import {gtmConfig} from '../config';
import {gtm} from '../lib/gtm';
import {store} from '../store';
import {createTheme} from '../theme';
import {createEmotionCache} from '../utils/create-emotion-cache';
import '../i18n';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  DefaultOptions
} from "@apollo/client";
import {setContext} from '@apollo/client/link/context';
import {NODE_ENV} from "../utils/NODE_ENV";

type EnhancedAppProps = AppProps & {
  Component: NextPage;
  emotionCache: EmotionCache;
}

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

const clientSideEmotionCache = createEmotionCache();

const httpLink = createHttpLink({
  uri: NODE_ENV === 'development' ? 'http://localhost:4444/graphql' : '/graphql',
});

const authLink = setContext((_, {headers}) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('accessToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}



const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    resultCaching: false
  }),
  defaultOptions: defaultOptions,
});

const App: FC<EnhancedAppProps> = (props) => {
  const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    gtm.initialize(gtmConfig);
  }, []);

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <ApolloProvider client={client}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>
            Material Kit Pro
          </title>
          <meta
            name="viewport"
            content="initial-scale=1, width=device-width"
          />
        </Head>
        <ReduxProvider store={store}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <AuthProvider>
              <SettingsProvider>
                <SettingsConsumer>
                  {({settings}) => (
                    <ThemeProvider
                      theme={createTheme({
                        direction: settings.direction,
                        responsiveFontSizes: settings.responsiveFontSizes,
                        mode: settings.theme
                      })}
                    >
                      <RTL direction={settings.direction}>
                        <CssBaseline />
                        <Toaster position="top-center" />
                        <SettingsButton />
                        <AuthConsumer>
                          {
                            (auth) => !auth.isInitialized
                              ? <SplashScreen />
                              // @ts-ignore
                              : getLayout(<Component {...pageProps} />)
                          }
                        </AuthConsumer>
                      </RTL>
                    </ThemeProvider>
                  )}
                </SettingsConsumer>
              </SettingsProvider>
            </AuthProvider>
          </LocalizationProvider>
        </ReduxProvider>
      </CacheProvider>
    </ApolloProvider>
  );
};

export default App;
