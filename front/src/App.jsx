import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Layout from "./components/Layout";
import Home from "./screens/Home";
import File from "./screens/File";
import Setting from "./screens/Setting";
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";
import AuthProvider from "./contexts/AuthContext";
import TitleProvider from "./contexts/TitleContext";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [{ path: "/login", element: <Login /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          { path: "", element: <Home /> },
          { path: "/files", element: <File /> },
          { path: "/settings", element: <Setting /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <TitleProvider>
        <RouterProvider router={router} />
      </TitleProvider>
    </AuthProvider>
  );
};

export default App;
