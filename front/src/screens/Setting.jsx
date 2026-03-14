import { useEffect, useState } from "react";
import useTitle from "../hooks/useTitle";
import useAuth from "../hooks/useAuth";
import { updateUser } from "../services/userService";

const Setting = () => {
  const { setTitle } = useTitle();
  const { authUser, logout } = useAuth();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTitle("Settings");
    if (authUser) {
      setForm({
        first_name: authUser.first_name || "",
        last_name: authUser.last_name || "",
        email: authUser.email || "",
        password: "",
      });
    }
  }, [authUser]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const payload = { ...form };
    if (!payload.password) delete payload.password;

    try {
      await updateUser(authUser.id, payload);
      setMessage("Profil mis à jour avec succès.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.map((e) => e.message).join(", ") ||
        "Erreur lors de la mise à jour."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && <div className="alert alert-success text-sm">{message}</div>}
        {error && <div className="alert alert-error text-sm">{error}</div>}

        <label className="form-control w-full">
          <div className="label"><span className="label-text">Prénom</span></div>
          <input
            name="first_name"
            type="text"
            className="input input-bordered w-full"
            value={form.first_name}
            onChange={handleChange}
          />
        </label>

        <label className="form-control w-full">
          <div className="label"><span className="label-text">Nom</span></div>
          <input
            name="last_name"
            type="text"
            className="input input-bordered w-full"
            value={form.last_name}
            onChange={handleChange}
          />
        </label>

        <label className="form-control w-full">
          <div className="label"><span className="label-text">Email</span></div>
          <input
            name="email"
            type="email"
            className="input input-bordered w-full"
            value={form.email}
            onChange={handleChange}
          />
        </label>

        <label className="form-control w-full">
          <div className="label"><span className="label-text">Nouveau mot de passe (laisser vide pour ne pas changer)</span></div>
          <input
            name="password"
            type="password"
            className="input input-bordered w-full"
            placeholder="••••••"
            value={form.password}
            onChange={handleChange}
          />
        </label>

        <button className="btn btn-neutral w-full" type="submit">
          Sauvegarder
        </button>
      </form>

      <div className="divider"></div>

      <button className="btn btn-error btn-outline w-full" onClick={logout}>
        Se déconnecter
      </button>
    </div>
  );
};

export default Setting;
