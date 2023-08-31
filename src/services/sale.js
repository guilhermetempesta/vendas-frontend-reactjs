import { api } from './api'

export const getSales = async () => {
  try {
    const response = await api.get('/sales');
    return response;
  } catch(error) {
    if (!error.response) {
      return { networkError: 'Erro de conexão.'}
    } else {
      return error.response;
    }
  } 
}

export const getSale = async (id) => {
  try {
    const response = await api.get(`/sales/${id}`);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const addSale = async (sale) => {
  try {
    delete sale.id;
    const response = await api.post(`/sales`, sale);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const editSale = async (sale) => {
  try {
    const response = await api.put(`/sales/${sale.id}`, sale);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const deleteSale = async(id) => {
  try {
    const response = await api.delete(`/sales/${id}`);
    return response;
  } catch(error) {
    return error.response;
  }
}
