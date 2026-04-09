import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { Meals } from './pages/Meals';
import { Calendar } from './pages/Calendar';
import { DashboardLayout } from './layout/DashboardLayout';
import { WeekTable } from './pages/WeekTable';
import { Groceries } from './pages/Groceries';
import { Recipes } from './pages/Recipes';
import { RecipeDetails } from './pages/RecipeDetails';
import { PublicRoute } from './components/PublicRoute';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { DefaultRedirects } from './components/DefaultRedirects';

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/signup",
        element: <Signup />
      }
    ]
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DefaultRedirects />
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/meals",
        element: <Meals />
      },
      {
        path: "/calendar",
        element: <Calendar />
      },
      {
        path: "/week-plan",
        element: <WeekTable />
      },
      {
        path: "/groceries",
        element: <Groceries />
      },
      {
        path: "/recipes",
        element: <Recipes />
      },
      {
        path: "/recipes/:id",
        element: <RecipeDetails />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/settings",
        element: <Settings />
      },
      {
        path: "*",
        element: <DefaultRedirects />
      }
    ]
  }
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}
