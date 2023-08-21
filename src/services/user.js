import { api } from './api'

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response;
  } catch(error) {
    if (!error.response) {
      return { networkError: 'Erro de conexão.'}
    } else {
      return error.response;
    }
  } 
}

export const getUser = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const addUser = async (user) => {
  try {
    delete user.id;
    const response = await api.post(`/users`, user);
    return response;
  } catch(error) {
    console.log(error);
    return error.response;
  } 
}

export const editUser = async (user) => {
  try {
    const response = await api.put(`/users/${user.id}`, user);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const deleteUser = async(id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response;
  } catch(error) {
    return error.response;
  }
}

export const sendVerificationEmail = async(email) => {
  try {
    const response = await api.post(`/send-verification-email`, {email});
    return response;
  } catch(error) {
    return error.response;
  }
}