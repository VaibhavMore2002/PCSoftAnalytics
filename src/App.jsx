import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home.jsx";
import DashboardList from "./DashboardList.jsx";
import Dashboard from "./analitics.jsx";
import Settings from "./Settings.jsx";
import DataSources from "./DataSources.jsx";
import DataSourceDetail from "./DataSourceDetail.jsx";
import DataSourceForm from "./DataSourceForm.jsx";
import TableDetail from "./TableDetail.jsx";
import DataSets from "./DataSets.jsx";
import DataSetDetail from "./DataSetDetail.jsx";
import DataSetEditor from "./DataSetEditor.jsx";
import DataSetDefinition from "./qr.jsx";
import Login from "./Login.jsx";
import UserProfile from "./UserProfile.jsx";
import Reports from "./Reports.jsx";
import ReportDetail from "./ReportDetail.jsx";
import { ThemeProvider } from "./ThemeContext.jsx";
import { AppProvider } from "./AppContext.jsx";
import { AuthProvider, useAuth } from "./AuthContext.jsx";

function ProtectedRoutes() {
  const auth = useAuth();
  if (!auth?.isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <AppProvider>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboards" element={<DashboardList />} />
        <Route path="/dashboards/:id" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/datasources" element={<DataSources />} />
        <Route path="/datasources/new" element={<DataSourceForm />} />
        <Route path="/datasources/:id" element={<DataSourceDetail />} />
        <Route path="/datasources/:id/edit" element={<DataSourceForm />} />
        <Route path="/datasources/:id/tables/:schema/:tableName" element={<TableDetail />} />
        <Route path="/datasets" element={<DataSets />} />
        <Route path="/datasets/:id" element={<DataSetDetail />} />
        <Route path="/datasets/:id/definition" element={<DataSetDefinition />} />
        <Route path="/datasets/:id/edit" element={<DataSetDefinition />} />
        <Route path="/datasets/new" element={<DataSetEditor />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/:id" element={<ReportDetail />} />
      </Routes>
    </AppProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginGuard />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

function LoginGuard() {
  const auth = useAuth();
  if (auth?.isAuthenticated) return <Navigate to="/" replace />;
  return <Login />;
}

export default App;
