import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);
  console.log(userData, token);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("utoken");
    navigate("/");
  };

  return (
    <div className="fixed left-0 top-0 bg-white  w-full z-50 shadow-md border-b-2  px-4 sm:px-[10%]">
      <div className="flex items-center justify-between py-4 text-sm">
        <div className="flex items-center">
          {/* MediMind Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-primary"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM18 14H14V18H10V14H6V10H10V6H14V10H18V14Z" />
            </svg>
            <span className="ml-2 text-xl font-bold text-gray-800">
              MediMind
            </span>
          </div>
        </div>

        {/* Main Navigation - Desktop */}
        <ul className="hidden lg:flex items-center gap-6 font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-primary font-semibold border-b-2 border-primary"
                : "hover:text-primary transition-colors"
            }
          >
            <li className="py-1">Home</li>
          </NavLink>
          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              isActive
                ? "text-primary font-semibold border-b-2 border-primary"
                : "hover:text-primary transition-colors"
            }
          >
            <li className="py-1">Find Doctors</li>
          </NavLink>
          <NavLink
            to="/symptom-checker"
            className={({ isActive }) =>
              isActive
                ? "text-primary font-semibold border-b-2 border-primary"
                : "hover:text-primary transition-colors"
            }
          >
            <li className="py-1">Symptom Checker</li>
          </NavLink>
          <NavLink
            to="/health-plan"
            className={({ isActive }) =>
              isActive
                ? "text-primary font-semibold border-b-2 border-primary"
                : "hover:text-primary transition-colors"
            }
          >
            <li className="py-1">Health Plan</li>
          </NavLink>
          <NavLink
            to="/medication-search"
            className={({ isActive }) =>
              isActive
                ? "text-primary font-semibold border-b-2 border-primary"
                : "hover:text-primary transition-colors"
            }
          >
            <li className="py-1">Pill Identifier</li>
          </NavLink>
          
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-primary font-semibold border-b-2 border-primary"
                : "hover:text-primary transition-colors"
            }
          >
            <li className="py-1">About</li>
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "text-primary font-semibold border-b-2 border-primary"
                : "hover:text-primary transition-colors"
            }
          >
            <li className="py-1">Contact</li>
          </NavLink>
          
          <NavLink
            to="/donor-register"
            className={({ isActive }) =>
              isActive
                ? "text-primary font-semibold border-b-2 border-primary"
                : "hover:text-primary transition-colors"
            }
          >
            <li className="py-1">Donate organs</li>
          </NavLink>
        </ul>

        {/* User Profile/Login Section */}
        <div className="flex items-center gap-4">
          {token && userData ? (
            <div className="flex items-center gap-2 cursor-pointer group relative">
              <div className="flex items-center bg-gray-50 rounded-full py-1 px-3 hover:bg-gray-100 transition-colors">
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={userData.image}
                  alt="User"
                />
                <span className="ml-2 hidden sm:block font-medium">
                  {userData.name?.split(" ")[0] || "User"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Dropdown Menu */}
              <div className="absolute top-0 right-0 pt-12 z-20 hidden group-hover:block">
                <div className="min-w-56 bg-white rounded-lg shadow-lg flex flex-col p-1">
                  <NavLink
                    to="/my-profile"
                    className="px-4 py-2 hover:bg-gray-100 rounded-md flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    My Profile
                  </NavLink>
                  <NavLink
                    to="/my-appointments"
                    className="px-4 py-2 hover:bg-gray-100 rounded-md flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    My Appointments
                  </NavLink>
                  <NavLink
                    to="/saved-doctors"
                    className="px-4 py-2 hover:bg-gray-100 rounded-md flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    Saved Doctors
                  </NavLink>
                  <NavLink
                    to="/myratings"
                    className="px-4 py-2 hover:bg-gray-100 rounded-md flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    My Ratings
                  </NavLink>
                  <NavLink
                    to="/donor-dashboard"
                    className="px-4 py-2 hover:bg-gray-100 rounded-md flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 2.91 2.09 5.39 5 5.91V17h-2v2h2v2h2v-2h2v-2h-2v-2.09c2.91-.52 5-3 5-5.91 0-3.87-3.13-7-7-7z" />
                    </svg>
                    Organ Donation Dashboard
                  </NavLink>
                  <NavLink
                    to="/dashboard-mood"
                    className="px-4 py-2 hover:bg-gray-100 rounded-md flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    Mental Health Tracker
                  </NavLink>

                  <NavLink
                    to="/prescriptions"
                    className="px-4 py-2 hover:bg-gray-100 rounded-md flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M6 2a1 1 0 00-1 1v14a1 1 0 001 1h8a1 1 0 001-1V7.414a1 1 0 00-.293-.707l-4.414-4.414A1 1 0 0010.586 2H6zm4 1.414L13.586 7H11a1 1 0 01-1-1V3.414zM7 11h6a1 1 0 010 2H7a1 1 0 110-2zm0 3h6a1 1 0 110 2H7a1 1 0 110-2z" />
                    </svg>
                    My Prescriptions
                  </NavLink>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={logout}
                    className="text-left px-4 py-2 hover:bg-gray-100 rounded-md flex items-center gap-2 text-red-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="text-primary border border-primary px-4 py-2 rounded-md font-medium hidden md:block hover:bg-gray-50 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-primary text-white px-6 py-2 rounded-md font-medium hidden md:block hover:opacity-90 transition-opacity"
              >
                Create Account
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button onClick={() => setShowMenu(true)} className="lg:hidden p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Mobile Menu */}
          <div
            className={`${
              showMenu ? "fixed w-full h-full" : "h-0 w-0"
            } lg:hidden left-0 top-0 z-30 overflow-hidden bg-white transition-all duration-200`}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM18 14H14V18H10V14H6V10H10V6H14V10H18V14Z" />
                </svg>
                <span className="ml-2 text-lg font-bold text-gray-800">
                  MediMind
                </span>
              </div>
              <button onClick={() => setShowMenu(false)} className="p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile User Info */}
            {token && userData && (
              <div className="p-4 border-b flex items-center">
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={userData.image}
                  alt="User"
                />
                <div className="ml-3">
                  <p className="font-medium">{userData.name || "User"}</p>
                  <p className="text-sm text-gray-500">
                    {userData.email || ""}
                  </p>
                </div>
              </div>
            )}

            {/* Mobile Navigation Links */}
            <div className="overflow-y-auto h-[calc(100%-80px)]">
              <ul className="flex flex-col p-4 space-y-1">
                <NavLink
                  onClick={() => setShowMenu(false)}
                  to="/"
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-md ${
                      isActive ? "bg-primary/10 text-primary font-medium" : ""
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  onClick={() => setShowMenu(false)}
                  to="/doctors"
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-md ${
                      isActive ? "bg-primary/10 text-primary font-medium" : ""
                    }`
                  }
                >
                  Find Doctors
                </NavLink>
                <NavLink
                  onClick={() => setShowMenu(false)}
                  to="/symptom-checker"
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-md ${
                      isActive ? "bg-primary/10 text-primary font-medium" : ""
                    }`
                  }
                >
                  Symptom Checker
                </NavLink>
                <NavLink
                  onClick={() => setShowMenu(false)}
                  to="/health-plan"
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-md ${
                      isActive ? "bg-primary/10 text-primary font-medium" : ""
                    }`
                  }
                >
                  Health Plan
                </NavLink>
                <NavLink
                  onClick={() => setShowMenu(false)}
                  to="/medication-search"
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-md ${
                      isActive ? "bg-primary/10 text-primary font-medium" : ""
                    }`
                  }
                >
                  Pill Identifier
                </NavLink>
            
                <NavLink
                  onClick={() => setShowMenu(false)}
                  to="/about"
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-md ${
                      isActive ? "bg-primary/10 text-primary font-medium" : ""
                    }`
                  }
                >
                  About
                </NavLink>
                <NavLink
                  onClick={() => setShowMenu(false)}
                  to="/contact"
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-md ${
                      isActive ? "bg-primary/10 text-primary font-medium" : ""
                    }`
                  }
                >
                  Contact
                </NavLink>

                {/* User Links - Only for logged in users */}
                {token && userData && (
                  <div className="pt-2 border-t mt-2">
                    <p className="px-4 text-xs uppercase text-gray-500 font-medium mt-2">
                      Your Account
                    </p>
                    <div className="mt-2 space-y-1">
                      <NavLink
                        onClick={() => setShowMenu(false)}
                        to="/my-profile"
                        className={({ isActive }) =>
                          `px-4 py-3 rounded-md flex items-center gap-2 ${
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : ""
                          }`
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        My Profile
                      </NavLink>
                      <NavLink
                        onClick={() => setShowMenu(false)}
                        to="/my-appointments"
                        className={({ isActive }) =>
                          `px-4 py-3 rounded-md flex items-center gap-2 ${
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : ""
                          }`
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        My Appointments
                      </NavLink>
                      <NavLink
                        onClick={() => setShowMenu(false)}
                        to="/saved-doctors"
                        className={({ isActive }) =>
                          `px-4 py-3 rounded-md flex items-center gap-2 ${
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : ""
                          }`
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                        Saved Doctors
                      </NavLink>
                      <NavLink
                        onClick={() => setShowMenu(false)}
                        to="/myratings"
                        className={({ isActive }) =>
                          `px-4 py-3 rounded-md flex items-center gap-2 ${
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : ""
                          }`
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        My Ratings
                      </NavLink>
                    </div>
                  </div>
                )}
              </ul>

              {/* Mobile Login Buttons */}
              {!token && (
                <div className="p-4 border-t flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/login");
                    }}
                    className="bg-primary text-white py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/login");
                    }}
                    className="border border-primary text-primary py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
                  >
                    Create Account
                  </button>
                </div>
              )}

              {/* Logout for Mobile */}
              {token && userData && (
                <div className="p-4 border-t">
                  <button
                    onClick={() => {
                      logout();
                      setShowMenu(false);
                    }}
                    className="w-full py-3 text-center text-red-500 font-medium rounded-md border border-red-200 hover:bg-red-50 flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
