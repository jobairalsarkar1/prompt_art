// import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  // const [user, setUser] = useState();
  // const login = () => {};
  // const logout = () => {};
  return (
    <header className="header border-b-[0.005rem] font-mono">
      <Link to="/" className="flex items-center gap-2 font-extrabold">
        <span className="px-3 py-1.5 rounded-lg shadow-md text-lg font-bold bg-gradient-to-r from-sky-400 to-blue-600 text-transparent bg-clip-text">
          PA
        </span>
        <p className="text-lg bg-gradient-to-l to-sky-400 from-blue-500 text-transparent bg-clip-text">
          PromptArt
        </p>
      </Link>
      <nav className="flex items-center justify-center gap-7">
        <Link to="/store">Store</Link>
        {/* {user ? (
          <div className="flex items-center gap-3">
            <img
              src={user.profilePicture || "https://via.placeholder.com/40"}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <button
              className="px-3.5 py-2 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600"
              onClick={logout}
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="px-3.5 py-2 text-sm font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            onClick={login}
            aria-label="Login with Google"
          >
            Login with Google
          </button>
        )} */}
      </nav>
    </header>
  );
};

export default Navbar;
