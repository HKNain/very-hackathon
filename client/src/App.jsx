import React from "react";
import { Toaster } from 'react-hot-toast';
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import About from "./pages/About";

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
      <Toaster 
        position="top-middle"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#fff',
            color: 'black',
          },
        }}
      />
    </>
  );
};

export default App;
