// Import necessary React and ReactDOM modules
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import ErrorPage component from './error-page'
import ErrorPage from './error-page';

// Import Contact component along with its loader and action functions
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from './routes/contact';

// Import Root component along with its loader and action functions
import Root, { 
  loader as rootLoader,
  action as rootAction,
 } from "./routes/root";

// Import createBrowserRouter and RouterProvider from 'react-router-dom'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Import styles from './index.css'
import "./index.css";

// Import EditContact component along with its action function
import EditContact, {
  action as editAction,
} from './routes/edit';

// Import Index component
import Index from './routes/index';

// Import destroyAction from './routes/destroy'
import { action as destroyAction } from "./routes/destroy";

// Create a browser router with specified routes and components
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    action: rootAction,
    errorElement: <ErrorPage />,

    // Nested routes within the Root component
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index /> },

          // Route for displaying a contact's details
          {
            path: "contacts/:contactId",
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },

          // Route for editing a contact
          {
            path: "contacts/:contactId/edit",
            element: <EditContact />,
            loader: contactLoader,
            action: editAction,
          },

          // Route for destroying a contact
          {
            path: "contacts/:contactId/destroy",
            action: destroyAction,
          },
        ],
      }
    ],
  },
]);

// Render the application with the router using React.StrictMode
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>  
    <RouterProvider router={router} />
  </React.StrictMode> 
);
