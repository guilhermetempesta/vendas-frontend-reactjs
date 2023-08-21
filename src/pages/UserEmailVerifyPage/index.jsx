import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { 
  Box, Button, Container, CssBaseline, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle 
} from "@mui/material";

import Footer from "../../components/Footer";
import { verificationEmail } from "../../services/auth";

const theme = createTheme();

export default function UserEmailConfirmationPage () {
  const navigate = useNavigate();
  const { token } = useParams();
  const [message, setMessage] = useState({success: false, text: ''});  
  const [openDialog, setOpenDialog] = useState(false);
  
  useEffect(() => {    
    window.scrollTo(0, 0);
    if (token) {      
      const checkUser = async () => {
        const response = await verificationEmail(token);        
        if (response.status === 200) {
          setMessage({ success: true, text: response.data.message });
        } else {
          setMessage({ success: false, text: response.data.message });
        }
        setOpenDialog(true);
      };        
      checkUser();
    }
  }, [token]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate("/login");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Container component="main" maxWidth="xs">
          <CssBaseline />        
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>{(message.success) ? 'Confirmação de email' : 'Erro'}</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{marginBottom:"15px"}}>                
                {message.text}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Fechar</Button>
            </DialogActions>
          </Dialog>
          </Container>
          <Footer/>
      </Box>
    </ThemeProvider>
  );
};