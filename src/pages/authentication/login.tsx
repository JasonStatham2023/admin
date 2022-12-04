import {useEffect} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import {Box, Button, Card, Container, Divider, Link, Typography} from '@mui/material';
import {GuestGuard} from '../../components/authentication/guest-guard';
import {AuthBanner} from '../../components/authentication/auth-banner';
import {JWTLogin} from '../../components/authentication/jwt-login';
import {Logo} from '../../components/logo';
import {gtm} from '../../lib/gtm';

type Platform = 'Amplify' | 'Auth0' | 'Firebase' | 'JWT';

const platformIcons: { [key in Platform]: string; } = {
  Amplify: '/static/icons/amplify.svg',
  Auth0: '/static/icons/auth0.svg',
  Firebase: '/static/icons/firebase.svg',
  JWT: '/static/icons/jwt.svg'
};




const Login: NextPage = () => {
  useEffect(() => {
    gtm.push({event: 'page_view'});
  }, []);

  return (
    <>
      <Head>
        <title>
          Login | Material Kit Pro
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <AuthBanner />
        <Container
          maxWidth="sm"
          sx={{
            py: {
              xs: '60px',
              md: '120px'
            }
          }}
        >
          <Card
            elevation={16}
            sx={{p: 4}}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <NextLink
                href="/"
                passHref
              >
                <a>
                  <Logo
                    sx={{
                      height: 40,
                      width: 40
                    }}
                  />
                </a>
              </NextLink>
              <Typography variant="h4">
                登录
              </Typography>
              <Typography
                color="textSecondary"
                sx={{mt: 2}}
                variant="body2"
              >
                欢迎登录后台
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3
              }}
            >
              <JWTLogin />
            </Box>
          </Card>
        </Container>
      </Box>
    </>
  );
};

Login.getLayout = (page) => (
  <GuestGuard>
    {page}
  </GuestGuard>
);

export default Login;
