import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Events from '../pages/Events';
import EventDetails from '../pages/EventDetails';
import CreateEvent from '../pages/CreateEvent';
import MyRegistrations from '../pages/MyRegistrations';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import AdminDashboard from '../pages/AdminDashboard';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading message="Verifying session authorization..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      
      {/* Protected Routes */}
      <Route 
        path="/events/create" 
        element={
          <ProtectedRoute allowedRoles={['organizer', 'admin']}>
            <CreateEvent />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/my-registrations" 
        element={
          <ProtectedRoute>
            <MyRegistrations />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Auth Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 404 Fallback */}
      <Route 
        path="*" 
        element={
          <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>404</h1>
            <p style={{ color: 'var(--text-secondary)', margin: '16px 0 24px 0' }}>
              The page you are looking for does not exist.
            </p>
            <a href="/" className="btn btn-primary">Return Home</a>
          </div>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
