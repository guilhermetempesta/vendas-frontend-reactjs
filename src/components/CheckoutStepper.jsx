import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from "@mui/material";

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
import { addSale, editSale } from "../services/sale";
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
    label: 'Opções de desconto e acréscimo'
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
  const isMobile = useMediaQuery('(max-width:600px)');
  const { clearCart, cartItems, getCartTotal, cartEditMode, cartEditInfo } = useContext(CartContext);
  
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
  const [editingDiscount, setEditingDiscount] = useState(false);
  const [editedDiscount, setEditedDiscount] = useState(0);
  const [discount, setDiscount] = useState(0); 
  const [editingAddition, setEditingAddition] = useState(false);
  const [editedAddition, setEditedAddition] = useState(0);
  const [addition, setAddition] = useState(0);
  const [total, setTotal] = useState(getCartTotal() - discount + addition);
  const [comments, setComments] = useState(""); 

  useEffect(() => {    
    window.scrollTo(0, 0);     
    if (cartEditMode) {
      setSelectedCustomer(cartEditInfo.customer);
      setComments(cartEditInfo.comments);
    }    
  }, [cartEditMode, cartEditInfo]);

  const handleEditDiscount = () => {
    setEditingDiscount(true);
    setEditedDiscount(discount.toString());
  };

  const handleConfirmDiscountEdit = () => {
    const cartTotal = getCartTotal();
    // const maxAllowedDiscount = cartTotal * 0.1; 

    // if (editedDiscount > maxAllowedDiscount) {
    //   setShowAlert({show: true, message: 'O desconto excede o limite permitido!', severity: 'warning'});
    //   return;
    // }
    // const total = cartTotal - editedDiscount;
    const total = parseFloat(cartTotal) + parseFloat(editedAddition) - parseFloat(editedDiscount);
    console.log(editedDiscount, total, editingDiscount)
    
    setDiscount(editedDiscount);
    setTotal(total);
    setEditingDiscount(false);
  };

  const handleCancelDiscountEdit = () => {
    setEditingDiscount(false);
  };

  const handleEditAddition = () => {
    setEditingAddition(true);
    setEditedAddition(addition.toString());
  };

  const handleConfirmAdditionEdit = () => {
    const cartTotal = getCartTotal();
    const total = parseFloat(cartTotal) + parseFloat(editedAddition) - parseFloat(editedDiscount);

    console.log(editedAddition, total, editingAddition)
    
    setAddition(editedAddition);
    setTotal(total);
    setEditingAddition(false);
  };

  const handleCancelAdditionEdit = () => {
    setEditingAddition(false);
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

    let response;

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

    if (cartEditMode) {
      
      const sale = {
        id: cartEditInfo.saleId,
        code: cartEditInfo.saleCode,
        customer: selectedCustomer._id,
        subtotal: subTotal,
        discount: discount,
        addition: addition,
        total: total,
        items: saleItems,
        comments: comments
      };
  
      console.log(sale);
      
      setIsLoading(true);
      response = await editSale(sale);
      setIsLoading(false);

    } else {
      
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
        addition: discount,
        total: total,
        items: saleItems,
        comments: comments
      };
  
      console.log(sale);
      
      setIsLoading(true);
      response = await addSale(sale);
      setIsLoading(false);

    };    
    
    if (statusSuccess.includes(response.status)) {      
      const message = (cartEditMode) ? 'Venda alterada com sucesso.' : 'Venda realizada com sucesso.';
      setIsSuccess(true);
      setShowAlert({show: true, message: message, severity: 'success'});      
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
          <></>
          // <Typography variant="caption">{`R$ ${parseFloat(discount).toFixed(2).replace('.', ',')}`}</Typography>
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
          <Box sx={{ width: '100%', curson: 'pointer' }}>
            <div 
              style={{ padding: (isMobile) ? '2px' : '16px' }}
            >
              <Divider /> 
              <Link 
                onClick={openCustomerDialog} 
                underline='hover'
                variant='h6'
                sx={{ cursor: 'pointer' }}
              >
                {(selectedCustomer.name) ? selectedCustomer.name : 'Selecionar Cliente'}
              </Link>
            </div>
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
          </Box>  
        );
      case 1:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', padding: (isMobile) ? '2px' : '16px' }}>
            <Divider />
            {/* Desconto */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ marginRight: '8px' }}>
                Desconto: R$ 
              </Typography>
              {editingDiscount ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="number"
                    value={editedDiscount}
                    onChange={(e) => setEditedDiscount(e.target.value)}
                    style={{ height: '25px', width: '70px', textAlign: 'right' }}
                    fullWidth
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
                  <Typography variant="body1">
                    {parseFloat(discount).toFixed(2).replace('.', ',')}
                  </Typography>
                  <IconButton onClick={handleEditDiscount}>
                    <EditIcon />
                  </IconButton>
                </div>
              )}
            </div>

            {/* Acréscimo */}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: isMobile ? '8px' : '0' }}>
              <Typography sx={{ marginRight: '8px' }}>
                Acréscimo: R$
              </Typography>
              {editingAddition ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="number"
                    value={editedAddition}
                    onChange={(e) => setEditedAddition(e.target.value)}
                    style={{ height: '25px', width: '70px', textAlign: 'right' }}
                    fullWidth
                  />
                  <IconButton onClick={handleConfirmAdditionEdit}>
                    <CheckIcon />
                  </IconButton>
                  <IconButton onClick={handleCancelAdditionEdit}>
                    <CloseIcon />
                  </IconButton>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1">
                    {parseFloat(addition).toFixed(2).replace('.', ',')}
                  </Typography>
                  <IconButton onClick={handleEditAddition}>
                    <EditIcon />
                  </IconButton>
                </div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <Box sx={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: (isMobile) ? '2px' : '16px'}}>
              <Divider />
              <Typography sx={{ marginRight: '8px' }}></Typography>
              <TextField
                multiline
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                fullWidth  // Adicionando a propriedade fullWidth para ocupar toda a largura disponível
              />
            </div>
          </Box>
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
      {(cartEditMode) &&
      <h3>{`Alteração da venda nº: ${cartEditInfo.saleCode}`}</h3>
      }
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
            {parseFloat(discount).toFixed(2).replace('.', ',')}
          </Typography>
          <Typography sx={{ lineHeight: '0.85' }}>Acréscimo:</Typography>
          <Typography sx={{ textAlign: 'right', lineHeight: '0.85' }}>
            {parseFloat(addition).toFixed(2).replace('.', ',')}
          </Typography>
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
        <>
          {(isMobile) ? (
            <Box sx={{ width: '100%' }}>          
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
            </Box>  
          ) : (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <Stepper activeStep={activeStep}>
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel>{step.label}</StepLabel>
                  </Step>                  
                ))}
              </Stepper>              
              <Box sx={{ flexGrow: 1 }}>
                {renderStepContent(activeStep)}
              </Box>
              <Box>
                {(!isSuccess) && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="contained"
                      onClick={(e) => (activeStep === steps.length - 1) ? handleSubmit(e) : handleNext(e)}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {activeStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>  
          )}           
        </>
      )}
      {
        (showAlert.show === true) &&  
        <AlertSnackbar setShowAlert={setShowAlert} show={showAlert.show} message={showAlert.message} severity={showAlert.severity} />
      }
    </div>  
  );
}
