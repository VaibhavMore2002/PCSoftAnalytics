import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import DashboardList from "./DashboardList.jsx";
import Settings from "./Settings.jsx";
import DataSources from "./DataSources.jsx";
import { ThemeProvider } from "./ThemeContext.jsx";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboards" element={<DashboardList />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/datasources" element={<DataSources />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
