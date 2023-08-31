import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { clearUserData } from "../commons/authVerify";
import { api } from '../services/api'
// import { apiLogin, apiLogout, apiResetPassword, apiValidateToken } from '../services/auth'
import { apiLogin, apiResetPassword } from '../services/auth'
import { CartContext } from "./cart";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);
  
  const [user, setUser] = useState(null);  
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const recoveredUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken'); 
    if (recoveredUser && accessToken) {
      setUser(JSON.parse(recoveredUser));
      api.defaults.headers.Authorization = `Bearer ${accessToken}`;
    }
    setLoading(false);
  }, []);

  // const validateToken = async () => {
  //   const token = localStorage.getItem("accessToken");
  //   const response = await apiValidateToken(token);
  //   return response.data;    
  // }

  const login = async (email, password) => {
    const response = await apiLogin(email, password);
    console.log(response)
    if (response.status === 200) {
      const loggedUser = response.data.user;
      const accessToken = response.data.token;
      const refreshToken = response.data.refreshToken;
      localStorage.setItem('user', JSON.stringify(loggedUser));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      api.defaults.headers.Authorization = `Bearer ${accessToken}`;      
      setUser(loggedUser);
      setErrorMessage(null);
      navigate("/");
    } else {
      setErrorMessage(response.data.message);
    }        
  };
    
  const logout = async () => {
    // const tokenIsValid = await validateToken();
    // if (tokenIsValid) {
      // const refreshToken = localStorage.getItem("refreshToken");
      // await apiLogout(refreshToken);      
    // }
    clearUserData();
    clearCart(); 
    setUser(null);
    setErrorMessage(null);
    navigate("/login");
  }
  
  const resetPassword = async (email) => {
    const response = await apiResetPassword(email);
    if (response.status === 200) {
      setSuccessMessage(response.data.message);
      setErrorMessage(null);
    } else {
      setSuccessMessage(null);
      setErrorMessage(response.data.message);
    }
  }

  return (
    <AuthContext.Provider 
      value={{ authenticated: !!user, user, setUser, loading, setLoading, errorMessage, successMessage, 
        login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>   
  );
};