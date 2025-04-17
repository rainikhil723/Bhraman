import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("currentUser"));
      setCurrentUser(storedUser);
    };

    fetchUser(); // Initial fetch

    // Listen for login/logout updates from anywhere in app
    window.addEventListener("userChanged", fetchUser);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("userChanged", fetchUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.setItem("isLoggedIn", false);
    setCurrentUser(null);
    window.dispatchEvent(new Event("userChanged")); // Trigger update for all listeners
    navigate("/"); // Redirect to landing page
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">BhramanAI</Link>

      <div className="flex gap-4 items-center">
        
        <Link to="/plan" className="hover:underline">Plan Trip</Link>
        <Link to="/about" className="hover:underline">About</Link>

        {currentUser ? (
          <>
            <span className="hidden sm:inline">
              Welcome, {currentUser.first} {currentUser.last}
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-1 rounded-md hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
