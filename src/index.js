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
import HelpPageBlosum from "./pages/help_pages/HelpPageBlosum";
import HelpPageNormal from "./pages/help_pages/HelpPageNormal";
import HelpPageGame from "./pages/help_pages/HelpPageGame";

/**
 * Create a router
 * @type {Router}
 */
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
    {
        path: "helpBlosum",
        element: <HelpPageBlosum/>,
    },
    {
        path: "helpNormal",
        element: <HelpPageNormal/>,
    },
    {
        path: "helpGame",
        element: <HelpPageGame/>,
    },
]);

/**
 * The next lines comes from the documentation of React Router. https://reactrouter.com/en/main/routers/picking-a-router by ©Remix Software, Inc.
 * @type {Root}
 */
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
