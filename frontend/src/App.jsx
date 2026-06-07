import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Topbar from './components/layout/Topbar';

const InvoicesPage = lazy(() => import('./pages/InvoicesPage'));
const SummaryPage = lazy(() => import('./pages/SummaryPage'));
const CustomerPage = lazy(() => import('./pages/CustomerPage'));
const CustomersListPage = lazy(() =>
  import('./pages/CustomerPage').then((module) => ({
    default: module.CustomersListPage
  }))
);

function LandingRedirect() {
  window.location.href = '/landing.html';
  return null;
}

function AppShell() {
  return (
    <div className="min-h-screen">
      <Topbar />
      <main>
        <Routes>
          <Route
            path="/"
            element={<LandingRedirect />}
          />
          <Route
            path="/invoices"
            element={
              <Suspense fallback={<div className="page"><div className="skeleton h-8 w-64 mb-8"></div></div>}>
                <InvoicesPage />
              </Suspense>
            }
          />
          <Route
            path="/customers"
            element={
              <Suspense fallback={<div className="page"><div className="skeleton h-8 w-64 mb-8"></div></div>}>
                <CustomersListPage />
              </Suspense>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <Suspense fallback={<div className="page"><div className="skeleton h-8 w-64 mb-8"></div></div>}>
                <CustomerPage />
              </Suspense>
            }
          />
          <Route
            path="/summary"
            element={
              <Suspense fallback={<div className="page"><div className="skeleton h-8 w-64 mb-8"></div></div>}>
                <SummaryPage />
              </Suspense>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
