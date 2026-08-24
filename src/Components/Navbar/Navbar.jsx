import { useContext, useState } from "react";
import { CounterContext } from "../../Contexts/CounterContext";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext";
import Swal from "sweetalert2";

export default function Navbar() {
  const { userToken, setUserToken, userData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  function ToggleNav() {
    setIsOpen(!isOpen);
  }

  function Logout() {
    Swal.fire({
      title: "تسجيل الخروج",
      text: "هل أنت أكتد من أنك تريد تسجيل الخروج؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "نعم، سجل الخروج",
      cancelButtonText: "إلغاء",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl px-4 py-2",
        cancelButton: "rounded-xl px-4 py-2",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // ^مسح البيانات
        localStorage.removeItem("token");
        setUserToken(null);

        // ^إظهار رسالة النجاح
        Swal.fire({
          title: "تم!",
          text: "تم تسجيل الخروج بنجاح.",
          icon: "success",
          timer: 1500, //^ يختفي التنبيه تلقائياً بعد ثانية ونصف
          showConfirmButton: false,
          customClass: {
            popup: "rounded-2xl",
          },
        }).then(() => {
          navigate("/");
        });
      }
    });
  }
  return (
    <nav className="bg-blue-600/95 backdrop-blur-md sticky top-0 w-full z-50 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <span className="text-white font-black text-lg">S</span>
            </div>
            <Link to={"/home"}>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Social App
              </h1>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={ToggleNav}
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-xl text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 md:hidden transition-colors cursor-pointer"
            aria-controls="navbar-default"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop & Mobile Navigation Links Container */}
          <div
            className={`${
              isOpen ? "block" : "hidden"
            } w-full md:flex md:items-center md:justify-between md:w-auto flex-1 md:ms-8 absolute md:static top-16 left-0 bg-blue-600 md:bg-transparent px-4 pb-4 md:p-0 shadow-lg md:shadow-none transition-all duration-300 z-50`}
            id="navbar-default"
          >
            {/* Main Links */}
            <ul className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mt-4 md:mt-0 font-medium">
              {userToken !== null && (
                <>
                  <li>
                    <NavLink
                      to="/home"
                      className={({ isActive }) =>
                        `block px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                          isActive
                            ? "bg-white text-blue-600 font-bold shadow-xs"
                            : "text-white/90 hover:bg-white/10 hover:text-white"
                        }`
                      }
                    >
                      Home
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `block px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                          isActive
                            ? "bg-white text-blue-600 font-bold shadow-xs"
                            : "text-white/90 hover:bg-white/10 hover:text-white"
                        }`
                      }
                    >
                      Profile
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            {/* Auth / User Section */}
            <ul className="flex flex-col md:flex-row md:items-center gap-2 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/10 md:border-t-0 font-medium">
              {userToken == null ? (
                <>
                  <li>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        `block px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                          isActive
                            ? "bg-white text-blue-600 font-bold shadow-xs"
                            : "text-white/90 hover:bg-white/10 hover:text-white"
                        }`
                      }
                    >
                      Login
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/register"
                      className="block px-4 py-2 rounded-xl text-sm font-semibold bg-white text-blue-600 hover:bg-blue-50 transition-all duration-200 shadow-xs"
                    >
                      Register
                    </NavLink>
                  </li>
                </>
              ) : (
                <li className="flex flex-col md:flex-row items-start md:items-center gap-3 text-white text-sm">
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="font-medium text-white/90">
                      {userData?.name
                        ? `Welcome, ${userData?.name}`
                        : "Welcome"}
                    </span>
                  </div>

                  <button
                    onClick={Logout}
                    className="w-full md:w-auto px-4 py-1.5 text-sm font-semibold text-red-100 hover:text-white bg-red-500/20 hover:bg-red-500/60 border border-red-400/30 rounded-xl transition-all duration-200 cursor-pointer text-center"
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
