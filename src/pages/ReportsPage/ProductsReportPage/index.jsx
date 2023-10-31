import React, { useEffect } from "react";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import ProductTable from "../../../components/Reports/ProductTable";

export default function ProductReportPage() {
  
  useEffect(() => {    
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Container component="main" maxWidth="xbl" height="100%">
      <CssBaseline />        
      <ProductTable/>
    </Container>
  );
}