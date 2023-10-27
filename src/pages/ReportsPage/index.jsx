import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AlertSnackbar from "../../components/AlertSnackbar";
import Title from "../../components/Title";
import { useNavigate } from "react-router-dom";

const reports = [
  {
    title: "Vendas",
    route: "/reports/sales",
    description: "Lista as vendas realizadas em um período.",
  },{
    title: "Vendas por item",
    route: "/reports/salesbyitem",
    description: "Lista os itens vendidos, totalizando por valor e quantidade.",
  },{
    title: "Resumo de vendas mensais",
    route: "/reports/salesbymonth",
    description: "Totaliza as vendas por mês.",
  },{
    title: "Vendas canceladas",
    route: "/reports/canceledsales",
    description: "Lista as vendas canceladas.",
  },{
    title: "Comissões",
    route: "/reports/comission",
    description: "Calcula o valor comissões dos vendedores.",
  },{
    title: "Lucros",
    route: "/reports/result",
    description: "Exibe os lucros e resultados em um período.",
  },
];

export default function ReportsPage(props) {
  const { message } = props;
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState({ show: false });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (message) {
      setShowAlert({ show: true, message: message, severity: "warning" });
    }
  }, [message]);

  const handleReportClick = (route) => {
    navigate(route);
  };

  return (
    <Container component="main" maxWidth="xl">
      <CssBaseline />
      <Title>
        <h2>Relatórios</h2>
      </Title>
      <Grid container spacing={2}>
        {reports.map((report, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              style={{display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#f4f4f4"}}>
              <CardContent style={{ flexGrow: 1 }}>
                <div>
                  <Typography variant="h5" component="div">
                    {report.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{marginTop: '5px'}}>
                    {report.description}
                  </Typography>
                </div>
              </CardContent>
              <Button
                onClick={() => handleReportClick(report.route)}
                variant="contained"
                color="primary"
                sx={{
                  "&:hover": {
                    backgroundColor: "#1976D2", // Cor de fundo no hover
                  },
                }}
              >
                Exibir
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
      {showAlert.show === true && (
        <AlertSnackbar
          setShowAlert={setShowAlert}
          show={showAlert.show}
          message={showAlert.message}
          severity={showAlert.severity}
        />
      )}
    </Container>
  );
}
