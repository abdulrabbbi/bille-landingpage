import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../components/layouts/AdminLayout.jsx";
import Settings from "../modules/settings";
import { PATHS } from "./paths";
import Loading from "../components/Loading.jsx";

const Dashboard = lazy(() => import("../modules/dashboard/Dashboard.jsx"));
const Users = lazy(() => import("../modules/people-access/pages/Users.jsx"));
const Roles = lazy(() => import("../modules/people-access/pages/Roles.jsx"));
const Plans = lazy(() => import("../modules/monetization/pages/Plans.jsx"));
const Coupons = lazy(() => import("../modules/monetization/pages/Coupons.jsx"));
const Integrations = lazy(() =>
  import("../modules/integrations/pages/Integrations.jsx")
);
const Webhooks = lazy(() =>
  import("../modules/integrations/pages/Webhooks.jsx")
);
const Login = lazy(() => import("../modules/auth/login.jsx"));

// AI Recipes (register route) — import the page component directly
const AIRecipes = lazy(() => import("../modules/ai-recipes/pages/Prompts.jsx"));

const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: PATHS.DASHBOARD.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        ),
      },

      // People & Access
      {
        path: PATHS.PEOPLE.USERS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <Users />
          </Suspense>
        ),
      },
      {
        path: PATHS.PEOPLE.ROLES.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <Roles />
          </Suspense>
        ),
      },

      // Monetization
      {
        path: PATHS.BILLING.PLANS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <Plans />
          </Suspense>
        ),
      },
      {
        path: PATHS.BILLING.COUPONS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <Coupons />
          </Suspense>
        ),
      },

      // Integrations
      {
        path: PATHS.INTEGRATIONS.ROOT.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <Integrations />
          </Suspense>
        ),
      },
      {
        path: PATHS.INTEGRATIONS.WEBHOOKS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <Webhooks />
          </Suspense>
        ),
      },

      // AI Recipes
      {
        path: PATHS.AI.RECIPES.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <AIRecipes />
          </Suspense>
        ),
      },

      // Settings
      {
        path: PATHS.SETTINGS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <Settings />
          </Suspense>
        ),
      },
    ],
  },

  // Auth (public)
  {
    path: PATHS.AUTH.LOGIN,
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },

  // 404
  {
    path: "*",
    element: (
      <div className="page">
        <div className="card p-8">Not Found</div>
      </div>
    ),
  },
]);

export default router;
