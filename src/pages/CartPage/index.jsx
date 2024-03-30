import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Box, Button, Card, CardActions, CardContent, Grid, IconButton, Stack, Typography, useMediaQuery } from "@mui/material";
import Title from "../../components/Title";
import AlertSnackbar from "../../components/AlertSnackbar";

import { CartContext } from "../../contexts/cart";

export default function CartPage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const { cartItems, removeItemFromCart, changeItemQuantity, getCartTotal } = useContext(CartContext);

  const [showAlert, setShowAlert] = useState({show: false});

  useEffect(() => {    
    window.scrollTo(0, 0);       
  }, []);

  const handleRemoveItem = (cartItemId) => {
    removeItemFromCart(cartItemId);
  };

  const handleChangeItemQuantity = (cartItemId, newQuantity) => {
    changeItemQuantity(cartItemId, newQuantity);
  };

  const handleClickCheckoutCart = () => {
    if (cartItems.length === 0) {
      setShowAlert({show: true, message: 'O carrinho está vazio!', severity: 'warning'});
      return
    }
    
    navigate('/cart-checkout');
  };

  const handleClickAddMoreItens = () => {
    navigate('/new-sale');
  };

  return (
    <Container component="main" maxWidth="xbl" height="100%">
      <CssBaseline />        
      <Title><h2 style={{marginBottom: '4px'}}>Carrinho</h2></Title>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          flex: 1,
        }}
      >
        {(cartItems.length === 0) ?
          <>
            <Typography>
              Nenhum item foi adicionado.
            </Typography>
            <Button
              sx={{paddingLeft: '0px', marginTop: '6px'}}
              size="small"
              onClick={() => handleClickAddMoreItens()}
            >Buscar itens</Button>
          </>
        : 
          <div>
            {cartItems.map((item, index) => (
              <Card key={item.cartItemId} style={{ margin: '9px', backgroundColor: "#f4f4f4"}}>
                <CardContent sx={{ padding: '10px'}}>
                  <Typography variant="h6" noWrap style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                    {item.name}
                  </Typography>

                  {(isMobile) &&
                    <Typography variant="body1">
                      {`R$ ${item.price.toFixed(2).replace('.', ',')}`}
                    </Typography>
                  }

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {(!isMobile) &&
                      <Typography variant="body1" marginRight={'64px'}>
                        <span style={{ marginRight: '2px' }}>R$</span>
                        {item.price.toFixed(2).replace('.', ',')}
                      </Typography>
                    }

                    <Grid container spacing={1} alignItems="center" height={'40px'}>
                      <Grid item>
                        <IconButton 
                          size="small"
                          onClick={() => handleChangeItemQuantity(item.cartItemId, Math.max(item.quantity - 1, 1))}
                        >-</IconButton>
                      </Grid>
                      <Grid item>
                        <input 
                          type="number"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => handleChangeItemQuantity(item.cartItemId, Number(e.target.value))}
                          style={{ 
                            height: '30px', width: '70px', textAlign: 'center', 
                            padding: '2px', marginTop: '4px' 
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <IconButton 
                          size="small"
                          onClick={() => handleChangeItemQuantity(item.cartItemId, item.quantity + 1)}
                        >+</IconButton>
                      </Grid>
                    </Grid>
                    <Typography variant="h6" color="blue" style={{ marginLeft: '4px', display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '2px' }}>R$</span>
                      {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </Typography>
                  </div>                  
                </CardContent>
                <CardActions sx={{padding: '2px', paddingLeft: '4px'}}>
                  <Button 
                    size="small"
                    onClick={() => handleRemoveItem(item.cartItemId)}
                  >Excluir</Button>
                </CardActions>
              </Card>
            ))}
            
            <Button
              onClick={() => handleClickAddMoreItens()}
            >Incluir mais itens</Button>

            {isMobile ? (
              <div style={{ position: 'sticky', bottom: 0, background: 'white', zIndex: 1 }}>
                <Box>
                  <div style={{ padding: '9px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle2" style={{ marginBottom: '4px' }}>
                        Total:
                      </Typography>
                      <Typography variant="h6" color="blue">
                        {`R$ ${getCartTotal().toFixed(2).replace('.', ',')}`}
                      </Typography>
                    </div>
                    <div>
                      <Button
                        variant="contained"
                        onClick={() => handleClickCheckoutCart()}
                        sx={{ mt: 1, mx: 1 }}
                      >
                        Finalizar
                      </Button>
                    </div>
                  </div>
                </Box>
              </div>
            ) : (
              <div style={{ position: 'sticky', bottom: 0, background: 'white', zIndex: 1 }}>
                <Box>
                  <div style={{ padding: '9px' }}>
                    <Box            
                      sx={{ marginTop: 2, marginBottom: 2 }}
                    >
                      <Stack spacing={2} direction="row-reverse">
                        <Typography variant="h5" color="blue" style={{ margin: '4px' }}>
                          {`R$ ${getCartTotal().toFixed(2).replace('.', ',')}`}
                        </Typography>
                        <Typography variant="body2" style={{ margin: '4px', marginTop: '8px' }}>
                          Total:
                        </Typography>
                      </Stack>
                      <Stack spacing={2} direction="row-reverse">
                        <Button
                          variant="contained"
                          onClick={() => handleClickCheckoutCart()}
                          sx={{ mt: 1, mx: 1 }}
                        >
                          Finalizar a venda
                        </Button>
                      </Stack>
                    </Box>
                  </div>
                </Box>
              </div>
            )}
          </div>    
        }
      </Box>
      {
        (showAlert.show === true) &&  
        <AlertSnackbar setShowAlert={setShowAlert} show={showAlert.show} message={showAlert.message} severity={showAlert.severity} />
      }
    </Container>
  );
}