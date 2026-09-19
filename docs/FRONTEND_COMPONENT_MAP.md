# Nyayavanta: Frontend Component Map

> **Architecture**: React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router v7 + Lucide React  
> **Layout Direction**: "Trustworthy Intelligence" 3-Panel Desktop Shell with Mobile Drawer

---

## 1. Component Hierarchy

```mermaid
graph TD
    App["App Root (main.tsx)"] --> Router["RouterProvider (routes.tsx)"]
    Router --> Shell["DesktopShell (Sidebar | Main | Evidence)"]
    
    Shell --> TopBar["Persistent Legal Disclaimer & Lang Bar"]
    Shell --> Sidebar["Left Navigation Sidebar (Desktop)"]
    Shell --> MobileDrawer["Responsive Mobile Drawer"]
    Shell --> Workspace["Main Workspace Container"]
    Shell --> RightPanel["Evidence & Sources Panel (Collapsible)"]

    Workspace --> P_Dashboard["/dashboard - DashboardPage"]
    Workspace --> P_Chat["/chat - AILegalChatPage"]
    Workspace --> P_LegalSearch["/legal-search - LegalSearchPage"]
    Workspace --> P_CaseSearch["/case-search - CaseSearchPage"]
    Workspace --> P_CaseDetail["/cases/:id - CaseDetailPage"]
    Workspace --> P_Documents["/documents - DocumentAnalyzerPage"]
    Workspace --> P_History["/history - HistoryPage"]
    Workspace --> P_Saved["/saved - SavedResearchPage"]
    Workspace --> P_Profile["/profile - ProfilePage"]
    Workspace --> P_Settings["/settings - SettingsPage"]

    Router --> P_Login["/login - LoginPage"]
    Router --> P_Register["/register - RegisterPage"]
    Router --> P_Forgot["/forgot-password - ForgotPasswordPage"]

    P_Chat --> ChatHistory["Left Session History Column"]
    P_Chat --> ChatArea["Center Chat Thread"]
    P_Chat --> ClarificationCard["ClarificationCard (Structured Question Form)"]
    P_Chat --> AIResponseView["AIResponseView (9 Canonical Sections)"]
    P_Chat --> EvidencePanel["EvidencePanel (Right Column)"]

    EvidencePanel --> ConfCard["ConfidenceCard"]
    EvidencePanel --> VerifBadges["VerificationBadge (VERIFIED / PARTIAL / UNVERIFIED / CONFLICT)"]
    EvidencePanel --> ClaimCard["ClaimVerificationCard"]
    EvidencePanel --> ProvisionCard["LegalProvisionCards"]
    EvidencePanel --> CaseCard["CaseCards"]

    P_Documents --> DocUploader["Document Text / Upload Area"]
    P_Documents --> DocFindings["AnalysisPanel & ClauseCards"]
    P_Documents --> RiskBadge["RiskBadge (LOW / MED / HIGH / CRITICAL)"]

    P_CaseDetail --> Timeline["Procedural Timeline Stepper"]
```

---

## 2. Page & Route Manifest

| Route | Page Component | Key Functionality |
| :--- | :--- | :--- |
| `/dashboard` | `DashboardPage` | Hero search, 4 V1 domain cards, quick actions, recent research & docs. |
| `/chat` | `AILegalChatPage` | 3-panel research workspace, live RAG generation, clarification prompt, evidence panel. |
| `/legal-search` | `LegalSearchPage` | Multi-tab search (All, Acts, Sections, Regulations, Judgments), domain filters. |
| `/case-search` | `CaseSearchPage` | Supreme Court and High Court landmark cases filterable by court & holding. |
| `/cases/:id` | `CaseDetailPage` | Ratio decidendi, case facts, procedural timeline (`Filing -> Hearing -> Interim -> Judgment -> Final`). |
| `/documents` | `DocumentAnalyzerPage` | Document text ingestion, clause enforceability checker, risk assessment. |
| `/history` | `HistoryPage` | Chronological research history grouped by Today, Yesterday, 7 Days, Older. |
| `/saved` | `SavedResearchPage` | Bookmarked provisions and cases with filter tabs and export options. |
| `/profile` | `ProfilePage` | User role, credentials, and verification status. |
| `/settings` | `SettingsPage` | Appearance (Light/Dark/System), Language (EN/HI/MR), Notifications, Privacy. |
| `/login` | `LoginPage` | JWT authentication and session initiation. |
| `/register` | `RegisterPage` | Citizen and Advocate onboarding. |
