import React, { createContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Criar o contexto do carrinho
export const CartContext = createContext();

// Provedor do contexto do carrinho
export const CartProvider = ({ children }) => {
  const storedCartItems = localStorage.getItem('cartItems');
  const initialCartItems = storedCartItems ? JSON.parse(storedCartItems) : [];

  const [cartItems, setCartItems] = useState(initialCartItems);
  
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItemToCart = (item) => {
    const newItem = { ...item, cartItemId: uuidv4() }; // Adicionar um identificador único ao item
    setCartItems((prevCartItems) => [...prevCartItems, newItem]);
    // setCartItems((prevCartItems) => [...prevCartItems, item]);
  };

  const changeItemQuantity = (cartItemId, newQuantity) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.cartItemId === cartItemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  const removeItemFromCart = (cartItemId) => {
    const updatedCartItems = cartItems.filter(item => item.cartItemId !== cartItemId);
    setCartItems(updatedCartItems);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addItemToCart,
        clearCart,
        changeItemQuantity,
        removeItemFromCart,
        getCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};