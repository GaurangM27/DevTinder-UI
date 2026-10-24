import axios from "axios";
import React, { useReducer } from "react";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router";
import { addUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";

const initialState = {
  emailId: "",
  otp: "",
  firstName: "",
  lastName: "",
  showState: 1,
  password: "",
  error: "",
  success: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.payload };
    case "GENERATE_OTP":
      return {
        ...state,
        showState: state.showState + 1,
        success: "OTP send successfully",
        error: "",
      };
    case "VERIFY_OTP":
      return {
        ...state,
        showState: state.showState + 1,
        success: "Email Verified successfully",
        error: "",
      };
    case "SET_ERROR":
      return { ...state, error: action.error };
    default:
      return state;
  }
};

const SignUp = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();

  const handleChange = (e) => {
    dispatch({
      type: "SET_FIELD",
      field: e.target.name,
      payload: e.target.value,
    });
  };

  const generateOTP = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/send-otp",
        {
          emailId: state.emailId,
        },
        { withCredentials: true },
      );
      dispatch({ type: "GENERATE_OTP" });
      setTimeout(() => {
        dispatch({ type: "SET_FIELD", field: "success", payload: null });
      }, 5000);
    } catch (error) {
      console.log(error);
      dispatch({ type: "SET_ERROR", error: "Invalid Email Address" });
    }
  };

  const verifyOTP = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/verify-otp",
        { emailId: state.emailId, otp: state.otp },
        { withCredentials: true },
      );
      dispatch({ type: "VERIFY_OTP" });
      setTimeout(() => {
        dispatch({ type: "SET_FIELD", field: "success", payload: null });
      }, 5000);
    } catch (error) {
      console.log(error);
      dispatch({ type: "SET_ERROR", error: error.response.data });
    }
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          emailId: state.emailId,
          firstName: state.firstName,
          lastName: state.lastName,
          password: state.password,
        },
        { withCredentials: true },
      );
      reduxDispatch(addUser(res.data));
      navigate("/profile");
    } catch (error) {
      console.log(error);
      let err = error.response.data;
      if (err.includes("duplicate")) {
        dispatch({ type: "SET_ERROR", error: "Email already exists" });
      } else {
        dispatch({ type: "SET_ERROR", error: error.response.data });
      }
    }
  };

  return (
    <>
      {state.error !== "" && (
        <div
          role="alert"
          className="alert alert-error"
          onClick={() => dispatch({ type: "SET_ERROR", error: "" })}
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
          <span>{state.error}</span>
        </div>
      )}
      {state.success != null && (
        <div className="toast toast-top toast-start">
          <div className="alert alert-success">
            <span>{state.success}</span>
          </div>
        </div>
      )}
      <div className="flex flex-1 justify-center pt-4">
        <div className="card flex bg-neutral w-96 shadow-xl h-fit">
          <div className="card-body">
            <h2 className="card-title justify-center">Signup Here!</h2>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Email ID</span>
              </div>
              <input
                name="emailId"
                type="text"
                value={state.emailId}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => handleChange(e)}
              />
            </label>
            {state.showState === 1 && (
              <button className="btn btn-primary" onClick={generateOTP}>
                Generate OTP
              </button>
            )}

            {state.showState === 2 && (
              <>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Enter OTP</span>
                  </div>
                  <input
                    name="otp"
                    type="number"
                    value={state.otp}
                    className="input input-bordered w-full max-w-xs"
                    onChange={handleChange}
                  />
                </label>
                <button className="btn btn-primary" onClick={verifyOTP}>
                  Verify OTP
                </button>
              </>
            )}
            {state.showState === 3 && (
              <>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">First Name</span>
                  </div>
                  <input
                    name="firstName"
                    type="text"
                    value={state.firstName}
                    className="input input-bordered w-full max-w-xs"
                    onChange={handleChange}
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Last Name</span>
                  </div>
                  <input
                    name="lastName"
                    type="text"
                    value={state.lastName}
                    className="input input-bordered w-full max-w-xs"
                    onChange={handleChange}
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Password</span>
                  </div>
                  <input
                    name="password"
                    type="password"
                    value={state.password}
                    className="input input-bordered w-full max-w-xs"
                    onChange={handleChange}
                  />
                </label>
                <div className="card-actions justify-center mt-4">
                  <button className="btn btn-primary" onClick={handleSignup}>
                    Signup
                  </button>
                </div>
                <span className="m-auto">
                  Already a user?
                  <span
                    className="text-cyan-400 underline cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Go To Login
                  </span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
