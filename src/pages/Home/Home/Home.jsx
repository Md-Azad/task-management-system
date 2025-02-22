import Navbar from "../Navbar/Navbar";

import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <section>
      <Navbar></Navbar>
      <Outlet></Outlet>
    </section>
  );
};

export default Home;
