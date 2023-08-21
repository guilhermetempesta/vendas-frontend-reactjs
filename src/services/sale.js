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

export const addSale = async (user) => {
  try {
    delete user.id;
    const response = await api.post(`/sales`, user);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const editSale = async (user) => {
  try {
    const response = await api.put(`/sales/${user.id}`, user);
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
