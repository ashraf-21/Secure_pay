import { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import SplashScreen from "./components/SplashScreen";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!user) {
    return showSignup
      ? <Signup onSuccess={setUser} onSwitch={() => setShowSignup(false)} />
      : <Login onSuccess={setUser} onSwitch={() => setShowSignup(true)} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;