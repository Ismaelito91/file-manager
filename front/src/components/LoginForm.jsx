import { useState } from "react";
import useAuth from "../hooks/useAuth";

const LoginForm = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = () => {
    login(credentials);
  };

  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
      <legend className="fieldset-legend">Login</legend>

      <label className="label">Email</label>
      <input
        name="email"
        type="email"
        className="input"
        placeholder="Email"
        value={credentials.email}
        onChange={handleChange}
      />

      <label className="label">Password</label>
      <input
        name="password"
        type="password"
        className="input"
        placeholder="Password"
        value={credentials.password}
        onChange={handleChange}
      />

      <button className="btn btn-neutral mt-4" onClick={handleClick}>
        Login
      </button>
    </fieldset>
  );
};

export default LoginForm;
