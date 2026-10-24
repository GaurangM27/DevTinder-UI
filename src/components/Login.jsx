import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId: emailId,
          password: password,
        },
        { withCredentials: true }
      );
      console.log(res);
      dispatch(addUser(res.data));
      navigate("/feed");
    } catch (error) {
      if (error.response) setError(error?.response?.data);
      else setError(error?.message);
      console.log(error);
    }
  };

  return (
    <>
      {error !== "" && (
        <div
          role="alert"
          className="alert alert-error"
          onClick={() => setError("")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-center items-center pt-4 pb-40">
        <div className="card bg-neutral w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center">Login Here!</h2>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Email ID</span>
              </div>
              <input
                type="text"
                value={emailId}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type="password"
                value={password}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <p className="text-red-500">{error}</p>
            <p
              className="text-right cursor-pointer text-cyan-400 underline"
              onClick={() => navigate("/forget-password")}
            >
              Forget Password?
            </p>
            <div className="card-actions justify-center mt-4">
              <button className="btn btn-primary" onClick={handleLogin}>
                Login
              </button>
            </div>
            <p
              className="m-auto cursor-pointer text-cyan-400 pt-1 underline"
              onClick={() => navigate("/signup")}
            >
              New User? Signup
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
