import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from "@mui/material/Button"; 
import Checkbox from '@mui/material/Checkbox'; 
import FormControlLabel from "@mui/material/FormControlLabel"; 
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import AlertSnackbar from "../../components/AlertSnackbar";

import { clearUserData } from "../../commons/authVerify";
import { AuthContext } from "../../contexts/auth";
import { deleteProduct, getProduct, addProduct, editProduct } from "../../services/product";
import Title from "../../components/Title";
import { FormControl, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";

export default function ProductPage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState({
    id: '',
    name: '',
    description: '',
    price: 0.00,
    cost: 0.00,
    active: true,
    decimal: false
  });
  const [editMode, setEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState({show: false});

  useEffect(() => {    
    window.scrollTo(0, 0);
    
    const loadData = async () => {
      
      if (id) {      
        setEditMode(true);      
        const response = await getProduct(id);
        if (response.status === 200) {
          console.log(response);
          const productFromRes = {
            id: response.data._id,
            name: response.data.name,
            description: response.data.description,
            price: response.data.price,
            cost: response.data.cost,
            active: response.data.active,
            decimal: response.data.decimal
          };
          setProduct(productFromRes);  
        };
      }
    }
    loadData();
  }, [id]);
  
  const handleClickCancel = () => {
    navigate("/products");
  };  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    let response;

    const data = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      cost: product.cost,
      active: product.active,
      decimal: product.decimal
    }

    if (editMode) {
      response = await editProduct(data);
    } else {
      response = await addProduct(data);
    }

    const statusSuccess = [200, 201, 204]; 
    const statusWarning = [400, 403, 405];
    
    if (statusSuccess.includes(response.status)) {      
      navigate("/products");
      return;  
    } 

    if (statusWarning.includes(response.status)) {
      setShowAlert({show: true, message: response.data.message, severity: 'warning'});
      return;
    }
    
    if (response.status===401) {
      clearUserData();
      navigate("/login");
      return;
    }
    
    if (response.status===404) {
      setShowAlert({show: true, message: "Rota não encontrada no servidor.", severity: 'warning'});
      return;
    }
    
    if (response.status===500) {
      setShowAlert({show: true, message: response.data.message, severity: 'error'});
      return;
    }

  };

  const handleClickDelete = async () => {
    const response = await deleteProduct(product.id);
    if (response.status===200) {
      navigate("/products");  
    } else {
      setShowAlert({show: true, message: response.data.message, severity: 'warning'});
    }
  }

  return (
    <Container component="main" maxWidth="xbl">
      <CssBaseline />
      <Title>        
        { (editMode) ? <h2>Editar Produto</h2> : <h2>Novo Produto</h2> }
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
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        autoComplete="off" 
        noValidate 
        sx={{ 
          mt: 1,
          width: '100%'
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <TextField
              required
              fullWidth
              autoFocus
              id="name"
              label="Produto"
              name="name"
              value={product.name}
              onChange={(e) => setProduct({...product, name: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              required
              fullWidth
              id="description"
              label="Descrição"
              name="description"
              value={(product.description) ? product.description : ""}
              onChange={(e) => setProduct({...product, description: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel htmlFor="price">Preço</InputLabel>
              <OutlinedInput
                id="price"
                type="number" 
                inputProps={{ type: 'number', min: "0" }}
                value={product.price}
                onChange={(e) => { setProduct({...product, price: e.target.value}) }} 
                onBlur={(e) => { 
                  let num = parseFloat(product.price);
                  num = num.toFixed(2);
                  setProduct({...product, price: num});
                }} 
                startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                label="Preço"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel htmlFor="cost">Custo</InputLabel>
              <OutlinedInput
                id="cost"
                type="number" 
                inputProps={{ type: 'number', min: "0" }}
                value={product.cost}
                onChange={(e) => { setProduct({...product, cost: e.target.value}) }} 
                onBlur={(e) => { 
                  let num = parseFloat(product.cost);
                  num = num.toFixed(2);
                  setProduct({...product, cost: num});
                }} 
                startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                label="Preço"
              />
            </FormControl>
          </Grid>
          {(user.role==="admin") &&
          <Grid item xs={12} md={4} sm={12}>
            <FormControlLabel 
              label="Ativo" 
              control={ 
                <Checkbox 
                  checked={(product.active)}
                  onChange={(e) => setProduct({...product, active: e.target.checked})}
                />
              }
            /> 
          </Grid>
          }          
          <Grid item xs={12} md={4} sm={12}>
            <FormControlLabel 
              label="Venda com quantidade fracionada" 
              control={ 
                <Checkbox 
                  checked={(product.decimal)}
                  onChange={(e) => setProduct({...product, decimal: e.target.checked})}
                />
              }
            /> 
          </Grid>                
        </Grid>
        <Box            
          sx={{ marginTop: 2, marginBottom: 2 }}
        >
          <Stack spacing={2} direction="row-reverse">
            <Button 
              type="submit" 
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
      </Box>
      {
        (showAlert.show === true) &&  
        <AlertSnackbar setShowAlert={setShowAlert} show={showAlert.show} message={showAlert.message} severity={showAlert.severity} />
      }      
    </Container>
  );
}