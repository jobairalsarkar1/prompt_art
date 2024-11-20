import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
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
        <button className="px-3.5 py-2 text-sm font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 flex justify-center items-center">
          Sign In
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
