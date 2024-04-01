import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import AlertSnackbar from "../../components/AlertSnackbar";
import Title from "../../components/Title";
import { Grid, Paper } from "@mui/material";
import SalesChartLast30Days from "../../components/Dashboard/SalesChartLast30Days";
import CurrentMonthSales from "../../components/Dashboard/CurrentMonthSales";
import LastSalesTable from "../../components/Dashboard/LastSalesTable";
import MonthlySalesChart from "../../components/Dashboard/MonthlySalesChart";
import SalesBySeller from "../../components/Dashboard/SalesBySeller";

export default function HomePage (props) {
  const { message } = props;
  const { user } = useContext(AuthContext);
  const [ showAlert, setShowAlert ] = useState({show: false});

  useEffect(() => {    
    window.scrollTo(0, 0);
    if (message) {
      setShowAlert({show:true, message: message, severity: 'warning'})
    }
  }, [message]);
  
  return (
    <Container component="main" maxWidth="xl">
      <CssBaseline />        
      <Title>{(user.role === 'user')? <h2>Início</h2> : <h2>Dashboard</h2>}</Title>
      {(user.role === 'user') ?
        <>
          <Box>
            <p>Olá, {user.name}!</p>
          </Box>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <SalesChartLast30Days />
                </Paper>
              </Grid>              
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <CurrentMonthSales />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </>      
        :
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 240,
                }}
              >
                <SalesChartLast30Days />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 240,
                }}
              >
                <CurrentMonthSales />
              </Paper>
            </Grid>
            <Grid item xs={12} >
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <LastSalesTable />
              </Paper>
            </Grid>
            <Grid item xs={12} md={8} lg={9}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 240,
                }}
              >
                <MonthlySalesChart />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 240,
                  paddingTop: '15px',
                  paddingBottom: '3px',
                }}
              >
                <SalesBySeller />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      }
      {
        (showAlert.show === true) &&  
        <AlertSnackbar setShowAlert={setShowAlert} show={showAlert.show} message={showAlert.message} severity={showAlert.severity} />
      }
    </Container>
  )
};