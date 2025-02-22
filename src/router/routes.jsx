import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home/Home";

import Registration from "../pages/authentication/Registration/Registration";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
    children: [
      {
        path: "/register",
        element: <Registration></Registration>,
      },
    ],
  },
]);
