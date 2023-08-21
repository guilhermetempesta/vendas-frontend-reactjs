import { api } from './api'

export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response;
  } catch(error) {
    if (!error.response) {
      return { networkError: 'Erro de conexão.'}
    } else {
      return error.response;
    }
  } 
}

export const getProduct = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const addProduct = async (user) => {
  try {
    delete user.id;
    const response = await api.post(`/products`, user);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const editProduct = async (product) => {
  try {
    const response = await api.put(`/products/${product.id}`, product);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const deleteProduct = async(id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response;
  } catch(error) {
    return error.response;
  }
}
