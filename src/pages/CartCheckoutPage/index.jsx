import React from "react";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import CheckoutStepper from "../../components/CheckoutStepper";

export default function CartCheckoutPage () { 
  return (
    <Container component="main" maxWidth="xl">
      <CssBaseline />        
      <CheckoutStepper/>
    </Container>
  )
};