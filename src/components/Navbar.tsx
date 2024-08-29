// src/components/NavBar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useFakeAuth } from '../contexts/FakeAuthContext';

const NavBar: React.FC = () => {
  const { isLoggedIn, login, logout } = useFakeAuth();

  return (
    <nav className="bg-gray-800 text-white shadow-md px-4 md:px-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold hover:text-gray-300">
          Home
        </Link>
        <div className="flex space-x-4">
          {isLoggedIn && (
            <>
              <Link to="/hospitals" className="hover:text-gray-300">
                Hospitals
              </Link>
              <Link to="/universities" className="hover:text-gray-300">
                Universities
              </Link>
              <a onClick={logout} className="cursor-pointer hover:text-gray-300">
                Logout
              </a>
            </>
          )}
          {!isLoggedIn && (
            <a onClick={login} className="cursor-pointer hover:text-gray-300">
              Login
            </a>
          )}


        </div>
      </div>
    </nav>
  );
};

export default NavBar;
