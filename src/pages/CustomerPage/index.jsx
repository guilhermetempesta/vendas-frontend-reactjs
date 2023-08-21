import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from "@mui/material/Button"; 
import Checkbox from "@mui/material/Checkbox"; 
import FormControlLabel from "@mui/material/FormControlLabel"; 
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from "@mui/material/Divider";
import AlertSnackbar from "../../components/AlertSnackbar";

import { onlyNumbers } from "../../commons/utils";
import NumberFormat from "react-number-format";
import { deleteCustomer, getCustomer, addCustomer, editCustomer } from "../../services/customer";
import Title from "../../components/Title";

export default function CustomerPage() {
  const {id} = useParams();
  const navigate = useNavigate();
  
  const [customer, setCustomer] = useState({
    id: '',
    name: '',
    code: '',
    address: '',
    comment: '',
    phone: '',
    active: true
  });

  const [editMode, setEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState({show: false});
  const [format, setFormat] = useState('(##) #####-####');
  
  useEffect(() => {    
    window.scrollTo(0, 0);
    
    const loadData = async () => {
        
      if (id) {      
        setEditMode(true);      
        const response = await getCustomer(id);
        if (response.status === 200) {
          console.log(response);
          const customerFromRes = {
            id: response.data._id,
            name: response.data.name,
            code: response.data.code,
            address: response.data.address,
            phone: response.data.phone,
            comment: response.data.comment,
            active: response.data.active
          };
          if (customerFromRes.phone) {
            const phoneLength = customerFromRes.phone.length; 
            (phoneLength < 11) ? setFormat('(##) ####-#####') : setFormat('(##) #####-####');            
          }
          setCustomer(customerFromRes);
        };
      }
    }

    loadData();
        
  }, [id]);
    
  const handleChangePhone = (value) => {    
    const phone = onlyNumbers(value);      
    (phone.length < 11) ? setFormat('(##) ####-#####') : setFormat('(##) #####-####'); 
    setCustomer({...customer, phone: phone}); 
  };

  const handleClickCancel = () => {
    navigate("/customers");
  };  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const statusSuccess = [200, 201, 204]; 
    const statusWarning = [400, 403, 405];
    
    let response;
  
    console.log('customer', customer);
    
    if (editMode) {
      response = await editCustomer(customer);
    } else {
      response = await addCustomer(customer);
    }
    
    if (statusSuccess.includes(response.status)) {      
      navigate("/customers");
      return;  
    } 

    if (statusWarning.includes(response.status)) {
      setShowAlert({show: true, message: response.data.message, severity: 'warning'});
      return;
    }
    
    if (response.status===500) {
      setShowAlert({show: true, message: response.data.message, severity: 'error'});
      return;
    }
  };

  const handleClickDelete = async () => {
    const response = await deleteCustomer(customer.id);
    if (response.status===200) {      
      navigate("/customers");  
    } else {
      setShowAlert({show: true, message: response.data.message, severity: 'warning'});
    }
  }

  return (
    <Container component="main" maxWidth="xbl">
      <CssBaseline />
      <Title>        
        { (editMode) ? <h2>Editar Cliente</h2> : <h2>Novo Cliente</h2> }
        { (editMode) && 
          <Stack direction="row" spacing={1}>
            <IconButton 
              aria-label="delete" 
              size="large"
              onClick={handleClickDelete}
            >
              <DeleteIcon fontSize="inherit"/>
            </IconButton>
          </Stack>
        }
      </Title>      
      <Divider />
      <Box 
        component="form" 
        autoComplete="off" 
        noValidate 
        sx={{ 
          mt: 1,
          width: '100%'
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <TextField
              name="name"
              required
              fullWidth
              id="name"
              label="Nome / Razão Social"
              autoFocus
              value={customer.name}
              onChange={(e) => setCustomer({...customer, name: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="code"
              fullWidth
              id="code"
              label="CPF / CNPJ"
              value={customer.code}
              onChange={(e) => setCustomer({...customer, code: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth
              id="address"
              label="Endereço"
              name="address"
              value={customer.address}
              onChange={(e) => setCustomer({...customer, address: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <NumberFormat 
              name="phone"
              fullWidth
              id="phone"
              label="Telefone"
              value={customer.phone || ''}
              format={format} 
              customInput={TextField}
              allowEmptyFormatting mask="_" 
              renderText={(value, props) => <TextField {...props}>{value}</TextField>}
              onChange={(e) => handleChangePhone(e.target.value)} 
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              id="comment"
              label="Observação"
              name="comment"
              value={customer.comment}
              onChange={(e) => setCustomer({...customer, comment: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel 
              label="Ativo" 
              control={ 
                <Checkbox 
                  checked={(customer.active)}
                  onChange={(e) => setCustomer({...customer, active: e.target.checked})}
                />
              }
            /> 
          </Grid>                
        </Grid>
      </Box>
      <Box            
        sx={{ marginTop: 2, marginBottom: 2 }}
      >
        <Stack spacing={2} direction="row-reverse">
          <Button 
            onClick={ handleSubmit }
            variant="contained" 
            style={{minWidth: '100px'}}            
          >
            Salvar
          </Button>
          <Button 
            onClick={ handleClickCancel }
            variant="outlined"
            style={{minWidth: '100px'}}
          >
            Cancelar
          </Button>
        </Stack>
      </Box>
      {
        (showAlert.show === true) &&  
        <AlertSnackbar setShowAlert={setShowAlert} show={showAlert.show} message={showAlert.message} severity={showAlert.severity} />
      }      
    </Container>
  );
}