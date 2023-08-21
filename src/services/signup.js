import { api } from './api'

export const sendActivationKey = async (data) => {
  try {
    const response = await api.put('/send-activation-key', data);
    return response;
  } catch(error) {
    if (!error.response) {
      return { networkError: 'Erro de conexão.'}
    } else {
      return error.response;
    }
  } 
}

export const signup = async (data) => {
  try {
    const response = await api.post('/signup', data);
    return response;
  } catch(error) {
    return error.response;
  } 
}