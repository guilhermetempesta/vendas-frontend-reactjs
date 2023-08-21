import { Buffer } from 'buffer';
import { api } from '../services/api'

export const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1]; // token you get
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decodedToken = JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
    return decodedToken;
  } catch (e) {
    return null;
  }
};

export const tokenExpired = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    const decodedJwt = parseJwt(accessToken);
    return (decodedJwt.exp * 1000 < Date.now()) 
  } else {
    return true 
  }    
};

export const clearUserData = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  api.defaults.headers.Authorization = null;        
};
