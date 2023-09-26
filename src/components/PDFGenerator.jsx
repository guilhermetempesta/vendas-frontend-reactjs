import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { formatDatePtBr } from "../commons/utils";

const PDFGenerator = ({ data }) => {
  console.log(data);

  // Função para formatar um número como moeda brasileira (R$)
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Calcula o total dos valores da tabela
  const totalValue = data.reduce(
    (total, item) => total + item.total,
    0
  );

  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "white",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    table: {
      width: "100%",
      marginVertical: 10,
      border: "1 solid #000",
    },
    tableRow: {
      flexDirection: "row",
      borderBottomColor: "#000",
      borderBottomWidth: 1,
      alignItems: "center",
      minHeight: 24,
    },
    tableCell: {
      flex: 1,
      padding: 4,
      borderRightColor: "#000",
      borderRightWidth: 1,
      fontSize: 10,
    },
    tableHeader: {
      backgroundColor: "#e0e0e0",
      fontWeight: "bold",
    },
    title: {
      textAlign: "center",
      fontSize: 16,
      marginBottom: 10,
    },
    totalRow: {
      flexDirection: "row",
      borderTopColor: "#000",
      borderTopWidth: 1,
      marginTop: 10,
      paddingTop: 5,
      justifyContent: "flex-end",
    },
    totalLabel: {
      flex: 3,
      fontSize: 12,
      fontWeight: "bold",
      textAlign: "right",
    },
    totalValue: {
      flex: 1,
      fontSize: 12,
      textAlign: "right",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Relatório de Vendas</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={{ ...styles.tableCell, ...styles.tableHeader }}>
                Código
              </Text>
              <Text style={{ ...styles.tableCell, ...styles.tableHeader }}>
                Data
              </Text>
              <Text style={{ ...styles.tableCell, ...styles.tableHeader, flex: 3 }}>
                Cliente
              </Text>
              <Text
                style={{
                  ...styles.tableCell,
                  ...styles.tableHeader,
                  borderRightWidth: 0,
                }}
              >
                Valor (R$)
              </Text>
            </View>
            {data.map((item) => (
              <View key={item.code} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.code}</Text>
                <Text style={styles.tableCell}>{formatDatePtBr(item.date)}</Text>
                <Text style={{ ...styles.tableCell, flex: 3 }}>
                  {item.customer.name}
                </Text>
                <Text
                  style={{
                    ...styles.tableCell,
                    borderRightWidth: 0,
                  }}
                >
                  {formatCurrency(item.total)}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalValue)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PDFGenerator;