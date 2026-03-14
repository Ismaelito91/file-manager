import { useState } from "react";
import useAuth from "../hooks/useAuth";

const LoginForm = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(credentials);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la connexion.");
    }
  };

  return (
    <div className="card bg-base-200 shadow-xl w-full">
      <form onSubmit={handleSubmit} className="card-body gap-3">
        <h2 className="card-title justify-center text-xl">Connexion</h2>

        {error && (
          <div className="alert alert-error text-sm">{error}</div>
        )}

        <label className="form-control w-full">
          <div className="label"><span className="label-text">Email</span></div>
          <input
            name="email"
            type="email"
            className="input input-bordered w-full"
            placeholder="votre@email.com"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="form-control w-full">
          <div className="label"><span className="label-text">Mot de passe</span></div>
          <input
            name="password"
            type="password"
            className="input input-bordered w-full"
            placeholder="••••••"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </label>

        <button className="btn btn-neutral w-full mt-2" type="submit">
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
