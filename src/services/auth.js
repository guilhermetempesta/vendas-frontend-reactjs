import { api } from '../services/api'

export const apiLogin = async (email, password) => {
  try {
    console.log(email, password)
    const response = await api.post('/login', { email, password });
    console.log(response)
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const apiLogout = async (token) => {
  try {
    const refreshToken = token;
    const response = await api.post('/logout', { refreshToken });
    return response;
  } catch(error) {
    return error.response;
  }
}

export const apiResetPassword = async (email) => {
  try {
    const response = await api.patch('/reset-password', { email });
    return response;
  } catch(error) {
    return error.response;
  }
}

export const apiValidateToken = async (token) => {
  try {
    const accessToken = token;
    const response = await api.post('/validate-token', { accessToken });
    return response;
  } catch(error) {
    return false;
  }  
}

export const reactivateLicense = async (data) => {
  try {
    const response = await api.patch('/reactivate-license', data);
    return response;
  } catch (error) {
    return error.response;
  }
}

export const changePassword = async (data) => {
  try {
    const response = await api.patch('/users/change-password', data);
    return response;
  } catch (error) {
    return error.response;
  }
}

export const verificationEmail = async (token) => {
  try {
    const response = await api.get(`/verification-email/${token}`);
    return response;
  } catch (error) {
    return error.response;
  }
}
