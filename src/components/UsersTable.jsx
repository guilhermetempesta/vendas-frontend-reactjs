import React, { useState, useEffect, useContext } from "react";
import PropTypes from 'prop-types';

import { TableFooter, useMediaQuery } from "@mui/material";
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

import { getUsers } from "../services/user";
import { useNavigate } from "react-router-dom";
import { clearUserData } from "../commons/authVerify";

import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFGenerator from "./PDFGenerator";

import AlertSnackbar from "./AlertSnackbar";
import Title from "./Title";
import { AuthContext } from "../contexts/auth";

export default function UsersTable() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const { user } = useContext(AuthContext);
  
  const [showAlert, setShowAlert] = useState({show: false});
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    status: 'all' // all, active, inactive    
  });
  const [dialogFilters, setTemporaryFilters] = useState({ ...filters });
  const [hasFilters, setHasFilters] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadUsers = async () => {
      setIsLoading(true);
      const response = await getUsers(filters);
      console.log(response);
      
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
        setRows(response.data);
      };

      setIsLoading(false);
    };

    console.log('useEffect')
    loadUsers(navigate, filters);
  }, [navigate, filters]);
  
  const handleFilterClick = () => {
    setTemporaryFilters({ ...filters });
    setOpenDialog(true);
  };
  
  const handleFilterApply = () => {
    setOpenDialog(false);
    const filtersApplied =
      dialogFilters.status !== 'all' ||
      dialogFilters.name !== '';

    setHasFilters(filtersApplied);
    setFilters({ ...dialogFilters });
  };

  const handleFilterCancel = () => {
    setOpenDialog(false);
  };

  const handleFilterClear = () => {
    setTemporaryFilters({
      name: '',
      status: 'all'
    });
  };

  const handleClickAdd = async () => { 
    navigate("/new-user");
  };

  const handleClickOpen = async (id) => {
    navigate(`/user/${id}`);
  };
     
  function Row(props) {
    const { row } = props;
    const isMobile = useMediaQuery('(max-width:600px)');

    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' }} }         >
          {(isMobile) && 
            <TableCell align="center" sx={{ padding: '8px' }}>
              <IconButton
                aria-label="more options"
                size="small"
                onClick={() => {
                  handleClickOpen(row._id);
                }} 
              >
                <EditIcon />
              </IconButton>
            </TableCell>
          }
          <TableCell>{row.name}</TableCell>
          {(!isMobile) && 
          <>  
            <TableCell>{row.email}</TableCell>
            <TableCell align="left">
              {(row.active) ? 'Sim' : 'Não'}
            </TableCell>
            <TableCell align="center" sx={{ padding: '8px' }}>
              <IconButton
                aria-label="more options"
                size="small"
                onClick={() => {
                  handleClickOpen(row._id);
                }} 
              >
                <EditIcon />
              </IconButton>
            </TableCell>
          </>}
        </TableRow>
      </React.Fragment>
    );
  }

  function SumaryTable() { 
    const totalRegisters = () => {
      return rows.length; 
    }  
    return (
      <React.Fragment>
        <TableRow sx={{bgcolor: "#f4f4f4"}}>
          <TableCell 
            style={{ color: 'rgb(25,118,210)', fontSize: '1rem', fontWeight: 'bold' }} colSpan={(isMobile) ? 3 : 5}
          >Total de registros: {totalRegisters()}</TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  Row.propTypes = {
    row: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      active: PropTypes.string.isRequired,
    }).isRequired,
  };

  return (
    <div>
      <Title>
        <h2 style={{marginBottom: '4px'}}>Usuários</h2>
        {(!isLoading) &&
        <span>
          <IconButton
            onClick={handleFilterClick}
            color="primary"
          >
            <Badge badgeContent={hasFilters ? "!" : null} color="warning"> 
              <FilterListIcon />
            </Badge>
          </IconButton>
          {/* <PDFDownloadLink document={<PDFGenerator data={rows}/>} fileName="Vendas.pdf">  
            {({ loadingReport }) =>
              loadingReport ? (
                <CircularProgress />
              ) : (
                <IconButton
                  color="primary"
                  aria-label="Exportar para PDF"
                  style={{ margin: "16px" }}
                >
                  <SaveAltIcon />
                </IconButton>
              )
            }
          </PDFDownloadLink> */}
        </span>}  
      </Title>
      {(isLoading) ? (
        <div
          style={{
            height: '70vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}  
        >
          <CircularProgress />
        </div>
      ) : (
      <>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead sx={{bgcolor: '#f4f4f4'}}>
              <TableRow>
                {(isMobile) && <TableCell />}
                <TableCell>Nome</TableCell>
                {(!isMobile) &&
                  <>
                    <TableCell>E-mail</TableCell>
                    <TableCell>Ativo</TableCell>
                    <TableCell />
                  </>
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <Row key={index} row={row} />
              ))}
            </TableBody>
            <TableFooter>
              <SumaryTable/>
            </TableFooter>
          </Table>
        </TableContainer>
                 
        <Dialog open={openDialog} onClose={handleFilterCancel}>
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'rgb(235, 235, 235)',
              bgcolor: 'rgb(25, 118, 210)',
              padding: '16px', 
            }}
          >
            Filtros
            <FilterListIcon />
          </DialogTitle>
          <DialogContent>
            <Box>
              <TextField
                label="Usuário"
                value={dialogFilters.name}
                onChange={(e) =>
                  setTemporaryFilters({ ...dialogFilters, name: e.target.value })
                }
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFilterClear} color="primary">
              Limpar
            </Button>
            <Button onClick={handleFilterCancel} color="primary">
              Voltar
            </Button>
            <Button onClick={handleFilterApply} color="primary">
              Aplicar
            </Button>
          </DialogActions>
        </Dialog>
      </>
      )}      
      <Fab 
        onClick={() => handleClickAdd()}
        color="secondary" aria-label="add" 
        sx={{
          position: 'fixed',
          bottom: (theme) => theme.spacing(1),
          right: (theme) => theme.spacing(1),
          opacity: "85%"          
        }}
      >
        <AddIcon />
      </Fab>
      {
        (showAlert.show === true) &&  
        <AlertSnackbar setShowAlert={setShowAlert} show={showAlert.show} message={showAlert.message} severity={showAlert.severity} />
      }
    </div>
  );
}