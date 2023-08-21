import React, { useState, useEffect, useContext } from "react";
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
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import AlertSnackbar from "../../components/AlertSnackbar";

import { onlyNumbers } from "../../commons/utils";
import NumberFormat from "react-number-format";
import { deleteEmployee, getEmployee, addEmployee, editEmployee } from "../../services/employee";
import Title from "../../components/Title";
import { getCompanies } from "../../services/company";
import { Autocomplete, FormControl, InputLabel } from "@mui/material";
import { AuthContext } from "../../contexts/auth";

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FeedIcon from '@mui/icons-material/Feed';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Avatar from "@mui/material/Avatar";
import { styled } from '@mui/material/styles';
import { deleteFile, uploadFile } from "../../services/cloudinary";

const Input = styled('input')({
  display: 'none',
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const BigAvatar = styled(Avatar)`
  width: 180px;
  height: 180px;  
  margin-bottom: 10px;
`;

export default function EmployeePage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [employee, setEmployee] = useState({
    id: '',
    name: '',
    phone: '',
    comments: '',
    imageUrl: '',
    cloudinaryPublicId: '',
    active: true,
    company: null,
    officeHours: []
  });

  const [companies, setCompanies] = useState([]);  
  const [format, setFormat] = useState('(##) #####-####');
  const [editMode, setEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState({show: false});
  const [tabIndex, setTabIndex] = useState(0);
  const [officeHours, setOfficeHours] = useState([
    {
      weekday: 0,
      work: false,
      entryTime: '00:00:00',
      departureTime: '00:00:00',
      entryTime2: '00:00:00',
      departureTime2: '00:00:00'
    },{
      weekday: 1,
      work: false,
      entryTime: '00:00:00',
      departureTime: '00:00:00',
      entryTime2: '00:00:00',
      departureTime2: '00:00:00'
    },{
      weekday: 2,
      work: false,
      entryTime: '00:00:00',
      departureTime: '00:00:00',
      entryTime2: '00:00:00',
      departureTime2: '00:00:00'
    },{
      weekday: 3,
      work: false,
      entryTime: '00:00:00',
      departureTime: '00:00:00',
      entryTime2: '00:00:00',
      departureTime2: '00:00:00'
    },{
      weekday: 4,
      work: false,
      entryTime: '00:00:00',
      departureTime: '00:00:00',
      entryTime2: '00:00:00',
      departureTime2: '00:00:00'
    },{
      weekday: 5,
      work: false,
      entryTime: '00:00:00',
      departureTime: '00:00:00',
      entryTime2: '00:00:00',
      departureTime2: '00:00:00'
    },{
      weekday: 6,
      work: false,
      entryTime: '00:00:00',
      departureTime: '00:00:00',
      entryTime2: '00:00:00',
      departureTime2: '00:00:00'
    }
  ]);
  
  const [photo, setPhoto] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {    
    window.scrollTo(0, 0);
    
    const loadData = async () => {
    
      const res = await getCompanies();
      if (res.status === 200) {
        setCompanies(res.data);
      }

      if (id) {      
        setEditMode(true);      
        const response = await getEmployee(id);
        if (response.status === 200) {
          console.log(response);
          const phoneLength = response.data.phone.length; 
          (phoneLength < 11) ? setFormat('(##) ####-#####') : setFormat('(##) #####-####'); 
          setEmployee(response.data);
          setOfficeHours(response.data.officeHours);          
        };
      }
    }

    loadData();
        
  }, [id]);
  
  const handleChangePhone = (value) => {    
    const phone = onlyNumbers(value);      
    (phone.length < 11) ? setFormat('(##) ####-#####') : setFormat('(##) #####-####'); 
    setEmployee({...employee, phone: phone}); 
  };

  const defaultPropsCompany = {
    options: companies,
    getOptionLabel: (option) => option.name,
  };

  const handleClickCancel = () => {
    navigate("/employees");
  };  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const statusSuccess = [200, 201, 204]; 
    const statusWarning = [400, 405];
    
    let response;

    const data = {
      id: employee.id,
      name: employee.name,
      phone: employee.phone,
      comments: employee.comments,
      imageUrl: employee.imageUrl,
      cloudinaryPublicId: employee.cloudinaryPublicId,
      active: employee.active,
      officeHours: employee.officeHours
    }
    
    if (photo) {
      if (employee.cloudinaryPublicId) {
        await deleteFile(employee.cloudinaryPublicId); 
      }
      
      const res = await uploadFile(photo);
      if (res.url && res.public_id) {
        console.log(res);
        data.imageUrl = res.url;
        data.cloudinaryPublicId = res.public_id;
      } else {
        setShowAlert({show: true, message: "", severity: 'warning'});
        // return;
      }
    }

    console.log('data', data);

    if (user.plan==='premium') {
      data.companyId = employee.company.id;
    } else {
      data.companyId = companies[0].id;
    };

    data.officeHours.map((e) => e.companyId = data.companyId);
    
    if (editMode) {
      response = await editEmployee(data);
    } else {
      response = await addEmployee(data);
    }
    
    if (statusSuccess.includes(response.status)) {      
      navigate("/employees");
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
    // setShowAlert(null);
    const response = await deleteEmployee(employee.id);
    if (response.status===204) {      
      navigate("/employees");  
    } else {
      setShowAlert({show: true, message: response.data.message, severity: 'warning'});
    }
  }

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleWeekdayName = (index) => {
    const days = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sabado'];
    return days[index];
  }  

  const handleCheckWeekday = (index, e) => {
    const newOfficeHours = officeHours.map((element, i) => {
      if(i === index) {
        element.work = e.target.checked
        element.entryTime = '00:00:00';
        element.departureTime = '00:00:00';
        element.entryTime2 = '00:00:00';
        element.departureTime2 = '00:00:00';
      }
      return element;
    });

    setOfficeHours(newOfficeHours);
    setEmployee({...employee, officeHours: newOfficeHours });
  }

  const handleChangeEntryTime = (index, e) => {
    const newOfficeHours = officeHours.map((element, i) => {
      if(i === index) {
        element.entryTime = e.target.value
      }
      return element;
    });

    setOfficeHours(newOfficeHours);
    setEmployee({...employee, officeHours: newOfficeHours }); 
  }

  const handleChangeDepartureTime = (index, e) => {
    const newOfficeHours = officeHours.map((element, i) => {
      if(i === index) {
        element.departureTime = e.target.value
      }
      return element;
    });

    setOfficeHours(newOfficeHours);
    setEmployee({...employee, officeHours: newOfficeHours }); 
  }

  const handleChangeEntryTime2 = (index, e) => {
    const newOfficeHours = officeHours.map((element, i) => {
      if(i === index) {
        element.entryTime2 = e.target.value
      }
      return element;
    });

    setOfficeHours(newOfficeHours);
    setEmployee({...employee, officeHours: newOfficeHours }); 
  }

  const handleChangeDepartureTime2 = (index, e) => {
    const newOfficeHours = officeHours.map((element, i) => {
      if(i === index) {
        element.departureTime2 = e.target.value
      }
      return element;
    });

    setOfficeHours(newOfficeHours);
    setEmployee({...employee, officeHours: newOfficeHours }); 
  }

  const uploadImage = async (e) => {
    const newImage = e.target.files[0];
    
    if (newImage) {
      setPhotoUrl(URL.createObjectURL(newImage));
      setPhoto(newImage);
    } else {
      setPhotoUrl(null);
      setPhoto(null);
    }
  };

  return (
    <Container component="main" maxWidth="xbl">
      <CssBaseline />
      <Title>        
        { (editMode) ? <h2>Editar Funcionário</h2> : <h2>Novo Funcionário</h2> }
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
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} 
          // display="flex"          
          // justifyContent="center"
        >
          <Tabs value={tabIndex} onChange={handleChangeTab} aria-label="tabs" >
            <Tab icon={<FeedIcon />} label="Geral" {...a11yProps(0)} />
            <Tab icon={<ScheduleIcon />} label="Horários" {...a11yProps(1)} />
            <Tab icon={<PhotoCamera />} label="Foto" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={tabIndex} index={0}>
          <Grid container spacing={2}>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                required
                fullWidth
                id="name"
                label="Nome"
                autoFocus
                value={employee.name}
                onChange={(e) => setEmployee({...employee, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <NumberFormat 
                name="phone"
                fullWidth
                id="phone"
                label="Telefone"
                value={employee.phone}
                format={format} 
                customInput={TextField}
                allowEmptyFormatting mask="_" 
                renderText={(value, props) => <TextField {...props}>{value}</TextField>}
                onChange={(e) => handleChangePhone(e.target.value)} 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                disabled={editMode}
                id="comment"
                label="Descrição/Comentários"
                name="comment"
                value={employee.comments}
                onChange={(e) => setEmployee({...employee, comment: e.target.value})}
              />
            </Grid>
            { (user.plan==='premium') &&
            <Grid item xs={12} md={6} sm={6}>
              <FormControl fullWidth>  
                <Autocomplete
                  {...defaultPropsCompany}
                  id="company"
                  includeInputInList
                  clearOnEscape
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(event, element) => {
                    // console.log(element)
                    setEmployee({...employee, company: element });
                  }}
                  value={(employee.company) ? employee.company : null}
                  renderInput={(params) => (
                    <TextField {...params} 
                      label="Empresa" 
                      // variant="standard" 
                    />
                  )}
                />  
              </FormControl>
            </Grid>  
            }
            <Grid item xs={12} sm={6}>
              <FormControlLabel 
                label="Ativo" 
                control={ 
                  <Checkbox 
                    checked={(employee.active)}
                    onChange={(e) => setEmployee({...employee, active: e.target.checked})}
                  />
                }
              /> 
            </Grid>                
          </Grid>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          {officeHours.map((element, index) => (
            <Box>
              <Grid container spacing={2} key={`hour-${index}`} marginBottom="10px">  
                <Grid item xs={12} md={2} sm={12}>
                  <FormControlLabel 
                    label={handleWeekdayName(index)} 
                    control={ 
                      <Checkbox 
                        checked={(element.work)}
                        onChange={(e) => handleCheckWeekday(index, e)}
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} md={2} sm={3}>
                  <InputLabel id="entry-label">Entrada</InputLabel>
                  <TextField
                    required
                    fullWidth
                    id={`entry-${index}`}
                    key={`entry-${index}`}
                    name={`entry-${index}`}
                    value={element.entryTime}
                    onChange={(e) => handleChangeEntryTime(index, e)}
                    type="time"
                    size="small"
                    disabled={(!element.work)}
                  />
                </Grid>
                <Grid item xs={12} md={2} sm={3}>
                  <InputLabel id="departure-label">Saída</InputLabel>
                  <TextField
                    required
                    fullWidth
                    id={`departure-${index}`}
                    key={`departure-${index}`}
                    name={`departure-${index}`}
                    value={element.departureTime}
                    onChange={(e) => handleChangeDepartureTime(index, e)}
                    type="time"
                    size="small"
                    disabled={(!element.work)}
                  /> 
                </Grid>
                <Grid item xs={12} md={2} sm={3}>
                  <InputLabel id="entry2-label">Entrada</InputLabel>
                  <TextField
                    required
                    fullWidth
                    id={`entry2-${index}`}
                    key={`entry2-${index}`}
                    name={`entry2-${index}`}
                    value={element.entryTime2}
                    onChange={(e) => handleChangeEntryTime2(index, e)}
                    type="time"
                    size="small"
                    disabled={(!element.work)}
                  /> 
                </Grid>
                <Grid item xs={12} md={2} sm={3}>
                  <InputLabel id="departure2-label">Saída</InputLabel>
                  <TextField
                    required
                    fullWidth
                    id={`departure2-${index}`}
                    key={`departure2-${index}`}
                    name={`departure2-${index}`}
                    value={element.departureTime2}
                    onChange={(e) => handleChangeDepartureTime2(index, e)}
                    type="time"
                    size="small"
                    disabled={(!element.work)}
                  /> 
                </Grid>
              </Grid>
              <Divider/>
            </Box>
          ))}        
        </TabPanel>
        <TabPanel value={tabIndex} index={2} >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <BigAvatar
              src={photoUrl || employee.imageUrl}
              imgProps={{
                style: {
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "cover"
                },
              }}
            />
            <Stack direction="row" alignItems="center" spacing={2}>
              <label htmlFor="contained-button-file">
                <Input accept="image/*" id="contained-button-file" type="file" onChange={uploadImage}/>
                <Button variant="outlined" startIcon={<PhotoCamera />} component="span">
                  selecionar foto
                </Button>
              </label>
            </Stack>
          </Box>
        </TabPanel>
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