import React from "react";
import { Toaster } from 'react-hot-toast';
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Achievements from "./components/ui/Achievements";
import Profile from "./components/ui/Profile";

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/achievements" element={<Achievements />} />
      <Route path="/profile" element={<Profile />} />
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
