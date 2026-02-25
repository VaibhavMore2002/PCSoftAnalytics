import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import DashboardList from "./DashboardList.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/analytics" element={<Home />} />
      <Route path="/dashboards" element={<DashboardList />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;
