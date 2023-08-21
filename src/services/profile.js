import { api } from './api'

export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response;
  } catch(error) {
    if (!error.response) {
      return { networkError: 'Erro de conexão.'}
    } else {
      return error.response;
    }
  } 
}

export const editProfile = async (data) => {
  try {
    const response = await api.patch('/profile', data);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const changePassword = async (data) => {
  try {
    const response = await api.patch('/change-password', data);
    return response;
  } catch (error) {
    return error.response;
  }
}
