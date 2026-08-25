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
import BmsLogin from './pages/bms/BmsLogin.jsx';
import BmsLayout from './pages/bms/BmsLayout.jsx';
import BmsLedger from './pages/bms/BmsLedger.jsx';
import BmsOfficeExpenses from './pages/bms/BmsOfficeExpenses.jsx';
import BmsBuses from './pages/bms/BmsBuses.jsx';
import BmsRoutes from './pages/bms/BmsRoutes.jsx';
import BmsOffline from './pages/bms/BmsOffline.jsx';
import BmsOffices from './pages/bms/BmsOffices.jsx';
import BmsAgents from './pages/bms/BmsAgents.jsx';

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
        <Route path="/bmsadmin/login" element={<BmsLogin />} />
        <Route path="/bmsadmin" element={<BmsLayout />}>
          <Route index element={<BmsLedger />} />
          <Route path="office-expenses" element={<BmsOfficeExpenses />} />
          <Route path="buses" element={<BmsBuses />} />
          <Route path="routes" element={<BmsRoutes />} />
          <Route path="offline" element={<BmsOffline />} />
          <Route path="offices" element={<BmsOffices />} />
          <Route path="agents" element={<BmsAgents />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
