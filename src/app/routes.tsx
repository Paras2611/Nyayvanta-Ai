import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { AssistantPage } from '../pages/AssistantPage';
import { DocumentAnalysisPage } from '../pages/DocumentAnalysisPage';
import { CaseAnalysisPage } from '../pages/CaseAnalysisPage';
import { SettingsPage } from '../pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/ask', element: <AssistantPage /> },
      { path: '/cases/:id/assistant', element: <AssistantPage /> },
      { path: '/documents', element: <DocumentAnalysisPage /> },
      { path: '/cases/:id/analysis', element: <CaseAnalysisPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
]);
