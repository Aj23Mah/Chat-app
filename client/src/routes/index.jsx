import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
// import CheckEmailPage from "../pages/CheckEmailPage";
// import CheckPasswordPage from "../pages/CheckPasswordPage";
import MessagePage from "../components/MessagePage";
import Home from "../pages/Home";
import AuthLayouts from "../layout";
import ForgerPassword from "../pages/ForgerPassword";
import LoginPage from "../pages/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "register",
        element: <AuthLayouts><RegisterPage /></AuthLayouts>,
      },
      // {
      //   path: "email",
      //   element: <AuthLayouts><CheckEmailPage /></AuthLayouts>,
      // },
      // {
      //   path: "password",
      //   element: <AuthLayouts><CheckPasswordPage /></AuthLayouts>,
      // },
      {
        path: "login",
        element: <AuthLayouts><LoginPage /></AuthLayouts>,
      },
      {
        path: "forget-password",
        element: <AuthLayouts><ForgerPassword /></AuthLayouts>,
      },
      {
        path: "",
        element: <Home />,
        children: [
          {
            path: ":userId",
            element: <MessagePage />,
          },
        ],
      },
    ],
  },
]);

export default router