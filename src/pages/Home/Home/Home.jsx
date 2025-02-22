import useAuth from "../../../hooks/useAuth";
import Navbar from "../Navbar/Navbar";

import { Outlet } from "react-router-dom";

const Home = () => {
  const { dark } = useAuth();
  return (
    <section className={`${dark ? "" : "bg-gray-700"} min-h-screen`}>
      <Navbar></Navbar>
      <Outlet></Outlet>
      {/* <Test></Test> */}
    </section>
  );
};

export default Home;
