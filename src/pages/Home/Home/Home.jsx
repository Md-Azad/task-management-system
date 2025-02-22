import Navbar from "../Navbar/Navbar";

import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <section>
      <Navbar></Navbar>
      <Outlet></Outlet>
      {/* <Test></Test> */}
    </section>
  );
};

export default Home;
