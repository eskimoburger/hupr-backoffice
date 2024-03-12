import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout/Layout";
import BeaconPage from "./page/BeaconPage";
import DashboardPage from "./page/DashboardPage";
import Member from "./page/Member";
import { CreateContent, EditContent, ListContent } from "./page/content";
import LoginPage from "./page/LoginPage";
import NotMemberPage from "./page/NotMemberPage";
import WaitPage from "./page/WaitPage";
import { useProvideAuth } from "./hooks";
import { AuthContext } from "./contexts";
import ProtectedRoute from "./components/ProtectedRoute";
import { DetailContent } from "./page/content/detail-content";

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
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: <div>Admin</div>,
      },
      {
        path: "beacon",
        element: (
          <ProtectedRoute>
            <BeaconPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "content",
        children: [
          {
            path: "",
            element: (
              <ProtectedRoute>
                <ListContent />
              </ProtectedRoute>
            ),
          },
          {
            path: "create",
            element: (
              <ProtectedRoute>
                <CreateContent />
              </ProtectedRoute>
            ),
          },
          {
            path: "edit/:id",
            element: (
              <ProtectedRoute>
                <EditContent />
              </ProtectedRoute>
            ),
          },
          {
            path: "detail/:id",
            element: (
              <ProtectedRoute>
                <DetailContent />
              </ProtectedRoute>
            ),
          }
        ],
      },
      {
        path: "member",
        element: (
          <ProtectedRoute>
            <Member />
          </ProtectedRoute>
        ),
      },
      {
        path: "not-member",
        element: <NotMemberPage />,
      },
      {
        path: "wait",
        element: <WaitPage />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
]);

function App() {
  const auth = useProvideAuth();
  return (
    <AuthContext.Provider value={auth}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;
