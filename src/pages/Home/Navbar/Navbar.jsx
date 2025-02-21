import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();
  console.log(user?.email);

  const handleLogout = () => {
    logOut()
      .then(() => {})
      .catch((err) => {
        alert("something went worng on signout.", err.message);
      });
  };
  return (
    <div className="navbar bg-gray-200">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">TMS</a>
      </div>
      <div className="flex-none">
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
