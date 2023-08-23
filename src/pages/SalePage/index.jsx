import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import { 
  Autocomplete, Button, ButtonGroup, Card, CardActions, CardContent, Dialog, DialogActions, 
  DialogContent, DialogTitle, Fab, FormControl, InputLabel, OutlinedInput, Typography, useMediaQuery,
  List, ListItem, ListItemText, ListItemSecondaryAction, InputAdornment, DialogContentText, InputBase, Paper, ListItemButton 
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { clearUserData } from "../../commons/authVerify";
import { AuthContext } from "../../contexts/auth";
import { deleteSale, getSale, addSale, editSale } from "../../services/sale";
import { getCustomers } from "../../services/customer";
import Title from "../../components/Title";
import AlertSnackbar from "../../components/AlertSnackbar";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { ptBR } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { getProducts } from "../../services/product";

export default function SalePage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isMobile = useMediaQuery('(max-width:600px)');

  const [sale, setSale] = useState({
    id: '',
    code: '',
    date: format(new Date(), 'dd/MM/yyyy'),
    subtotal: 0,
    discount: 0,
    addition: 0,
    total: 0,
    items: [],
    customer: null,
    user: null    
  });
  
  const [customers, setCustomers] = useState([]);  
  const [items, setItems] = useState([]);  
  const [editMode, setEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState({show: false});
  const [divHeight, setDivHeight] = useState(400);
  
  const [openProductDialog, setOpenProductDialog] = useState(false);

  useEffect(() => {    
    window.scrollTo(0, 0);
    
    const loadData = async () => {
      
      const res = await getCustomers();
      if (res.status === 200) {
        const customersList = res.data.map((object) => {
          const id = object._id;
          const name = object.name;
          return {id, name}
        }) 
        console.log(customersList);
        setCustomers(customersList);
      }

      if (id) {      
        setEditMode(true);      
        const response = await getSale(id);
        if (response.status === 200) {
          
          console.log(response);          
          response.data.id = response.data._id;
          delete response.data._id;
          setSale(response.data);

          if (response.data.items) {
            response.data.items.forEach((item) => {
              item.id = item._id;
              delete item._id;
              item.productDet = item.product
              item.product = item.product._id;
              console.log(item.productDet.name)
            });
            setItems(response.data.items);
          };          
        };        
      } else {
        setSale((sale) => ({ ...sale, date: new Date().toISOString() }));
      }
    }
    loadData();

    const calculateDivHeight = () => {
      const availableHeight = window.innerHeight - 400; // Ajuste o valor conforme necessário
      setDivHeight(availableHeight);
    };

    // Calcula a altura do DataGrid no primeiro carregamento da página
    calculateDivHeight();

    // Recalcula a altura do DataGrid quando a janela é redimensionada
    window.addEventListener("resize", calculateDivHeight);

    // Remove o event listener ao desmontar o componente
    return () => window.removeEventListener("resize", calculateDivHeight);

  }, [id]);

  const defaultPropsCustomer = {
    options: customers,
    getOptionLabel: (option) => option.name,
  };

  const handleClickCancel = () => {
    navigate("/sales");
  };  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    let response;  

    const data = {
      id: sale.id,
      code: sale.code,
      date: sale.date,
      subtotal: sale.subtotal,
      discount: sale.discount,
      addition: sale.addition,
      total: sale.total,
      customer: sale.customer._id,
      user: sale.user._id,
      items: items
    }

    if (editMode) {
      response = await editSale(data);
    } else {
      response = await addSale(data);
    }

    const statusSuccess = [200, 201, 204]; 
    const statusWarning = [400, 403, 405];
    
    if (statusSuccess.includes(response.status)) {      
      navigate("/sales");
      return;  
    } 

    if (statusWarning.includes(response.status)) {
      setShowAlert({show: true, message: response.data.message, severity: 'warning'});
      return;
    }

    if (response.status===404) {
      setShowAlert({show: true, message: "Rota não encontrada no servidor.", severity: 'warning'});
      return;
    }
    
    if (response.status===401) {
      clearUserData();
      navigate("/login");
      return;
    }
    
    if (response.status===500) {
      setShowAlert({show: true, message: response.data.message, severity: 'error'});
      return;
    }
  };

  const handleClickDelete = async () => {
    const response = await deleteSale(sale.id);
    if (response.status===204) {      
      navigate("/sales");  
    } else {
      setShowAlert({show: true, message: response.data.message, severity: 'warning'});
    }
  }

  const openAddProductDialog = () => {
    setOpenProductDialog(true);
  };

  const handleDeleteItem = (itemId) => {
    // Implemente aqui a lógica para remover o item da venda pelo seu ID
    console.log("Remover item da venda com ID:", itemId);
  };

  const handleIncrementQuantity = (itemId) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setItems(updatedItems);
  };
  
  const handleDecrementQuantity = (itemId) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item
    );
    setItems(updatedItems);
  };

  const columns = [
    { 
      field: 'productDet._id', 
      headerName: 'Produto', 
      width: 200, 
      valueGetter: (params) => params.row.productDet.name || ''
    },
    { 
      field: 'quantity', 
      headerName: 'Quantidade', 
      width: 120, 
      valueGetter: (params) => params.row.quantity.toFixed(2)
    },
    { 
      field: 'unitPrice', 
      headerName: 'Preço Unitário', 
      width: 160, 
      valueGetter: (params) => params.row.unitPrice.toFixed(2)
    },
    { 
      field: 'discount', 
      headerName: 'Desconto', 
      width: 160,
      valueGetter: (params) => params.row.discount.toFixed(2)
    },
    { 
      field: 'addition', 
      headerName: 'Acréscimo', 
      width: 160,
      valueGetter: (params) => params.row.addition.toFixed(2)
    },
    { 
      field: 'totalPrice', 
      headerName: 'Total', 
      width: 160, 
      valueGetter: (params) => params.row.totalPrice.toFixed(2)
    },
    {
      field: '',
      headerName: 'Ações',
      sortable: false,
      width: 110,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="edit"
            size="small"
            onClick={() => handleDeleteItem(params.row.id)}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => handleDeleteItem(params.row.id)}
          >
            <DeleteIcon fontSize="inherit" />          
          </IconButton>
        </>
      ),
    },
  ];

  const ItemGrid = () => {
    return (
      <div style={{ height: 400, width: "100%", marginTop: "16px" }}>
        <DataGrid
          rows={items}
          columns={columns}
          // components={{
          //   Toolbar: () => (
          //     <Button
          //       variant="outlined"
          //       startIcon={<AddCircleOutline />}
          //       onClick={handleAddItem}
          //     >
          //       Adicionar Item
          //     </Button>
          //   ),
          // }}
          disableColumnMenu
        />
      </div>
    );
  };
  
  const ItemCards = () => {
    return (
     <Box sx={{ marginTop: "8px", maxHeight: "calc(100vh - 370px)", overflow: "auto" }}>
      <Stack sx={{ marginTop: "8px", padding: 0, margin: 0}}>
        {items.map((item) => (
          <Card
            variant="outlined" 
            key={item.id} 
            sx={{ backgroundColor: "#f0f0f0", marginBottom: "4px" }} 
          >
            <CardActions 
              sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                margin: "0px", 
                padding: "4px" 
              }}
            >
              <Typography variant="h6" sx={{ flex: 1 }}>
                {item.productDet.name}
              </Typography>
              <IconButton
                aria-label="delete"
                size="small"
                onClick={() => handleDeleteItem(item.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </CardActions>
            <CardContent 
              sx={{ 
                bgcolor: "white", 
                margin: "0px", 
                padding: "8px" 
              }}
            >
              <Typography sx={{ color: "rgb(25, 118, 210)"}}>
                R$ {item.unitPrice.toFixed(2)}
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                <ButtonGroup size="small" aria-label="small outlined button group">
                  <Button
                    sx={{
                      color: "rgb(235, 235, 235)",
                      bgcolor: "rgb(25, 118, 210)",
                      width: "32px",
                      height: "32px",
                      borderRadius: "4px",
                    }}
                    onClick={() => handleDecrementQuantity(item.id)}
                  >
                    <RemoveIcon fontSize="small" />
                  </Button>
                  <Button
                    sx={{
                      bgColor: "rgb(235, 235, 235)", 
                      width: "32px",
                      height: "32px",
                      borderRadius: "4px",
                      border: "1px solid rgb(25, 118, 210)",
                      fontSize: 17
                    }}
                  >
                    {item.quantity}
                  </Button>
                  <Button
                    sx={{
                      color: "rgb(235, 235, 235)",
                      bgcolor: "rgb(25, 118, 210)",
                      width: "32px",
                      height: "32px",
                      borderRadius: "4px",
                    }}
                    onClick={() => handleIncrementQuantity(item.id)}
                  >
                    <AddIcon fontSize="small" />
                  </Button>
                </ButtonGroup>
                <Typography variant="h6">
                  R$ {(item.quantity * item.unitPrice).toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
    );
  };

  const Totalizer = () => {
    return (
      <></>
    );
  };

  const TotalizerMob = () => {
    const subtotal = sale.subtotal.toFixed(2);
    const discount = sale.discount.toFixed(2);
    const addition = sale.addition.toFixed(2);
    const total = sale.total.toFixed(2);
  
    return (
      <Box
        sx={{
          borderTop: '1px solid #ddd',
          backgroundColor: '#f5f5f5',  // Cor cinza claro de fundo
          position: 'fixed',
          bottom: 0,                  // Alinhado no final da página
          left: 50,
          right: 0,
          display: 'flex',
          flexDirection: 'column',    // Alinhamento vertical
          alignItems: 'flex-start',   // Alinhado à esquerda
          padding: '16px',
          zIndex: 1000,               // Colocado acima de outros elementos
        }}
      >
        <Box sx={{ marginBottom: '4px' }}>
          <Typography variant="subtitle2" color="textSecondary">
            SobTotal: R$ {subtotal}
          </Typography>
        </Box>
        <Box sx={{ marginBottom: '4px' }}>
          <Typography variant="subtitle2" color="textSecondary">
            Desconto: R$ {discount}
          </Typography>
        </Box>
        <Box sx={{ marginBottom: '4px' }}>
          <Typography variant="subtitle2" color="textSecondary">
            Acréscimo: R$ {addition}
          </Typography>
        </Box>
        <Typography variant="h5" style={{ color: 'rgb(25, 118, 210)' }}>
          <span>
            Total:&nbsp; 
          </span>
          <strong>
            R$ {total}
          </strong>
        </Typography>
      </Box>
    );
  };
 
  const DialogAddItem = () => {
    const [products, setProducts] = useState([]); // Estado para armazenar a lista de produtos
    const [tempSearchTerm, setTempSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
      
    const handleSearchButtonClick = async () => {
      try {
        const response = await getProducts(tempSearchTerm); // Substitua pela função que busca produtos na API
        if (response.status === 200) {
          setProducts(response.data); // Atualiza o estado com a lista de produtos
        } else {
          // Trate o caso em que a requisição não foi bem-sucedida
          console.error('Erro ao buscar produtos');
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };
  
    const handleAddSelectedProduct = (product) => {
      console.log(product);
      setSelectedProduct(product); // Armazena o produto selecionado
    };

    const cancelAddProduct = () => {
      setOpenProductDialog(false);
    };
  
    const confirmAddProduct = () => {
      console.log('product', selectedProduct)
      
      if (selectedProduct) {
        const newItem = {
          id: selectedProduct._id,
          productDet: selectedProduct,
          quantity: 1,
          unitPrice: selectedProduct.price,
          discount: 0,
          addition: 0,
          totalPrice: selectedProduct.price,
        };
  
        setItems((prevItems) => [...prevItems, newItem]);
        setOpenProductDialog(false);
      }
    };
  
    return (
      <Dialog 
        open={openProductDialog} 
        onClose={cancelAddProduct}
        scroll="paper"
        maxWidth="md"
      >
        <DialogTitle>Selecione um item:</DialogTitle>
        <DialogContent>
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Buscar Produto"
              value={tempSearchTerm}
              onChange={(e) => setTempSearchTerm(e.target.value)}
              inputProps={{ 'aria-label': 'search products' }}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearchButtonClick}>
              <SearchIcon />
            </IconButton>
          </Paper>
          <Box mt={2} maxHeight="300px" overflow="auto">
            {products.length === 0 ? (
              <Typography variant="body2" align="center">
                Nenhum dado foi encontrado.
              </Typography>
            ) : (
              <List>
                {products.map((product) => (
                  <ListItemButton
                    key={product.id}
                    selected={product === selectedProduct}
                    onClick={() => handleAddSelectedProduct(product)}
                    // onClick={() => confirmAddProduct(product)}
                  >
                    <ListItemText primary={product.name} />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelAddProduct}>
            Cancelar
          </Button>
          <Button onClick={confirmAddProduct} color="primary">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  

  return (
    <Container component="main" maxWidth="xbl">
      <CssBaseline />
      <Title>        
        <h2>Pedido</h2>
        <Stack spacing={1} direction="row-reverse">
          { (editMode && user.role==='admin') && 
            <IconButton 
              aria-label="delete" 
              size="large"
              onClick={handleClickDelete}
            >
              <DeleteIcon fontSize="inherit"/>
            </IconButton>
          }
          <IconButton 
            aria-label="submit"
            type="submit"
            size="large"
          >
            <CheckIcon fontSize="inherit"/>
          </IconButton>
          <IconButton 
            aria-label="cancel" 
            size="large"
            onClick={handleClickCancel}
          >
             <ArrowBackIcon fontSize="inherit"/>
          </IconButton>
        </Stack>
      </Title>
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        autoComplete="off" 
        noValidate 
        sx={{ 
          position: 'relative',
          width: '100%',
          height: '100%',
          flex: 1,
          // mt: 1,
        }}
      >
        <div style={{ width: '100%', height: divHeight }}>  
          <Grid container spacing={2}>
            <Grid item xs={12} md={3} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  sx={{ width: '100%' }}
                  required
                  fullWidth
                  autoFocus
                  id="date"
                  label="Data"
                  name="date"
                  value={parseISO(sale.date)}
                  onChange={(date) => setSale({ ...sale, date: date })}
                  slotProps={{ textField: { variant: 'outlined' } }}
                  // renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={9} sm={12}>
              <FormControl fullWidth>  
                <Autocomplete
                  {...defaultPropsCustomer}
                  id="customer"
                  includeInputInList
                  clearOnEscape
                  isOptionEqualToValue={(option, value) => {
                    // console.log(option.id, value._id)
                    return option.id === value._id
                  }}
                  onChange={(event, element) => {
                    // console.log(element)
                    setSale({...sale, customer: element });
                  }}
                  value={(sale.customer) ? sale.customer : null}
                  renderInput={(params) => (
                    <TextField {...params} 
                      label="Cliente" 
                      // variant="standard" 
                    />
                  )}
                />  
              </FormControl>
            </Grid>            
          </Grid>
          {/* <Typography sx={{ marginTop: "16px" }}>Itens do Pedido</Typography> */}
          {(isMobile) ? <ItemCards/> : <ItemGrid/>}
          <DialogAddItem/>        
        </div>
      </Box>
      {(isMobile) ? <TotalizerMob/> : <Totalizer/>}
      <Fab 
        onClick={() => openAddProductDialog()}
        color="secondary" aria-label="add" 
        sx={{
          position: 'fixed',
          bottom: (theme) => theme.spacing(20),
          right: (theme) => theme.spacing(2),
          opacity: 0.8,
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