import type {FC} from 'react';
import {ReactNode, useEffect, useMemo, useRef, useState} from 'react';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import PropTypes from 'prop-types';
import type {TFunction} from 'react-i18next';
import {useTranslation} from 'react-i18next';
import type {Theme} from '@mui/material';
import {Box, Button, Divider, Drawer, Typography, useMediaQuery} from '@mui/material';
import {Selector as SelectorIcon} from '../../icons/selector';
import {ShoppingBag as ShoppingBagIcon} from '../../icons/shopping-bag';
import {Logo} from '../logo';
import {Scrollbar} from '../scrollbar';
import {DashboardSidebarSection} from './dashboard-sidebar-section';
import {OrganizationPopover} from './organization-popover';

interface DashboardSidebarProps {
  onClose?: () => void;
  open?: boolean;
}

interface Item {
  title: string;
  children?: Item[];
  chip?: ReactNode;
  icon?: ReactNode;
  path?: string;
}

interface Section {
  title: string;
  items: Item[];
}

const getSections = (t: TFunction): Section[] => [

  {
    title: t('Management'),
    items: [
      {
        title: t('专区'),
        path: '/dashboard/zones',
        icon: <ShoppingBagIcon fontSize="small" />,
        children: [
          {
            title: t('专区列表'),
            path: '/dashboard/zones'
          },
          {
            title: t('创建专区'),
            path: '/dashboard/zones/new'
          }
        ]
      },
      {
        title: t('视频'),
        path: '/dashboard/videos',
        icon: <ShoppingBagIcon fontSize="small" />,
        children: [
          {
            title: t('视频列表'),
            path: '/dashboard/videos'
          },
          {
            title: t('创建新视频'),
            path: '/dashboard/videos/new'
          }
        ]
      },
      {
        title: t('充值'),
        path: '/dashboard/recharges',
        icon: <ShoppingBagIcon fontSize="small" />,
        children: [
          {
            title: t('充值列表'),
            path: '/dashboard/recharges'
          },
        ]
      },
      {
        title: t('提现'),
        path: '/dashboard/withdrawals',
        icon: <ShoppingBagIcon fontSize="small" />,
        children: [
          {
            title: t('提现列表'),
            path: '/dashboard/withdrawals'
          },
        ]
      },
    ]
  },
];

export const DashboardSidebar: FC<DashboardSidebarProps> = (props) => {
  const {onClose, open} = props;
  const router = useRouter();
  const {t} = useTranslation();
  const lgUp = useMediaQuery(
    (theme: Theme) => theme.breakpoints.up('lg'),
    {
      noSsr: true
    }
  );
  const sections = useMemo(() => getSections(t), [t]);
  const organizationsRef = useRef<HTMLButtonElement | null>(null);
  const [openOrganizationsPopover, setOpenOrganizationsPopover] = useState<boolean>(false);

  const handlePathChange = () => {
    if (!router.isReady) {
      return;
    }

    if (open) {
      onClose?.();
    }
  };

  useEffect(
    handlePathChange,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady, router.asPath]
  );

  const handleOpenOrganizationsPopover = (): void => {
    setOpenOrganizationsPopover(true);
  };

  const handleCloseOrganizationsPopover = (): void => {
    setOpenOrganizationsPopover(false);
  };

  const content = (
    <>
      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': {
            height: '100%'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <div>
            <Box sx={{p: 3}}>
              <NextLink
                href="/"
                passHref
              >
                <a>
                  <Logo
                    sx={{
                      height: 42,
                      width: 42
                    }}
                  />
                </a>
              </NextLink>
            </Box>
            <Box sx={{px: 2}}>
              <Box
                onClick={handleOpenOrganizationsPopover}
                ref={organizationsRef}
                sx={{
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  px: 3,
                  py: '11px',
                  borderRadius: 1
                }}
              >
                <div>
                  <Typography
                    color="inherit"
                    variant="subtitle1"
                  >
                    Acme Inc
                  </Typography>
                  <Typography
                    color="neutral.400"
                    variant="body2"
                  >
                    {t('Your tier')}
                    {' '}
                    : Premium
                  </Typography>
                </div>
                <SelectorIcon
                  sx={{
                    color: 'neutral.500',
                    width: 14,
                    height: 14
                  }}
                />
              </Box>
            </Box>
          </div>
          <Divider
            sx={{
              borderColor: '#2D3748', // dark divider
              my: 3
            }}
          />
          <Box sx={{flexGrow: 1}}>
            {sections.map((section) => (
              <DashboardSidebarSection
                key={section.title}
                path={router.asPath}
                sx={{
                  mt: 2,
                  '& + &': {
                    mt: 2
                  }
                }}
                {...section}
              />
            ))}
          </Box>
          <Divider
            sx={{
              borderColor: '#2D3748'  // dark divider
            }}
          />
          <Box sx={{p: 2}}>
            <Typography
              color="neutral.100"
              variant="subtitle2"
            >
              {t('Need Help?')}
            </Typography>
            <Typography
              color="neutral.500"
              variant="body2"
            >
              {t('Check our docs')}
            </Typography>
            <NextLink
              href="/docs/welcome"
              passHref
            >
              <Button
                color="secondary"
                component="a"
                fullWidth
                sx={{mt: 2}}
                variant="contained"
              >
                {t('Documentation')}
              </Button>
            </NextLink>
          </Box>
        </Box>
      </Scrollbar>
      <OrganizationPopover
        anchorEl={organizationsRef.current}
        onClose={handleCloseOrganizationsPopover}
        open={openOrganizationsPopover}
      />
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            borderRightColor: 'divider',
            borderRightStyle: 'solid',
            borderRightWidth: (theme) => theme.palette.mode === 'dark' ? 1 : 0,
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{zIndex: (theme) => theme.zIndex.appBar + 100}}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
