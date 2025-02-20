import { Link } from "react-router-dom";
import { app } from "../../../firebase/firebase.config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
const auth = getAuth(app);
const Registration = () => {
  const handleSignUp = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const password = form.password.value;
    const email = form.email.value;
    console.log(name, email, password);
    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        console.log(res.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="hero bg-base-200 min-h-screen ">
      <div className="hero-content flex-col w-3/5  ">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Sign Up </h1>
        </div>
        <div className="card bg-base-100 w-full shadow-2xl ">
          <form onSubmit={handleSignUp} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="email"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="password"
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control mt-6">
              <input
                className={`btn btn-primary `}
                type="submit"
                value="SignUp"
              />
            </div>
          </form>

          <p
            className="text-center mb-4
          "
          >
            <small>
              Allready Have an Account?{" "}
              <Link to="/login" className="text-yellow-500">
                Login Here
              </Link>
            </small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
