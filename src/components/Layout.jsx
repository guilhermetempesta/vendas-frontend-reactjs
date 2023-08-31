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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ViewInArTwoToneIcon from '@mui/icons-material/ViewInArTwoTone';
import FeedTwoToneIcon from '@mui/icons-material/FeedTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import { Badge, Menu, MenuItem } from '@mui/material';

// import Footer from './Footer';
import { AuthContext } from "../contexts/auth";
import { CartContext } from '../contexts/cart';

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
    text: 'Venda',
    path: '/new-sale',
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
    text: 'Venda',
    path: '/new-sale',
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
  const { cartItems, clearCart } = useContext(CartContext);

  const theme = useTheme();
  const [open, setOpen] = useState(matches);
  const [selectedItem, setSelectedItem] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);
  const isCartMenuOpen = Boolean(anchorEl);

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

  const handleCartMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCartMenuClose = () => {
    setAnchorEl(null);
  };

  const getNumberItemsInCart = () => {
    const numItems = cartItems.length;
    return (numItems > 0) ? `${numItems} item(s) incluídos` : 'Nenhum item';
  };

  const calculateTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleClickShowCart = () => {
    handleCartMenuClose();
    navigate(`/cart`);
  };

  const handleClickClearCart = () => {
    handleCartMenuClose();
    clearCart();
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
                      element.imageIndex === 3 ? <AddShoppingCartIcon/> : (
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

  const renderCartMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={'cart-menu'}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isCartMenuOpen}
      onClose={handleCartMenuClose}
    >
      {/* Div com informações adicionais */}
      <div style={{ padding: '16px', borderBottom: '1px solid #ccc' }}>
        <Typography variant="body1">{getNumberItemsInCart()}</Typography>
        <Typography variant="h6" color="blue">R$ {calculateTotalCartItems().toFixed(2)}</Typography>
      </div>      
      <MenuItem onClick={handleClickShowCart}>Exibir</MenuItem>
      <MenuItem onClick={handleClickClearCart}>Limpar</MenuItem>
    </Menu>
  );


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
          <Box >
            <IconButton 
              size="large" 
              aria-label="menu cart"
              aria-haspopup="true"
              onClick={handleCartMenuOpen} 
              color="inherit">
              <Badge 
                badgeContent={cartItems.length} 
                color="error"
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              color="inherit"
              aria-label="account of current user"
              edge="end"
              onClick={(event) => { handleClickProfile(event) }}
            >
              <Badge badgeContent={0} color="error">
                <PersonIcon />
              </Badge>
            </IconButton>
          </Box>
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
      {renderCartMenu}     
    </Box>
  );
}

