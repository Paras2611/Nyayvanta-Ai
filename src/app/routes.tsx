import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DesktopShell } from '../components/layout/DesktopShell';
import { DashboardPage } from '../pages/DashboardPage';
import { AILegalChatPage } from '../pages/AILegalChatPage';
import { LegalSearchPage } from '../pages/LegalSearchPage';
import { CaseSearchPage } from '../pages/CaseSearchPage';
import { CaseDetailPage } from '../pages/CaseDetailPage';
import { DocumentAnalyzerPage } from '../pages/DocumentAnalyzerPage';
import { HistoryPage } from '../pages/HistoryPage';
import { SavedResearchPage } from '../pages/SavedResearchPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SettingsPage } from '../pages/SettingsPage';
import { LoginPage, RegisterPage, ForgotPasswordPage } from '../pages/AuthPages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DesktopShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'chat', element: <AILegalChatPage /> },
      { path: 'legal-search', element: <LegalSearchPage /> },
      { path: 'case-search', element: <CaseSearchPage /> },
      { path: 'cases/:id', element: <CaseDetailPage /> },
      { path: 'documents', element: <DocumentAnalyzerPage /> },
      { path: 'documents/:id', element: <DocumentAnalyzerPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'saved', element: <SavedResearchPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ForgotPasswordPage /> },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);
