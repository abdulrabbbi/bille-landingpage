import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { PATHS } from "./paths";
import Loading from "../components/Loading";

// Lazy imports for primary pages
const Dashboard = lazy(() => import("../modules/dashboard/Dashboard.jsx"));

/* Integrations */
const PartnersList = lazy(() =>
  import("../modules/integrations/partners/List.jsx")
);
const MenuSync = lazy(() => import("../modules/integrations/menus/Sync.jsx"));
const DeliveryFeed = lazy(() =>
  import("../modules/integrations/orders/Feed.jsx")
);
const WebhookLogs = lazy(() =>
  import("../modules/integrations/webhooks/Logs.jsx")
);

/* Hardware */
const HardwareHealth = lazy(() =>
  import("../modules/hardware/health/Overview.jsx")
);
const TerminalsList = lazy(() =>
  import("../modules/hardware/terminals/List.jsx")
);
const PrintersList = lazy(() =>
  import("../modules/hardware/printers/List.jsx")
);

/* Sales */
const OrdersList = lazy(() => import("../modules/sales/orders/List.jsx"));
const PaymentSessions = lazy(() =>
  import("../modules/sales/payments/Sessions.jsx")
);
const TablesBoard = lazy(() => import("../modules/sales/tables/Board.jsx"));

/* Biz catalog */
const BusinessesList = lazy(() =>
  import("../modules/biz-catalog/businesses/List.jsx")
);
const LocationsList = lazy(() =>
  import("../modules/biz-catalog/locations/List.jsx")
);
const AreasTablesEditor = lazy(() =>
  import("../modules/biz-catalog/locations/AreasTablesEditor.jsx")
);
const CategoriesList = lazy(() =>
  import("../modules/biz-catalog/categories/List.jsx")
);
const ItemsList = lazy(() => import("../modules/biz-catalog/items/List.jsx"));
const MenusBuilder = lazy(() =>
  import("../modules/biz-catalog/menus/Builder.jsx")
);
const DiscountsList = lazy(() =>
  import("../modules/biz-catalog/discounts/List.jsx")
);

/* IAM */
const UsersList = lazy(() => import("../modules/iam/users/UsersList.jsx"));
const InvitesList = lazy(() =>
  import("../modules/iam/invites/InvitesList.jsx")
);
const RolesPage = lazy(() => import("../modules/iam/roles/RolesPage.jsx"));
const PoliciesPage = lazy(() =>
  import("../modules/iam/policies/PoliciesPage.jsx")
);

/* Settings & Auth */
const Settings = lazy(() => import("../modules/settings/Settings.jsx"));
const Login = lazy(() => import("../modules/auth/login.jsx"));

const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    element: <AdminLayout />,
    children: [
      // Dashboard as landing page at "/"
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        ),
      },

      // Dashboard explicit path
      {
        path: PATHS.DASHBOARD.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        ),
      },

      // Analytics
      {
        path: PATHS.ANALYTICS_TRANSACTIONS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard /> {/* swap in TransactionsList if separate view */}
          </Suspense>
        ),
      },

      // Integrations
      {
        path: PATHS.INTEGRATIONS_PARTNERS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <PartnersList />
          </Suspense>
        ),
      },
      {
        path: PATHS.INTEGRATIONS_MENU_SYNC.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <MenuSync />
          </Suspense>
        ),
      },
      {
        path: PATHS.INTEGRATIONS_FEED.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <DeliveryFeed />
          </Suspense>
        ),
      },
      {
        path: PATHS.INTEGRATIONS_WEBHOOKS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <WebhookLogs />
          </Suspense>
        ),
      },

      // Hardware
      {
        path: PATHS.HARDWARE_HEALTH.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <HardwareHealth />
          </Suspense>
        ),
      },
      {
        path: PATHS.HARDWARE_TERMINALS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <TerminalsList />
          </Suspense>
        ),
      },
      {
        path: PATHS.HARDWARE_PRINTERS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <PrintersList />
          </Suspense>
        ),
      },

      // Sales
      {
        path: PATHS.SALES_ORDERS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <OrdersList />
          </Suspense>
        ),
      },
      {
        path: PATHS.SALES_PAYMENTS_SESSIONS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <PaymentSessions />
          </Suspense>
        ),
      },
      {
        path: PATHS.SALES_TABLES.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <TablesBoard />
          </Suspense>
        ),
      },

      // Biz catalog
      {
        path: PATHS.BIZ_BUSINESSES.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <BusinessesList />
          </Suspense>
        ),
      },
      {
        path: PATHS.BIZ_LOCATIONS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <LocationsList />
          </Suspense>
        ),
      },
      {
        path: PATHS.BIZ_AREAS_TABLES.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <AreasTablesEditor />
          </Suspense>
        ),
      },
      {
        path: PATHS.BIZ_CATEGORIES.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <CategoriesList />
          </Suspense>
        ),
      },
      {
        path: PATHS.BIZ_ITEMS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <ItemsList />
          </Suspense>
        ),
      },
      {
        path: PATHS.BIZ_MENUS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <MenusBuilder />
          </Suspense>
        ),
      },
      {
        path: PATHS.BIZ_DISCOUNTS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <DiscountsList />
          </Suspense>
        ),
      },

      // IAM
      {
        path: PATHS.IAM_USERS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <UsersList />
          </Suspense>
        ),
      },
      {
        path: PATHS.IAM_INVITES.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <InvitesList />
          </Suspense>
        ),
      },
      {
        path: PATHS.IAM_ROLES.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <RolesPage />
          </Suspense>
        ),
      },
      {
        path: PATHS.IAM_POLICIES.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <PoliciesPage />
          </Suspense>
        ),
      },

      // Settings & Auth
      {
        path: PATHS.SETTINGS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: PATHS.AUTH_LOGIN.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        ),
      },
    ],
  },
  { path: "*", element: <div className="card p-8">Not Found</div> },
]);

export default router;
