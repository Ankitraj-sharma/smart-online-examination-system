// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Login          from "./pages/Login";
import Register       from "./pages/Register";
import Home           from "./pages/Home";
import Dashboard      from "./pages/Dashboard";
import Exam           from "./pages/Exam";
import Result         from "./pages/Result";
import Admin          from "./pages/Admin";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/"                element={<Navigate to="/login" />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Student protected */}
        <Route path="/home" element={
          <ProtectedRoute role="student"><Home /></ProtectedRoute>
        }/>
        <Route path="/dashboard" element={
          <ProtectedRoute role="student"><Dashboard /></ProtectedRoute>
        }/>
        <Route path="/exam" element={
          <ProtectedRoute role="student"><Exam /></ProtectedRoute>
        }/>
        <Route path="/result" element={
          <ProtectedRoute role="student"><Result /></ProtectedRoute>
        }/>

        {/* Admin protected */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin"><Admin /></ProtectedRoute>
        }/>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}