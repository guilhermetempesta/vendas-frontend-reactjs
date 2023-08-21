import React, { useContext } from "react";

import { 
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

import { AuthProvider, AuthContext } from "../contexts/auth";
import { clearUserData, tokenExpired } from "../commons/authVerify";

import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import ResetPasswordPage from "../pages/ResetPasswordPage";
import Layout from "../components/Layout";
import UsersPage from "../pages/UsersPage";
import UserPage from "../pages/UserPage";
import TestParagraph1 from "../components/TestParagraph1";
import TestParagraph2 from "../components/TestParagraph2";
import Loading from "../components/Loading";
import ProfilePage from "../pages/ProfilePage";
import ChangePasswordLoggedPage from "../pages/ProfileChangePasswordPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import UserEmailVerifyPage from "../pages/UserEmailVerifyPage";
import SalesPage from "../pages/SalesPage";
import SalePage from "../pages/SalePage";
import ProductsPage from "../pages/ProductsPage";
import ProductPage from "../pages/ProductPage";
import CustomersPage from "../pages/CustomersPage";
import CustomerPage from "../pages/CustomerPage";

const AppRoutes = () => {

  const Private = ({children}) => {
    const { authenticated, loading } = useContext(AuthContext);

    if (loading) {
      return <Loading/>
    }

    if (!authenticated) {
      return <Navigate to="/login" />;
    }

    if (tokenExpired()) {
      clearUserData();
      return <Navigate to="/login" />
    };
    
    return children;
  };

  return(
    <Router>
      <AuthProvider>
        <Routes>
          {/* public routes */}
          <Route exact path="/login" element={<LoginPage/>}/>
          <Route exact path="/reset-password" element={<ResetPasswordPage/>}/>
          <Route exact path="/change-password/:token" element={<ChangePasswordPage/>}/>
          <Route exact path="/verification-email/:token" element={<UserEmailVerifyPage/>}/>
         
          {/* private routes */}
          <Route exact path="/" element={<Private><Layout><HomePage/></Layout></Private>}/>
          <Route exact path="/users" element={<Private><Layout><UsersPage/></Layout></Private>}/>
          <Route exact path="/new-user" element={<Private><Layout><UserPage/></Layout></Private>}/>
          <Route exact path="/user/:id" element={<Private><Layout><UserPage/></Layout></Private>}/>
          <Route exact path="/profile" element={<Private><Layout><ProfilePage/></Layout></Private>}/>
          <Route exact path="/profile/change-password" element={<Private><Layout><ChangePasswordLoggedPage/></Layout></Private>}/>
          <Route exact path="/customers" element={<Private><Layout><CustomersPage/></Layout></Private>}/>
          <Route exact path="/new-customer" element={<Private><Layout><CustomerPage/></Layout></Private>}/>
          <Route exact path="/customer/:id" element={<Private><Layout><CustomerPage/></Layout></Private>}/>
          <Route exact path="/products" element={<Private><Layout><ProductsPage/></Layout></Private>}/>
          <Route exact path="/new-product" element={<Private><Layout><ProductPage/></Layout></Private>}/>
          <Route exact path="/product/:id" element={<Private><Layout><ProductPage/></Layout></Private>}/>
          <Route exact path="/sales" element={<Private><Layout><SalesPage/></Layout></Private>}/>
          <Route exact path="/new-sale" element={<Private><Layout><SalePage/></Layout></Private>}/>
          <Route exact path="/sale/:id" element={<Private><Layout><SalePage/></Layout></Private>}/>
          
          {/* test routes */}
          <Route exact path="/test1" element={<Private><Layout><TestParagraph1/></Layout></Private>}/>
          <Route exact path="/test2" element={<Private><Layout><TestParagraph2/></Layout></Private>}/>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;