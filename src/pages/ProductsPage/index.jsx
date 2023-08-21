import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import IconButton from "@mui/material/IconButton";
import { DataGrid, ptBR } from '@mui/x-data-grid';

import { clearUserData } from "../../commons/authVerify";
import CustomNoRowsOverlay from "../../components/DataGrid/CustomNoRowsOverlay";
import CustomPagination from "../../components/DataGrid/CustomPagination";
import CustomToolBar from "../../components/DataGrid/CustomToolBar";
import AlertSnackbar from "../../components/AlertSnackbar";
import Title from "../../components/Title";
import { Skeleton, useMediaQuery } from "@mui/material";
import { getProducts } from "../../services/product";

export default function ProductsPage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  const [products, setProducts] = useState([]);
  const [showAlert, setShowAlert] = useState({show: false});
  const [dataGridHeight, setDataGridHeight] = useState(400);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento

  useEffect(() => {    
    window.scrollTo(0, 0);
    
    const loadProducts = async () => {
      const response = await getProducts();
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
        setShowAlert({show: false, message: response.data.message, severity: 'success'});
        setProducts(response.data.map(product => ({ ...product, id: product._id })));
      };
      setIsLoading(false); // Define loading como falso após carregar os dados                    
    };
    loadProducts(navigate);

    const calculateDataGridHeight = () => {
      const availableHeight = window.innerHeight - 225; // Ajuste o valor conforme necessário
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
    navigate(`/product/${id}`);
  };

  const handleClickAdd = async () => { 
    navigate("/new-product");
  };

  const columns = isMobile
  ? [
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
    { field: 'name', headerName: 'Produto', width: 250 }
  ]
  : [
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
    { field: 'name', headerName: 'Produto', width: 300 },
    { 
      field: 'price', 
      headerName: 'Preço', 
      width: 150,
      valueGetter: (params) => {
        const price = parseFloat(params.row.price).toLocaleString('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        });
        return price;
      } 
    },
    { 
      field: 'cost', 
      headerName: 'Custo', 
      width: 150,
      valueGetter: (params) => {
        const cost = parseFloat(params.row.cost).toLocaleString('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        });
        return cost;
      } 
    },
    {
      field: 'active',
      headerName: 'Ativo',
      width: 60,
      valueGetter: (params) => (params.row.active) ? 'Sim' : 'Não'
    },
  ];

  return (    
    <Container component="main" maxWidth="xbl" height="100%">
      <CssBaseline />        
      <Title><h2>Produtos</h2></Title>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          flex: 1,
        }}
      >
        <div style={{ width: '100%', height: dataGridHeight, display: isMobile ? 'none' : 'block' }}>
          {isLoading ? ( 
            <Skeleton variant="rectangular" sx={{ bgcolor: "white" }} 
              width="100%" height={dataGridHeight} display={isMobile ? "block" : "none"}
            />
          ) : (        
          <DataGrid 
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            position="static"
            rows={products}
            columns={columns}
            autoPageSize
            pagination
            components={{
              Pagination: CustomPagination,
              NoRowsOverlay: CustomNoRowsOverlay,
              Toolbar: CustomToolBar
            }}
            hideFooterSelectedRowCount={true}
          />
          )}
        </div>
        <div style={{ width: '100%', height: dataGridHeight, display: isMobile ? 'block' : 'none' }}>
          {isLoading ? ( 
            <Skeleton variant="rectangular" sx={{ bgcolor: "white" }} 
              width="100%" height={dataGridHeight} display={isMobile ? "block" : "none"}
            />
          ) : (
            <DataGrid
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              rows={products}
              columns={columns}
              disableColumnMenu
              hideFooter
            />            
          )}
        </div>
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

