import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

import { CartContext } from "../contexts/cart";
import { addSale } from "../services/sale";
import { statusSuccess, statusWarning } from "../commons/utils";
import Title from "./Title";
import AlertSnackbar from "./AlertSnackbar";
import { getCustomers } from "../services/customer";
import { CircularProgress, Link } from "@mui/material";
import { DateTime } from 'luxon';

const steps = [
  {
    label: 'Identificação do cliente'
  },
  {
    label: 'Opções de desconto'
  },
  {
    label: 'Observação'
  },
  {
    label: 'Finalização da venda'
  },
];

export default function CheckoutStepper() {
  const navigate = useNavigate();
  const { clearCart, cartItems, getCartTotal } = useContext(CartContext);
  
  const [showAlert, setShowAlert] = useState({show: false});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState({
    _id: 0,
    name: "",
  });
  const [isCustomerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [customers, setCustomers] = useState([]); // Array de clientes
  const [searchText, setSearchText] = useState("");
  // const [editingAddition, setEditingAddition] = false;
  // const [addition, setAddition] = useState(0);
  const [editingDiscount, setEditingDiscount] = useState(false);
  const [editedDiscount, setEditedDiscount] = useState(0)
  const [discount, setDiscount] = useState(0); 
  const [total, setTotal] = useState(getCartTotal() - discount);
  const [comments, setComments] = useState(""); 

  const handleEditDiscount = () => {
    setEditingDiscount(true);
    setEditedDiscount(discount.toString());
  };

  const handleConfirmDiscountEdit = () => {
    const cartTotal = getCartTotal();
    const maxAllowedDiscount = cartTotal * 0.1; 

    if (editedDiscount > maxAllowedDiscount) {
      setShowAlert({show: true, message: 'O desconto excede o limite permitido!', severity: 'warning'});
      return;
    }
    const total = cartTotal - editedDiscount;
    
    setDiscount(editedDiscount);
    setTotal(total);
    setEditingDiscount(false);
  };

  const handleCancelDiscountEdit = () => {
    setEditingDiscount(false);
  };

  const handleNext = () => {
    if (activeStep===0 && !selectedCustomer.name) {
      setShowAlert({show: true, message: 'Selecione o cliente!', severity: 'warning'});
      return;
    }  
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };

  const handleReturnToCart = () => {
    navigate("/cart");
  };

  const openCustomerDialog = () => {
    setCustomerDialogOpen(true);
  };

  const fetchCustomers = async (searchText) => {
    console.log('fetchCustomers');
    const response = await getCustomers();

    if (statusSuccess.includes(response.status)) {      
      setCustomers(response.data);  
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

  const closeCustomerDialog = () => {
    setCustomerDialogOpen(false);
  };

  const handleSelectCustomer = (customer) => {
    console.log(customer)
    setSelectedCustomer(customer);
    closeCustomerDialog();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    console.log('cartItems', cartItems);

    if (cartItems.length === 0) {
      setShowAlert({show: true, message: 'O carrinho está vazio!', severity: 'warning'});

      setTimeout(() => {
        clearCart();
        navigate('/cart');
      }, 2000);

      return;
    }

    let saleItems = [];
    cartItems.forEach(element => {
      const item = {};
      item.product = element.id;
      item.quantity = element.quantity;
      item.unitPrice = element.price;
      item.discount = 0;
      item.addition = 0;
      item.totalPrice = element.quantity * element.price;
      saleItems.push(item);
    });

    const subTotal = getCartTotal();

    // Especifique o fuso horário 'America/Sao_Paulo' para o Brasil
    const timeZone = 'America/Sao_Paulo';

    // Obtenha a data e hora atual no fuso horário especificado
    const currentDate = DateTime.now().setZone(timeZone).toISO();

    console.log(currentDate.toString());
    
    const sale = {
      customer: selectedCustomer._id,
      date: currentDate,
      subtotal: subTotal,
      discount: discount,
      addition: 0.00,
      total: total,
      items: saleItems,
      comments: comments
    };
 
    console.log(sale);
    
    setIsLoading(true);
    const response = await addSale(sale);
    setIsLoading(false);
    
    if (statusSuccess.includes(response.status)) {      
      setIsSuccess(true);
      setShowAlert({show: true, message: 'Venda realizada com sucesso.', severity: 'success'});      
      setTimeout(() => {
        clearCart();
        navigate('/');
      }, 2000);
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

  const renderOptionalInfo = (stepIndex) => {
    if (stepIndex === activeStep) {
      return null;
    }

    switch (stepIndex) {
      case 0:
        return (
          <Typography variant="caption">{selectedCustomer.name}</Typography>
        );
      case 1:
        return (
          <Typography variant="caption">{`R$ ${parseFloat(discount).toFixed(2).replace('.', ',')}`}</Typography>
        );
      case 2:
        return (
          <Typography variant="caption">{comments}</Typography>
        );  
      default: 
        return null;
    }
  };
  
  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <>
            <Box 
              sx={{ cursor: 'pointer' }}
              
            >
              <Link 
                onClick={openCustomerDialog} 
                underline='hover'
                variant='h6'
              >
                {(selectedCustomer.name) ? selectedCustomer.name : 'Selecionar Cliente'}
              </Link>
            </Box>
            <Dialog
              open={isCustomerDialogOpen}
              onClose={closeCustomerDialog}
              fullWidth
              maxWidth="md"
              sx={{
                minWidth: '300px', // Largura mínima desejada
                minHeight: '400px', // Altura mínima desejada
              }}
            >
              <DialogTitle
                sx={{
                  color: "rgb(235, 235, 235)",
                  bgcolor: "rgb(25, 118, 210)",
                }}
              >
                Selecionar Cliente
              </DialogTitle>
              <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    bgcolor: 'white',
                    padding: '8px 0px 8px 0px',
                    borderBottom: '1px solid #ccc',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <TextField
                      label="Buscar..."
                      variant="outlined"
                      fullWidth
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      sx={{ flexGrow: 1 }}
                    />
                    <IconButton onClick={() => fetchCustomers(searchText)}>
                      <SearchIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Box
                  sx={{
                    overflowY: 'auto', // Adicione rolagem apenas ao conteúdo abaixo
                    flexGrow: 1, // Isso permite que o conteúdo cresça, mas ainda mantenha a parte de pesquisa visível
                  }}
                >
                  {customers.map((customer) => (
                    <Box
                      sx={{ cursor: 'pointer' }}
                      key={customer._id}
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-start"
                      border="1px solid #ccc"
                      padding="8px"
                      marginBottom="4px"
                      bgcolor={"#f4f4f4"}
                      onClick={() => handleSelectCustomer(customer)}
                    >
                      <Typography variant="h6">{customer.name}</Typography>
                      <Typography variant="body1">{customer.address}</Typography>
                      <Typography variant="body2">{customer.phone}</Typography>
                    </Box>
                  ))}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeCustomerDialog} color="primary">
                  Cancelar
                </Button>
              </DialogActions>
            </Dialog>
          </>  
        );
      case 1:
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {editingDiscount ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ marginRight: '8px' }}>R$</Typography>
                <input
                  type="number"
                  value={editedDiscount}
                  onChange={(e) => setEditedDiscount(e.target.value)}
                  style={{ height: '25px', width: '70px', textAlign: 'right' }}
                />
                <IconButton onClick={handleConfirmDiscountEdit}>
                  <CheckIcon />
                </IconButton>
                <IconButton onClick={handleCancelDiscountEdit}>
                  <CloseIcon />
                </IconButton>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1">{`R$ ${parseFloat(discount).toFixed(2).replace('.', ',')}`}</Typography>
                <IconButton onClick={handleEditDiscount}>
                  <EditIcon />
                </IconButton>
              </div>
            )}
          </div>
        );
      case 2:
        return(
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ marginRight: '8px' }}></Typography>
            <input
              type="text"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              // style={{ height: '25px', width: '70px', textAlign: 'left' }}
            />
          </div>
        );      
      default:
        return null;
    }
  };

  return (
    <div>
      <Title>
        <h2>Resumo da Venda</h2>
        
        {(!isLoading) && 
          <span>
            <IconButton
              onClick={handleReturnToCart}
              color="primary"
            >
              <ArrowBackIcon />
            </IconButton>
          </span>
        }
      </Title>
      <Paper 
        elevation={0} 
        sx={{ padding: '1px 16px 16px 16px', bgcolor: '#f4f4f4', marginBottom: '24px'}}
      >      
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
          <Typography sx={{ lineHeight: '0.85' }}>Subtotal:</Typography>
          <Typography sx={{ textAlign: 'right', lineHeight: '0.85' }}>
            {getCartTotal().toFixed(2).replace('.', ',')}
          </Typography>
          <Typography sx={{ lineHeight: '0.85' }}>Desconto:</Typography>
          <Typography sx={{ textAlign: 'right', lineHeight: '0.85' }}>
            {/* {discount} */}
            {parseFloat(discount).toFixed(2).replace('.', ',')}
          </Typography>
          {/* <Typography sx={{ lineHeight: '0.85' }}>Acréscimo:</Typography>
          <Typography sx={{ textAlign: 'right', lineHeight: '0.85' }}>0.00</Typography> */}
          <Divider sx={{ gridColumn: 'span 2', mb: 1, height: '0px' }} />
          <Typography sx={{ lineHeight: '0.85' }}>Total:</Typography>
          <Typography sx={{ textAlign: 'right', lineHeight: '0.85' }}>
            {total.toFixed(2).replace('.', ',')}
          </Typography>
        </Box>
      </Paper>  
      {(isLoading) ? (
        <div
          style={{
            height: '30vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}  
        >
          <CircularProgress />
        </div>
      ) : (
        <Box sx={{ maxWidth: 400 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  optional={renderOptionalInfo(index)}
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  {renderStepContent(index)}
                  {(!isSuccess) && <Box sx={{ mb: 2 }}>
                    <div>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="contained"
                        onClick={(e) => (index === steps.length - 1) ? handleSubmit(e) : handleNext(e)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 1 ? 'Finalizar' : 'Próximo'}
                      </Button>
                    </div>
                  </Box>}
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {/* {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3, marginTop: '8px'}}>
              <Button 
                onClick={handleBack} 
                sx={{ mt: 1, mr: 1 }}
              >
                Voltar
              </Button>
              <Button 
                onClick={handleSubmit} 
                sx={{ mt: 1, mr: 1 }}
                variant="contained"
              >
                Finalizar
              </Button>
            </Paper>
          )} */}
        </Box>
      )}
      {
        (showAlert.show === true) &&  
        <AlertSnackbar setShowAlert={setShowAlert} show={showAlert.show} message={showAlert.message} severity={showAlert.severity} />
      }
    </div>  
  );
}
