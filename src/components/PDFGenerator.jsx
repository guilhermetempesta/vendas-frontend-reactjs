import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatDatePtBr } from "../commons/utils";

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
  tableCellNumber: {
    flex: 1,
    padding: 4,
    borderRightColor: "#000",
    borderRightWidth: 1,
    fontSize: 10,
    textAlign: "right",
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
  subtitle: {
    textAlign: "left",
    fontSize: 10,
    marginBottom: 5,
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
  },
  totalSales: {
    flex: 1,
    padding: 4,
    fontSize: 10,
    textAlign: "right",
  },
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const totalSales = (data) => {
  return data.reduce((total, item) => total + item.total, 0);
};

const SalesToPDF = ({data}) => {
  return (
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
          <Text style={{ ...styles.tableCell, ...styles.tableHeader, flex: 3 }}>
            Vendedor
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
            <Text style={{ ...styles.tableCell, flex: 3 }}>
              {item.user.name}
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
        <Text style={styles.totalSales}>{formatCurrency(totalSales(data))}</Text>
      </View>
    </View>
  )
}

const CanceledSalesToPDF = ({data}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Relatório de Vendas Canceladas</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={{ ...styles.tableCell, ...styles.tableHeader }}>
            Código
          </Text>
          <Text style={{ ...styles.tableCell, ...styles.tableHeader }}>
            Cancelada em
          </Text>
          <Text style={{ ...styles.tableCell, ...styles.tableHeader, flex: 3 }}>
            Cliente
          </Text>
          <Text style={{ ...styles.tableCell, ...styles.tableHeader, flex: 3 }}>
            Vendedor
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
            <Text style={styles.tableCell}>{formatDatePtBr(item.deletedAt)}</Text>
            <Text style={{ ...styles.tableCell, flex: 3 }}>
              {item.customer.name}
            </Text>
            <Text style={{ ...styles.tableCell, flex: 3 }}>
              {item.user.name}
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
        <Text style={styles.totalSales}>{formatCurrency(totalSales(data))}</Text>
      </View>
    </View>
  )
}

const ComissionsToPDF = ({ data }) => {
  const totalSales = data.reduce((total, item) => total + item.totalSales, 0);
  const totalComission = data.reduce((total, item) => total + item.totalComission, 0);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Relatório de Comissões</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={{ ...styles.tableCell, flex: 3, ...styles.tableHeader }}>
            Vendedor
          </Text>
          <Text style={{ ...styles.tableCell, ...styles.tableHeader }}>
            Total Vendas (R$)
          </Text>
          <Text style={{ ...styles.tableCell, ...styles.tableHeader }}>
            Total Comissões (R$)
          </Text>
        </View>
        {data.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={{ ...styles.tableCell, flex: 3 }}>
              {item.user.name}
            </Text>
            <Text style={styles.tableCell}>{formatCurrency(item.totalSales)}</Text>
            <Text style={styles.tableCell}>{formatCurrency(item.totalComission)}</Text>
          </View>
        ))}
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalSales}>{formatCurrency(totalSales)}</Text>
        <Text style={styles.totalSales}>{formatCurrency(totalComission)}</Text>
      </View>
    </View>
  );
};

const ProductsToPDF = ({ data, subtitle }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Relatório de Produtos/Lucros</Text>
      <Text style={styles.subtitle}>Período: {subtitle}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={{ ...styles.tableCell, flex: 3, ...styles.tableHeader }}>
            Produto
          </Text>
          <Text style={{ ...styles.tableCellNumber, ...styles.tableHeader }}>
            Quantidade
          </Text>
          <Text style={{ ...styles.tableCellNumber, ...styles.tableHeader }}>
            Total Vendas (R$)
          </Text>
          <Text style={{ ...styles.tableCellNumber, ...styles.tableHeader }}>
            Total Custo (R$)
          </Text>
          <Text style={{ ...styles.tableCellNumber, ...styles.tableHeader }}>
            Resultado (R$)
          </Text>
          <Text style={{ ...styles.tableCellNumber, ...styles.tableHeader }}>
            Lucro (%)
          </Text>
        </View>
        {data.products.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={{ ...styles.tableCell, flex: 3 }}>
              {item.name}
            </Text>
            <Text style={styles.tableCellNumber}>{item.soldAmount}</Text>
            <Text style={styles.tableCellNumber}>{item.totalSales.toFixed(2).replace(".",",")}</Text>
            <Text style={styles.tableCellNumber}>{item.totalCost.toFixed(2).replace(".",",")}</Text>
            <Text style={styles.tableCellNumber}>{item.resultValue.toFixed(2).replace(".",",")}</Text>
            <Text style={styles.tableCellNumber}>{item.resultPercent.toFixed(2).replace(".",",")}</Text>
          </View>
        ))}
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}></Text>
        <Text style={styles.totalSales}>{data.summary.totalSales.toFixed(2).replace(".",",")}</Text>
        <Text style={styles.totalSales}>{data.summary.totalCost.toFixed(2).replace(".",",")}</Text>
        <Text style={styles.totalSales}>{data.summary.resultValue.toFixed(2).replace(".",",")}</Text>
        <Text style={styles.totalSales}>{data.summary.resultPercent.toFixed(2).replace(".",",")} %</Text>
      </View>
    </View>
  );
};

export default function PDFGenerator ({ data, type, subtitle }) {
  console.log(data, type);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {(type==='sales') && <SalesToPDF data={data}/>}             
        {(type==='canceledSales') && <CanceledSalesToPDF data={data}/>}             
        {(type==='comissions') && <ComissionsToPDF data={data}/>}             
        {(type==='products') && <ProductsToPDF data={data} subtitle={subtitle}/>}             
      </Page>
    </Document>
  );
};
