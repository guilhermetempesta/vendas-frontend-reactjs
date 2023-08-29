import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import PeopleTwoToneIcon from '@mui/icons-material/PeopleTwoTone';
import BuildIcon from '@mui/icons-material/Build';
import ArticleIcon from '@mui/icons-material/Article';
import ButtonBase from '@mui/material/ButtonBase';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import ViewInArTwoToneIcon from '@mui/icons-material/ViewInArTwoTone';
import FeedTwoToneIcon from '@mui/icons-material/FeedTwoTone';

// import Footer from './Footer';
import { AuthContext } from "../contexts/auth";
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden'
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const menuItemsAdmin = [
  {
    text: 'Início',
    path: '/',
    imageIndex: 0
  },{
    text: 'Produtos',
    path: '/products',
    imageIndex: 1
  },{
    text: 'Clientes',
    path: '/customers',
    imageIndex: 2
  },{
    text: 'Vendas',
    path: '/sales',
    imageIndex: 3
  },{
    text: 'Relatórios',
    path: '/reports',
    imageIndex: 4
  },{
    text: 'Usuários',
    path: '/users',
    imageIndex: 5
  }
]

const menuItemsUser = [
  {
    text: 'Início',
    path: '/',
    imageIndex: 0
  },{
    text: 'Produtos',
    path: '/products',
    imageIndex: 1
  },{
    text: 'Clientes',
    path: '/customers',
    imageIndex: 2
  },{
    text: 'Vendas',
    path: '/sales',
    imageIndex: 3
  }
]

const menuItemsCommom = [
  // {
  //   text: 'Test 1',
  //   path: '/test1',
  //   imageIndex: 4
  // },{
  //   text: 'Test 2',
  //   path: '/test2',
  //   imageIndex: 4
  // }
]

export default function Layout({children}) {
  const navigate = useNavigate();
  const matches = useMediaQuery('(min-width:600px)');
  const { logout, user } = useContext(AuthContext);

  const theme = useTheme();
  const [open, setOpen] = useState(matches);
  const [selectedItem, setSelectedItem] = useState('');

  useEffect (() => {
    setOpen(matches);
  }, [matches]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleListItemClick = (event, item) => {
    setSelectedItem(item);
    if (!matches) {
      handleDrawerClose()
    }
  };

  const handleClickProfile = (event) => {
    navigate(`/profile`);
  };

  const handleLogout = (event) => {
    logout();
  };

  function MenuItems() {
    let list;
    
    if (user.role==='admin') { list = menuItemsAdmin } 
    else { list = menuItemsUser };
    
    return (
      <List>
        {list.map((element, index) => (             
          <ListItemButton
            selected={selectedItem === element.path}
            onClick={(event) => handleListItemClick(event, element.path)}
            component={Link}
            to={element.path}
            key={element.text}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              {
                element.imageIndex === 0 ? <HomeTwoToneIcon/> : (
                  element.imageIndex === 1 ? <ViewInArTwoToneIcon/> : (
                    element.imageIndex === 2 ? <PeopleTwoToneIcon/> : ( 
                      element.imageIndex === 3 ? <ShoppingCartTwoToneIcon/> : (
                        element.imageIndex === 4 ? <FeedTwoToneIcon/> : (
                          element.imageIndex === 5 ? <PeopleAltTwoToneIcon/> : <BuildIcon/>
                        )
                      )
                    )
                  )
                )
              }
            </ListItemIcon>
            <ListItemText primary={element.text} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        ))
        }
        <Divider />
        {menuItemsCommom.map((element, index) => (
          <ListItemButton
            selected={selectedItem === element.path}
            onClick={(event) => handleListItemClick(event, element.path)}
            component={Link}
            to={element.path}
            key={element.text}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <ArticleIcon/>
            </ListItemIcon>
            <ListItemText primary={element.text} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        ))}
        <Divider />
        <ListItemButton
          onClick={(event) => handleLogout(event)}
          key="Sair"
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            <LogoutIcon/>
          </ListItemIcon>
          <ListItemText primary="Sair" sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </List>
    )      
  }; 


  return (
    <Box
      sx={{ 
        display: (matches) ? 'flex' : 'flexbox'
      }}
    >   
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar 
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" flexGrow="1">
            Disk Embalagens
          </Typography>
          <Avatar
            component={ButtonBase}
            onClick={(event) => { handleClickProfile(event) }}
            sx={{ 
              bgcolor: "rgb(235,235,235)",
              color: 'rgb(25,118,210)' 
            }}
          >
            <PersonIcon sx={{ fontSize: 30 }}/>
          </Avatar>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <MenuItems />
      </Drawer>
      <Box 
        component="main"
        onClick={(!matches) ? handleDrawerClose : null}
        sx={{ 
          flexGrow: 1, 
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          padding: 0,
          paddingLeft: matches ? '0' : '65px' 
        }}
      >
        <DrawerHeader />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {children}
        </Box>  
        {/* <Footer/> */}
      </Box>     
    </Box>
  );
}

