import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import ButtonBase from "@mui/material/ButtonBase";
import Avatar from "@mui/material/Avatar"; 
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, ptBR } from '@mui/x-data-grid';
import { useMediaQuery } from "@mui/material";

import CustomPagination from "../../components/DataGrid/CustomPagination";
import AlertSnackbar from "../../components/AlertSnackbar";
import Title from "../../components/Title";
import CustomNoRowsOverlay from "../../components/DataGrid/CustomNoRowsOverlay";

import { getCustomers } from "../../services/customer";
import { phoneMask, stringAvatar } from "../../commons/utils";
import { clearUserData } from "../../commons/authVerify";
import CustomToolBar from "../../components/DataGrid/CustomToolBar";

export default function CustomersPage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  // const [pageSize, setPageSize] = useState(5);

  const [customers, setCustomers] = useState([]);
  const [showAlert, setShowAlert] = useState({show: false});
  const [dataGridHeight, setDataGridHeight] = useState(400);

  useEffect(() => {    
    window.scrollTo(0, 0);

    const loadCustomers = async () => {
      const response = await getCustomers();
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
        setCustomers(response.data.map(customer => ({ ...customer, id: customer._id })));
      };                    
    };
    loadCustomers(navigate);

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
  
  const handleClickCustomer = async (event, cellValues) => {
    const id = cellValues.row.id;
    navigate(`/customer/${id}`);    
  };

  const handleClickAdd = async () => { 
    navigate("/new-customer");
  };

  const columns = isMobile ? 
  [
    {
      field: 'avatar',
      headerName: '',
      width: 60,
      renderCell: (cellValues) => {      
        return (
          <Avatar
            component={ButtonBase}
            onClick={(event) => {
              handleClickCustomer(event, cellValues);
            }}
            {...stringAvatar(
                `${cellValues.row.name}`, 
                `${cellValues.row.id}-${cellValues.row.name}`//.split(' ')[0][0]}`
              )
            }
            src={cellValues.row.photoUrl}  
          />
        );
      }
    },
    { field: 'name', headerName: 'Nome', width: 240 }
  ]
  : 
  [
    {
      field: 'avatar',
      headerName: '',
      width: 60,
      renderCell: (cellValues) => {      
        return (
          <Avatar
            component={ButtonBase}
            onClick={(event) => {
              handleClickCustomer(event, cellValues);
            }}
            {...stringAvatar(
                `${cellValues.row.name}`, 
                `${cellValues.row.id}-${cellValues.row.name}`//.split(' ')[0][0]}`
              )
            }
            src={cellValues.row.photoUrl}  
          />
        );
      }
    },
    { field: 'name', headerName: 'Nome', width: 240 },
    { field: 'address', headerName: 'Endereço', width: 400 },
    {
      field: 'phone',
      headerName: 'Fone',
      width: 130,
      valueGetter: (params) => phoneMask(params.row.phone)
    },
    {
      field: 'active',
      headerName: 'Ativo',
      width: 110,
      valueGetter: (params) => (params.row.active) ? 'Sim' : 'Não'
    },
  ];

  return (
    <Container component="main" maxWidth="xbl" height="100%">
      <CssBaseline />        
      <Title><h2>Clientes</h2></Title>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          flex: 1,
        }}
      >
        <div style={{ width: '100%', height: dataGridHeight, display: isMobile ? 'none' : 'block' }}>
          <DataGrid 
            position="static"
            rows={customers}
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
        </div>
        <div style={{ width: '100%', height: dataGridHeight, display: isMobile ? 'block' : 'none' }}>
          <DataGrid 
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            rows={customers}
            columns={columns}
            disableColumnMenu
            hideFooter
          />            
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