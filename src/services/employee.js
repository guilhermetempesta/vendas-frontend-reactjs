import { api } from './api'

export const getEmployees = async () => {
  try {
    const response = await api.get('/employees');
    return response;
  } catch(error) {
    if (!error.response) {
      return { networkError: 'Erro de conexão.'}
    } else {
      return error.response;
    }
  } 
}

export const getEmployee = async (id) => {
  try {
    const response = await api.get(`/employees/${id}`);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const addEmployee = async (user) => {
  try {
    delete user.id;
    const response = await api.post(`/employees`, user);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const editEmployee = async (user) => {
  try {
    const response = await api.put(`/employees/${user.id}`, user);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const deleteEmployee = async(id) => {
  try {
    const response = await api.delete(`/employees/${id}`);
    return response;
  } catch(error) {
    return error.response;
  }
}
