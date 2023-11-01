import { api } from './api'

export const getTotalSalesCurrentMonth = async () => {
  try {
    const response = await api.get(`/dashboard/total-sales-month/`);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const getSalesLast30Days = async () => {
  try {
    const response = await api.get(`/dashboard/sales-current-month/`);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const getLastSales = async () => {
  try {
    const response = await api.get(`/dashboard/last-sales/`);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const getSalesByMonth = async () => {
  try {
    const response = await api.get(`/dashboard/sales-by-month/`);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const getSalesBySeller = async () => {
  try {
    const response = await api.get(`/dashboard/sales-by-seller/`);
    return response;
  } catch(error) {
    return error.response;
  } 
}