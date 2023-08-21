import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from "@mui/material/Button"; 
import Checkbox from "@mui/material/Checkbox"; 
import FormControlLabel from "@mui/material/FormControlLabel"; 
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import AlertSnackbar from "../../components/AlertSnackbar";

import { deleteUser, getUser, addUser, editUser } from "../../services/user";
import Title from "../../components/Title";

export default function UserPage() {
  const {id} = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    commission: 0
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState({show: false});

  useEffect(() => {    
    window.scrollTo(0, 0);
    if (id) {      
      setEditMode(true);      
      const loadUser = async () => {
        const response = await getUser(id);        
        if (response.status === 200) {
          console.log(response);
          const userFromRes = {
            id: response.data._id,
            name: response.data.name,
            email: response.data.email,
            commission: response.data.commission,
            role: response.data.role,
            active: response.data.active
          };
          setUser(userFromRes);
        };        
      };        
      loadUser();
    }
  }, [id]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  
  const handleClickShowPasswordConfirmation = () => {
    setShowPasswordConfirmation(!showPasswordConfirmation);
  };

  const handleMouseDownPasswordConfirmation = (event) => {
    event.preventDefault();
  };

  const handleChangeCommission = (e) => {
    const newValue = e.target.value;
    if (newValue === '' || (Number(newValue) >= 0 && Number(newValue) <= 99)) {
      setUser({ ...user, commission: newValue });
    }
  };

  const handleChangeCheckBox = (event) => {
    if (event.target.checked) {
      setUser({ ...user, role: 'admin' });
    } else {
      setUser({ ...user, role: 'user' });
    };
  };

  const handleClickCancel = () => {
    navigate("/users");
  };  
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    const statusSuccess = [200, 201, 204]; 
    const statusWarning = [400, 403, 405];
    
    let response;
    if (editMode) {
      response = await editUser(user);
    } else {
      response = await addUser(user);
    }

    if (statusSuccess.includes(response.status)) {      
      navigate("/users");
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
    const response = await deleteUser(user.id);
    if (response.status===200) {      
      navigate("/users");  
    } else {
      setShowAlert({show: true, message: response.data.message, severity: 'warning'});
    }
  }

  return (
    <Container component="main" maxWidth="xbl">
      <CssBaseline />
      <Title>        
        { (editMode) ? <h2>Editar Usuário</h2> : <h2>Novo Usuário</h2> }
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
              name="name"
              required
              fullWidth
              id="name"
              label="Nome"
              autoFocus
              value={user.name}
              onChange={(e) => setUser({...user, name: e.target.value})}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              disabled={editMode}
              id="email"
              label="Email"
              name="email"
              value={user.email}
              onChange={(e) => setUser({...user, email: e.target.value})}
            />
          </Grid>
          { (!editMode) &&
          <Grid item xs={12} sm={6}>
            <FormControl 
              variant="outlined" fullWidth required
            >
              <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={user.password}
                onChange={(e) => setUser({...user, password: e.target.value})}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>  
          </Grid>
          }
          { (!editMode) &&          
          <Grid item xs={12} sm={6}>
            <FormControl 
              variant="outlined" fullWidth required
            >
              <InputLabel>Confirmar</InputLabel>
              <OutlinedInput
                id="confirmPassword"
                type={showPasswordConfirmation ? 'text' : 'password'}
                value={user.confirmPassword}
                onChange={(e) => setUser({...user, confirmPassword: e.target.value})}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPasswordConfirmation}
                      onMouseDown={handleMouseDownPasswordConfirmation}
                      edge="end"
                    >
                      {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="confirmPassword"
              />
            </FormControl>  
          </Grid>
          }
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel htmlFor="commission">Percentual de Comissão</InputLabel>
              <OutlinedInput
                id="commission"
                type="number" 
                inputProps={{ type: 'number', min: "0", max: "99" }}
                value={user.commission}
                // onChange={(e) => { setUser({...user, commission: e.target.value}) }} 
                onChange={handleChangeCommission}
                onBlur={(e) => { 
                  let num = parseFloat(user.commission);
                  num = num.toFixed(2);
                  setUser({...user, commission: num});
                }} 
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                label="Percentual de Comissão"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel 
              disabled={(user.master)} 
              label="Administrador" 
              control={ 
                <Checkbox 
                  checked={(user.role==='admin')}
                  onChange={handleChangeCheckBox}
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