import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Box, Button, Card, CardActions, CardContent, Grid, IconButton, Typography, useMediaQuery } from "@mui/material";
import Title from "../../components/Title";
import AlertSnackbar from "../../components/AlertSnackbar";

import { CartContext } from "../../contexts/cart";

export default function CartPage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const { cartItems, removeItemFromCart, changeItemQuantity } = useContext(CartContext);

  const [showAlert, setShowAlert] = useState({show: false});
  const [sale, setSale] = useState({
    date: new Date(),
    customer: '',
    subtotal: 0,
    discount: 0,
    addition: 0,
    total: 0,
    item: []
  });
  const [saleItem, setSaleItem] = useState([]);
  
  useEffect(() => {    
    window.scrollTo(0, 0);       
  }, []);

  // const handleChangeItemQuantity = (cartItemId, newQuantity) => {
  //   const updatedCartItems = cartItems.map(item => {
  //     if (item.cartItemId === cartItemId) {
  //       return { ...item, quantity: newQuantity };
  //     }
  //     return item;
  //   });
  //   setCartItems(updatedCartItems);
  // };

  const handleRemoveItem = (cartItemId) => {
    removeItemFromCart(cartItemId);
  };

  const handleChangeItemQuantity = (cartItemId, newQuantity) => {
    changeItemQuantity(cartItemId, newQuantity);
  };

  return (
    <Container component="main" maxWidth="xbl" height="100%">
      <CssBaseline />        
      <Title><h2>Carrinho</h2></Title>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          flex: 1,
        }}
      >
        {(cartItems.length === 0) ?
          <Typography>
            Nenhum item foi adicionado.
          </Typography>
        : cartItems.map((item, index) => (
          <Card key={item.cartItemId} style={{ margin: '16px', backgroundColor: "#f4f4f4"}}>
            <CardContent>
              <Typography variant="h6">{item.name}</Typography>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1">{`R$ ${item.price.toFixed(2)}`}</Typography>
                </div>
              </div>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <IconButton 
                    onClick={() => handleChangeItemQuantity(item.cartItemId, Math.max(item.quantity - 1, 1))}
                  >-</IconButton>
                </Grid>
                <Grid item>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => handleChangeItemQuantity(item.cartItemId, Number(e.target.value))}
                    style={{ width: '50px', textAlign: 'center' }}
                  />
                </Grid>
                <Grid item>
                  <IconButton 
                    onClick={() => handleChangeItemQuantity(item.cartItemId, item.quantity + 1)}
                  >+</IconButton>
                </Grid>
              </Grid>
              {/* Calcula e exibe o total do item */}
              <Typography variant="h6" color="blue">
                {`Total: R$ ${(item.price * item.quantity).toFixed(2)}`}
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small"
                onClick={() => handleRemoveItem(item.cartItemId)}
              >Excluir</Button>
            </CardActions>
          </Card>
        ))}
      </Box>
      {
        (showAlert.show === true) &&  
        <AlertSnackbar setShowAlert={setShowAlert} show={showAlert.show} message={showAlert.message} severity={showAlert.severity} />
      }
    </Container>
  );
}