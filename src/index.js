import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import GameModePage from "./pages/GameModePage";
import HelpAndInfoPage from "./pages/HelpAndInfoPage";
import NormalModePage from "./pages/NormalModePage";
import BlosumModePage from "./pages/BlosumModePage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <WelcomePage/>,
    },
    {
        path: "app",
        element: <NormalModePage/>,
    },
    {
        path: "game",
        element: <GameModePage/>,
    },
    {
        path: "help",
        element: <HelpAndInfoPage/>,
    },
    {
        path: "blosum",
        element: <BlosumModePage/>,
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
