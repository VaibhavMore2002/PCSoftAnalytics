import { createContext, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const NAV_ITEMS = [
  { label: "Home",             icon: "home"     },
  { label: "Data Sources",     icon: "db"       },
  { label: "Data Sets",        icon: "layers"   },
  { label: "Reports",          icon: "report"   },
  { label: "Dashboards",       icon: "dash"     },
  { label: "Analytics Expert", icon: "ai",      aiBadge: true },
  { label: "Questions",        icon: "question" },
];

const PATH_TO_NAV = {
  "/":            "Home",
  "/dashboards":  "Dashboards",
  "/settings":    "Settings",
  "/datasources": "Data Sources",
  "/datasets":    "Data Sets",
  "/profile":     "Profile",
  "/questions":   "Questions",
};

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, logout, api } = useAuth();

  const activeNav = PATH_TO_NAV[location.pathname] ?? "Home";

  const handleNavClick = (label) => {
    if      (label === "Home")         navigate("/");
    else if (label === "Dashboards")   navigate("/dashboards");
    else if (label === "Settings")     navigate("/settings");
    else if (label === "Data Sources") navigate("/datasources");
    else if (label === "Data Sets")    navigate("/datasets");
    else if (label === "Profile")      navigate("/profile");
    else if (label === "Questions")    navigate("/questions");
  };

  // Build display user from API user or fallback
  const user = authUser
    ? {
        name: authUser.full_name || authUser.email || "User",
        initials: getInitials(authUser.full_name || authUser.email || "U"),
        email: authUser.email || "",
        role: authUser.role || "",
      }
    : { name: "User", initials: "U", email: "" };

  return (
    <AppContext.Provider value={{ navItems: NAV_ITEMS, activeNav, handleNavClick, user, logout, api }}>
      {children}
    </AppContext.Provider>
  );
};

function getInitials(name) {
  const parts = name.split(/[\s@.]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0] || "U").slice(0, 2).toUpperCase();
}
