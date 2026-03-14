import { useState } from "react";
import useAuth from "../hooks/useAuth";

const RegisterForm = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(form);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.map((e) => e.message).join(", ") ||
        "Erreur lors de l'inscription."
      );
    }
  };

  return (
    <div className="card bg-base-200 shadow-xl w-full">
      <form onSubmit={handleSubmit} className="card-body gap-3">
        <h2 className="card-title justify-center text-xl">Inscription</h2>

        {error && (
          <div className="alert alert-error text-sm">{error}</div>
        )}

        <div className="flex gap-3">
          <label className="form-control w-full">
            <div className="label"><span className="label-text">Prénom</span></div>
            <input
              name="first_name"
              type="text"
              className="input input-bordered w-full"
              placeholder="Jean"
              value={form.first_name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-control w-full">
            <div className="label"><span className="label-text">Nom</span></div>
            <input
              name="last_name"
              type="text"
              className="input input-bordered w-full"
              placeholder="Dupont"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <label className="form-control w-full">
          <div className="label"><span className="label-text">Email</span></div>
          <input
            name="email"
            type="email"
            className="input input-bordered w-full"
            placeholder="votre@email.com"
            value={form.email}
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
            placeholder="Min. 6 caractères"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </label>

        <button className="btn btn-neutral w-full mt-2" type="submit">
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
