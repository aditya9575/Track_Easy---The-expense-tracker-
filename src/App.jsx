import React from 'react';
import './App.css';

import { Routes, Route } from "react-router-dom";

import LoginForm from './components/LoginForm/LoginForm';
import SignupForm from './components/SignupForm/SignupForm';
import ForgotPassword from './components/ForgotPasswordComponent/ForgotPassword';
import HomePage from './components/HomePage/HomePage';
import ExpenseTracker from "./components/ExpenseTracker/ExpenseTracker";
import UserProfile from './components/UserProfileComponent/UserProfile';
import Footer from './components/FooterComponent/Footer';
import Header from './components/HeaderComponent/Header';


const App = () => {

  const token = localStorage.getItem("authToken");
  const isAuthenticated = !!token;

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<SignupForm />} />
          <Route path='/LoginForm' element={<LoginForm />} />
          <Route path='/SignupForm' element={<SignupForm />} />
          <Route path='/ForgotPassword' element={<ForgotPassword />} />

          {isAuthenticated ? (
            <>
              <Route path='/Homepage' element={<HomePage />} />
              <Route path='/ExpenseTracker' element={<ExpenseTracker />} />
              <Route path='/UserProfile' element={<UserProfile />} />
            </>
          ) : (
            <>
              <Route path="*" element={<LoginForm />} />
            </>
          )}
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
