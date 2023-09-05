import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import AlertSnackbar from "../../components/AlertSnackbar";
import Title from "../../components/Title";

import { CartContext } from "../../contexts/cart";
import { addSale } from "../../services/sale";
import { Button, Stack } from "@mui/material";

export default function HomePage (props) {
  const { message } = props;
  const navigate = useNavigate();
  const { clearCart, cartItems, getCartTotal } = useContext(CartContext);
  
  const [ showAlert, setShowAlert ] = useState({show: false});

  useEffect(() => {    
    window.scrollTo(0, 0);
    if (message) {
      setShowAlert({show:true, message: message, severity: 'warning'})
    }
  }, [message]);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    console.log('cartItems', cartItems);

    let saleItems = [];
    cartItems.forEach(element => {
      const item = {};
      item.product = element.id;
      item.quantity = element.quantity;
      item.unitPrice = element.price;
      item.discount = 0;
      item.addition = 0;
      item.totalPrice = element.quantity * element.price;
      saleItems.push(item);
    });

    const subTotal = getCartTotal();

    const sale = {
      customer: "64b5e9af8ae1773cb43da6dd",
      date: new Date(),
      subtotal: subTotal,
      discount: 0.00,
      addition: 0.00,
      total: subTotal,
      items: saleItems
    };
 
    console.log(sale);
    
    const statusSuccess = [200, 201, 204]; 
    const statusWarning = [400, 403, 405];
    
    const response = await addSale(sale);
    
    if (statusSuccess.includes(response.status)) {      
      setShowAlert({show: true, message: 'Venda realizada com sucesso.', severity: 'success'});      
      setTimeout(() => {
        clearCart();
        navigate('/');
      }, 2000);
      return;  
    } 

    if (statusWarning.includes(response.status)) {
      setShowAlert({show: true, message: response.data.message, severity: 'warning'});
      return;
    }
    
    if (response.status===500) {
      setShowAlert({show: true, message: response.data.message, severity: 'error'});
      return;
    }
  };

  const handleReturnToCart = () => {
    navigate("/cart");
  };

  return (
    <Container component="main" maxWidth="xl">
      <CssBaseline />        
      <Title><h2>Finalizar Venda</h2></Title>
      <Box>
        <p>{`Subtotal: ${getCartTotal().toFixed(2).replace('.',',')}`}</p>
        <p>Desconto: 0,00</p>
        <p>Acréscimo: 0.00</p>
        <p>{`Total: ${getCartTotal().toFixed(2).replace('.',',')}`}</p>

        <Box            
          sx={{ marginTop: 2, marginBottom: 2 }}
        >
          <Stack spacing={2} direction="row-reverse">
            <Button 
              onClick={ handleSubmit }
              variant="contained" 
              style={{minWidth: '100px'}}            
            >
              Concluir
            </Button>
            <Button 
              onClick={ handleReturnToCart }
              variant="outlined"
              style={{minWidth: '100px'}}
            >
              Voltar
            </Button>
          </Stack>        
        </Box>
      </Box>
      {
        (showAlert.show === true) &&  
        <AlertSnackbar setShowAlert={setShowAlert} show={showAlert.show} message={showAlert.message} severity={showAlert.severity} />
      }
    </Container>
  )
};