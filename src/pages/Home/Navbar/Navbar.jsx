import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { MdDarkMode } from "react-icons/md";
import { CiDark } from "react-icons/ci";

const Navbar = () => {
  const { user, logOut, dark, setDark } = useAuth();

  const handleLogout = () => {
    logOut()
      .then(() => {})
      .catch((err) => {
        alert("something went worng on signout.", err.message);
      });
  };
  return (
    <div className={`navbar ${dark ? "bg-gray-200" : "bg-gray-600 border"}`}>
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">TMS</a>
      </div>
      <div className="flex-none">
        <button className="mr-4">
          {dark ? (
            <MdDarkMode onClick={() => setDark(!dark)} className="text-3xl" />
          ) : (
            <CiDark
              onClick={() => setDark(!dark)}
              className="text-3xl text-white"
            />
          )}
        </button>
        <ul className="menu menu-horizontal px-1">
          {user?.email ? (
            <li>
              <button
                onClick={handleLogout}
                className="btn btn-info text-white"
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link to="/register">
                <button className="btn btn-info text-white">Register</button>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
