import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from "@mui/material/IconButton";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { DataGrid, ptBR } from '@mui/x-data-grid';
import Skeleton from "@mui/material/Skeleton";
import { format } from "date-fns";

import { clearUserData } from "../../commons/authVerify";
import CustomNoRowsOverlay from "../../components/DataGrid/CustomNoRowsOverlay";
import CustomPagination from "../../components/DataGrid/CustomPagination";
// import CustomToolBar from "../../components/DataGrid/CustomToolBar";
import AlertSnackbar from "../../components/AlertSnackbar";
import Title from "../../components/Title";
import { getSales } from "../../services/sale";
import { List, ListItemButton, ListItemText, Typography, useMediaQuery } from "@mui/material";

export default function SalesPage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  const [sales, setSales] = useState([]);
  const [showAlert, setShowAlert] = useState({show: false});
  const [dataGridHeight, setDataGridHeight] = useState(400);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento

  useEffect(() => {    
    window.scrollTo(0, 0);

    const loadSales = async () => {
      const response = await getSales();      
      console.log(response)      
   
      if (response.networkError) {
        clearUserData();
        navigate("/login");
      }

      if (response.status === 500) {
        setShowAlert({show: true, message: response.data.message, severity: 'error'});
        return;
      }

      if (response.status === 200) {
        setSales(response.data.map(sale => ({ ...sale, id: sale._id })));
      };                    
      setIsLoading(false); // Define loading como falso após carregar os dados                    
    };
    loadSales(navigate);

    const calculateDataGridHeight = () => {
      const availableHeight = window.innerHeight - 152; // Ajuste o valor conforme necessário
      setDataGridHeight(availableHeight);
    };

    // Calcula a altura do DataGrid no primeiro carregamento da página
    calculateDataGridHeight();

    // Recalcula a altura do DataGrid quando a janela é redimensionada
    window.addEventListener("resize", calculateDataGridHeight);

    // Remove o event listener ao desmontar o componente
    return () => window.removeEventListener("resize", calculateDataGridHeight);
  }, [navigate]);
  
  const handleClickOpen = async (event, cellValues) => {
    const id = cellValues.row.id;
    navigate(`/sale/${id}`);
  };

  const handleClickAdd = async () => {
    navigate("/new-sale");
  };

  const columns = [
    {
      field: 'edit',
      headerName: '',
      width: 60,
      renderCell: (cellValues) => {      
        return (
          <IconButton
            color="primary"
            onClick={(event) => {
              handleClickOpen(event, cellValues);
            }}
          >
            <EditOutlinedIcon/>
          </IconButton> 
        );
      }
    },
    { field: 'code', headerName: 'Código', width: 90 },
    {  
      field: "date",
      headerName: "Data",
      width: 120,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString("pt-BR");
      }
    },
    {
      field: 'customer',
      headerName: 'Cliente',
      width: 250,
      valueGetter: (params) => params.row.customer.name
    },
    {
      field: "total",
      headerName: "Valor",
      width: 120,
      valueFormatter: (params) => {
        const value = parseFloat(params.value).toFixed(2);
        return `R$ ${value}`;
      },
    },
    {
      field: 'user',
      headerName: 'Vendedor',
      width: 250,
      valueGetter: (params) => params.row.user.name
    },
  ];

  const SalesGrid = () => {
    return (
      <div style={{ width: '100%', height: dataGridHeight }}>
        {isLoading ? ( 
          <Skeleton 
            variant="rectangular" sx={{ bgcolor: "white" }} width="100%" height={dataGridHeight}
          />
        ) : (        
        <DataGrid 
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          position="static"
          rows={sales}
          columns={columns}
          autoPageSize
          pagination
          components={{
            Pagination: CustomPagination,
            NoRowsOverlay: CustomNoRowsOverlay,
            // Toolbar: CustomToolBar
          }}
          hideFooterSelectedRowCount={true}
        />
        )}
      </div>
    );
  };

  const handleItemClick = (item) => {
    const id = item.id;
    navigate(`/sale/${id}`);
  };

  const SalesList = () => {
    return (
      <div 
        style={{ 
          width: '100%', 
          // height: dataGridHeight 
        }}>
        {isLoading ? ( 
          <Skeleton 
            variant="rectangular" sx={{ bgcolor: "white" }} width="100%" 
            // height={dataGridHeight}
          />
        ) : (        
        <List>
          {sales.map((item) => (
            <ListItemButton
              key={item.id}
              onClick={() => handleItemClick(item)}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                marginBottom: "8px",
                padding: "8px",
                backgroundColor: "#f0f0f0"
              }}
            >
              <ListItemText
                primary={`${format(new Date(item.date), 'dd/MM/yyyy')} - ${item.customer.name}`}
                primaryTypographyProps={{ align: 'left' }}
                secondary={
                  <Typography variant="h5" color="primary" align="right">
                    {`R$ ${item.total.toFixed(2)}`}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>
        )}
      </div>
    );
  }

  return (
    <Container component="main" maxWidth="xbl" height="100%">
      <CssBaseline />        
      <Title><h2>Vendas</h2></Title>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          flex: 1,
        }}
      >
        { (isMobile) ? <SalesList/> : <SalesGrid/> }  
      </Box>
      <Fab 
        onClick={() => handleClickAdd()}
        color="secondary" aria-label="add" 
        sx={{
          position: 'fixed',
          bottom: (theme) => theme.spacing(9),
          right: (theme) => theme.spacing(2),
        }}
      >
        <AddIcon />
      </Fab>
      {
        (showAlert.show === true) &&  
        <AlertSnackbar setShowAlert={setShowAlert} show={showAlert.show} message={showAlert.message} severity={showAlert.severity} />
      }
    </Container>
  );
}