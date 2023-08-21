import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import ButtonBase from "@mui/material/ButtonBase";
import Avatar from "@mui/material/Avatar"; 
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from '@mui/x-data-grid';
import CustomPagination from "../../components/DataGrid/CustomPagination";
import AlertSnackbar from "../../components/AlertSnackbar";

import { getEmployees } from "../../services/employee";
import { getCompanies } from "../../services/company";
import { phoneMask, stringAvatar } from "../../commons/utils";
import { clearUserData } from "../../commons/authVerify";
import CustomNoRowsOverlay from "../../components/DataGrid/CustomNoRowsOverlay";
import Title from "../../components/Title";

export default function EmployeesPage() {
  const navigate = useNavigate();
  // const [pageSize, setPageSize] = useState(5);
  const [employees, setEmployees] = useState([]);
  const [showAlert, setShowAlert] = useState({show: false});

  useEffect(() => {    
    window.scrollTo(0, 0);
    const loadEmployees = async () => {
      const response = await getEmployees();      
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
        setEmployees(response.data);
      };                    
    };
    loadEmployees(navigate);
  }, [navigate]);
  
  const handleClickUser = async (event, cellValues) => {
    const id = cellValues.row.id;
    navigate(`/employee/${id}`);
  };

  const handleClickAdd = async () => {
    const {data} = await getCompanies();
    if (!data.length) {
      setShowAlert({ show: true, message: 'Cadastre uma empresa antes de continuar!', severity: 'warning' })
      return;
    } 
    navigate("/new-employee");
  };

  const columns = [
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
                `${cellValues.row.id}-${cellValues.row.name}`//.split(' ')[0][0]}`
              )
            }
            src={cellValues.row.imageUrl}  
          />
        );
      }
    },
    { field: 'name', headerName: 'Nome', width: 150 },
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
      <Title><h2>Funcionários</h2></Title>
      <Box
        sx={{
          position: 'relative',
          minHeight: 200,
          width: '100%',
          height: '100%'
        }}
      > 
        <div style={{ height: 400, width: '100%' }}>
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid 
                position="static"
                rows={employees}
                columns={columns}    
                pageSize={5}
                rowsPerPageOptions={[5]}
                pagination
                components={{
                  Pagination: CustomPagination,
                  NoRowsOverlay: CustomNoRowsOverlay,
                }}
                hideFooterSelectedRowCount={true}
                // pageSize={pageSize}
                // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                // rowsPerPageOptions={[5, 10, 20]}
              />            
            </div>
          </div>
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