import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar bg-gray-200">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">TMS</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/register">
              <button className="btn btn-info text-white">Register</button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
