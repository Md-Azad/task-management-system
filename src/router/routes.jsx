import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home/Home";

import Registration from "../pages/authentication/Registration/Registration";
import Taskboard from "../pages/Taskboard/Taskboard";
import Login from "../pages/authentication/Login/Login";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Taskboard></Taskboard>
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/register",
        element: <Registration></Registration>,
      },
    ],
  },
]);
