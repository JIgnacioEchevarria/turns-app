import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import './App.css'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { HomePage } from './pages/Home'
import { LoginPage } from './pages/Login'
import { RegistrationPage } from './pages/Registration'
import { MyAccountPage } from './pages/MyAccount'
import { ProtectedRoute, ProtectedRouteAdmin, ProtectedRouteAdminOrEmployee } from './components/ProtectedRoutes'
import { EditPasswordPage, EditProfilePage } from './pages/EditUser'
import { NotFoundPage } from './pages/NotFound'
import { ServicesPage, CalendarPage, TurnsPage, UsersPage } from './pages/Asministration'
import { ScrollToTop } from './components/ScrollToTop'

function App () {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/registration' element={<RegistrationPage />} />
          <Route path='/account/profile' element={
            <ProtectedRoute>
              <MyAccountPage />
            </ProtectedRoute>
          } />
          <Route path='/account/my-turns' element={
            <ProtectedRoute>
              <MyAccountPage />
            </ProtectedRoute>
          } />
          <Route path='/account/edit-password' element={
            <ProtectedRoute>
              <EditPasswordPage />
            </ProtectedRoute>
          } />
          <Route path='/account/edit-profile' element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          } />
          <Route path='/administration/turns' element={
            <ProtectedRouteAdminOrEmployee>
              <TurnsPage />
            </ProtectedRouteAdminOrEmployee>
          } />
          <Route path='/administration/services' element={
            <ProtectedRouteAdminOrEmployee>
              <ServicesPage />
            </ProtectedRouteAdminOrEmployee>
          } />
          <Route path='/administration/users' element={
            <ProtectedRouteAdminOrEmployee>
              <UsersPage />
            </ProtectedRouteAdminOrEmployee>
          } />
          <Route path='/administration/calendar' element={
            <ProtectedRouteAdmin>
              <CalendarPage />
            </ProtectedRouteAdmin>
          } />
          <Route path='/not-found' element={<NotFoundPage />} />
          <Route path='*' element={<Navigate to={'/not-found'} />} />
        </Routes>
        <Footer />
      </>
    </LocalizationProvider>
  )
}

export default App
