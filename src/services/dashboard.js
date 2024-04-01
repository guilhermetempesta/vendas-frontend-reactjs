import { api } from './api'

export const getTotalSalesCurrentMonth = async (onlyCurrentUser) => {
  try {
    let endpoint = (onlyCurrentUser) ? '/total-user-sales-month/' : '/total-sales-month/';
    const response = await api.get(`/dashboard${endpoint}`);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const getSalesLast30Days = async (onlyCurrentUser) => {
  try {
    let endpoint = (onlyCurrentUser) ? '/user-sales-current-month/' : '/sales-current-month/';
    const response = await api.get(`/dashboard${endpoint}`);
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

export const getUserSalesLast30Days = async () => {
  try {
    const response = await api.get(`/dashboard/user-sales-current-month/`);
    return response;
  } catch(error) {
    return error.response;
  } 
}