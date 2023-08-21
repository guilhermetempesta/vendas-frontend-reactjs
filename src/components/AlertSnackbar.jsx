import React, { useState, forwardRef, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AlertSnackbar(props) {
  const [open, setOpen] = useState(props.show);

  useEffect(()=>{
    setOpen(props.show);
  }
  ,[props.show])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    props.setShowAlert(false);
  };

  return (
    <Snackbar 
      open={open}
      autoHideDuration={6000} 
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={props.severity} sx={{ width: '100%' }}>
        {props.message}
      </Alert>
    </Snackbar>      
  );
}