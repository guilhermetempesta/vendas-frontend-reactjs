import React, { useEffect } from "react";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import SalesByMonthTable from "../../../components/Reports/SalesByMonthTable";

export default function SalesSummaryReportPage() {
  
  useEffect(() => {    
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Container component="main" maxWidth="xbl" height="100%">
      <CssBaseline />        
      <SalesByMonthTable/>
    </Container>
  );
}