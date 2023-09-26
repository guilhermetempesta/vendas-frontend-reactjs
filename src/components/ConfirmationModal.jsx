import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

function ConfirmationModal({ open, onClose, message, isSending }) {
  const handleClose = (confirmed) => {
    if (!isSending) {
      onClose(confirmed);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => handleClose(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: "400px", // Defina o máximo de largura desejado
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 2,
          textAlign: "center",
          position: "relative", // Adicione esta linha para posicionamento relativo
        }}
      >
        {/* Overlay semitransparente enquanto isSending está ativo */}
        {isSending && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Pode ajustar a opacidade conforme necessário
              zIndex: 1,
            }}
          ></div>
        )}

        <Typography
          id="modal-description"
          padding={"5px"}
        >
          {message}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px", // Espaçamento superior
          }}
        >
          <Button
            onClick={() => handleClose(false)}
            color="primary"
            disabled={isSending} // Desabilita o botão enquanto isSending é verdadeiro
          >
            Não
          </Button>
          <Button
            onClick={() => handleClose(true)}
            color="primary"
            disabled={isSending} 
          >
            Sim
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default ConfirmationModal;