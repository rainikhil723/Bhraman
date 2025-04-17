// src/utils/auth.js

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("currentUser"));
  };
  
  export const isAuthenticated = () => {
    return getCurrentUser() !== null;
  };
  
  export const logout = () => {
    localStorage.removeItem("currentUser");
  };
  