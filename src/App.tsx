import React from 'react';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {Exercise1} from "./pages/exercise1";
import {Exercise2} from "./pages/exercise2";
import './App.css';

export const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: 'exercise1',
      element: <Exercise1/>
    },
    {
      path: 'exercise2',
      element: <Exercise2/>
    },
    {
      path: '/',
      element: <Navigate to="/exercise1" replace/>
    },
  ]);

  return <RouterProvider router={router}/>
}
