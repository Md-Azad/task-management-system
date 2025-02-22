import Navbar from "../Navbar/Navbar";
import useAuth from "../../../hooks/useAuth";
import Login from "../../authentication/Login/Login";
import Taskboard from "../../Taskboard/Taskboard";

const Home = () => {
  const { user } = useAuth();
  return (
    <section>
      <Navbar></Navbar>

      <>{user?.email ? <Taskboard></Taskboard> : <Login></Login>}</>
    </section>
  );
};

export default Home;
