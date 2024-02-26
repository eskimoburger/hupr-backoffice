import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout/Layout";
import BeaconPage from "./page/BeaconPage";
import DashboardPage from "./page/DashboardPage";
import { CreateContent, ListContent } from "./page/content";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        path: "",
        element: <DashboardPage />,
      },
      {
        path: "admin",
        element: <div>Admin</div>,
      },
      {
        path: "beacon",
        element: <BeaconPage />,
      },
      {
        path: "content",
        children: [
          {
            path: "",
            element: <ListContent />,
          },
          {
            path: "create",
            element: <CreateContent />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
