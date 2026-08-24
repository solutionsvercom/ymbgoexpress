import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import LeadsPage from './pages/admin/LeadsPage.jsx';
import BookingsPage from './pages/admin/BookingsPage.jsx';
import RoutesPage from './pages/admin/RoutesPage.jsx';
import SchedulesPage from './pages/admin/SchedulesPage.jsx';
import TrackingPage from './pages/admin/TrackingPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="schedules" element={<SchedulesPage />} />
          <Route path="tracking" element={<TrackingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
