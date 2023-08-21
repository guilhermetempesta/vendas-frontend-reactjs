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

import { getUsers } from "../../services/user";
import { stringAvatar } from "../../commons/utils";
import { clearUserData } from "../../commons/authVerify";
import CustomNoRowsOverlay from "../../components/DataGrid/CustomNoRowsOverlay";
import Title from "../../components/Title";
import CustomToolBar from "../../components/DataGrid/CustomToolBar";

export default function UsersPage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  const [users, setUsers] = useState([]);
  const [showAlert, setShowAlert] = useState({show: false});
  const [dataGridHeight, setDataGridHeight] = useState(400);

  useEffect(() => {    
    window.scrollTo(0, 0);
 
    const loadUsers = async () => {
      const response = await getUsers();      
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
        // setUsers(response.data);
        setUsers(response.data.map(user => ({ ...user, id: user._id })));
      };                    
    };
    loadUsers(navigate);

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
  
  const handleClickUser = async (event, cellValues) => {
    const userId = cellValues.row.id;
    navigate(`/user/${userId}`);
  };

  const handleClickAdd = () => {
    navigate("/new-user");
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
              handleClickUser(event, cellValues);
            }}
            {...stringAvatar(
                `${cellValues.row.name}`, 
                `${cellValues.row.email}${cellValues.row.id}`
              )
            }  
          />
        );
      }
    },
    { field: 'name', headerName: 'Nome', width: 300 }
  ] : 
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
              handleClickUser(event, cellValues);
            }}
            {...stringAvatar(
                `${cellValues.row.name}`, 
                `${cellValues.row.email}${cellValues.row.id}`
              )
            }  
          />
        );
      }
    },
    { field: 'name', headerName: 'Nome', width: 300 },
    { field: 'email', headerName: 'Email', width: 350 },
    {
      field: 'role',
      headerName: 'Administrador',
      width: 110,
      valueGetter: (params) => (params.row.role==='admin') ? 'Sim' : 'Não'
    }
  ];
  
  return (
    <Container component="main" maxWidth="xbl" height="100%">
      <CssBaseline />        
      <Title><h2>Usuários</h2></Title>
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
            rows={users}
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
            rows={users}
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