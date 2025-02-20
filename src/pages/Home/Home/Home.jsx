import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const Home = () => {
  return (
    <section>
      <Navbar></Navbar>
      <Outlet></Outlet>
    </section>
  );
};

export default Home;
