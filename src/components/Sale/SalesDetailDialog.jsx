import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

const SalesDetailDialog = ({ open, onClose, selectedSale }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Detalhes da Venda</DialogTitle>
      {selectedSale && (
        <DialogContent>
          <div style={{ maxHeight: '400px', overflowX: 'auto' }}>
            <Typography variant="h6">Código: {selectedSale.code}</Typography>
            <Typography variant="body1">Data: {selectedSale.date}</Typography>
            <Typography variant="body1">Cliente: {selectedSale.customer.name}</Typography>
            <Typography variant="body1">Valor Total (R$): {selectedSale.total}</Typography>

            <Typography variant="h6" style={{ marginTop: '16px' }}>
              Itens da Venda:
            </Typography>

            <Table size="small" aria-label="itens-venda">
              <TableHead>
                <TableRow>
                  <TableCell>Produto</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="right">Vlr. Unit.</TableCell>
                  <TableCell align="right">Desconto</TableCell>
                  <TableCell align="right">Acréscimo</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedSale.items.map((item) => (
                  <TableRow key={item.product._id}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">{item.unitPrice}</TableCell>
                    <TableCell align="right">{item.discount}</TableCell>
                    <TableCell align="right">{item.addition}</TableCell>
                    <TableCell align="right">{item.totalPrice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SalesDetailDialog;