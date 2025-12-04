import { useState } from 'react'
import HomePage from './pages/HomePage/HomePage'
import LandingPage from './pages/LandingPage/LandingPage'
import './App.css'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Login from "@/app/routes/login";
import { loginAction } from './app/routes/login'
import SignUp from './app/routes/sign-up'
import { signupAction } from './app/routes/sign-up'
import ForgotPassword from './app/routes/forgot-password'
import UpdatePassword from './app/routes/update-password'
import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import { loader } from "./app/routes/auth.confirm"
import { protectedLoader } from "./app/routes/protected"
import Page from "./app/routes/auth.error"
import { logoutAction } from './app/routes/logout'

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <Login />, action: loginAction },
  { path: "/sign-up", element: <SignUp />, action: signupAction },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/update-password", element: <UpdatePassword /> },
  { path: "/dashboard", loader: protectedLoader, element: <HomePage /> },
  { path: "/auth/confirm", loader: loader, element: <div>Confirming...</div> },
  { path: "/auth/error", element:<Page /> },
  { path: "/logout", action: logoutAction}


])

export default function App() {




  return (
    <RouterProvider router={router} />
    /*
    <>
      <Routes>
        <Route path="/" element={<LandingPage toSignup={toSignup} toLogin={toLogin}/>}/>
        <Route path="/dashboard" element={<HomePage />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<SignupPage toLogin={toLogin}/>}/>
      </Routes>
    </>*/
  )
}
