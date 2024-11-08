import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useUser } from "../contexts/userContexts"

const Login = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { setUserID } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        {
          username,
          email,
          password,
        }
      );
      if (response.status === 200) {
        setUserID(response.data.userID);
        localStorage.setItem("userID", response.data.userID);
        setUserName("");
        setEmail("");
        setPassword("");
        setError("");
        setSuccessMessage("Login Successful");
        setTimeout(() => {
          navigate("/my-checklist");
        }, 2000);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid credentials. Please try again.");
      } else {
        setError("Internal server error");
      }
      console.error(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-28 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
      <form
        onSubmit={(event) => {
          handleLogin(event);
        }}
        className="space-y-5"
      >
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Username:
          </label>
          <input
            type="text"
            value={username}
            onChange={(event) => setUserName(event.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-red-500 my-10 text-center">{error}</p>}
        {successMessage && (
          <p className="text-green-500 my-10 text-center">{successMessage}</p>
        )}
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-white hover:text-blue-500 hover:shadow-xl duration-500"
        >
          Login
        </button>
        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
