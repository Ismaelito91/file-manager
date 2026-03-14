import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const Login = () => {
  const [activeForm, setActiveForm] = useState(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
      <div className="w-full max-w-sm">
        {!activeForm && (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center gap-4">
              <h1 className="card-title text-3xl font-bold">File Manager</h1>
              <p className="text-base-content/60">
                Gérez vos fichiers en toute simplicité.
              </p>
              <div className="card-actions flex-col w-full gap-3 mt-2">
                <button
                  className="btn btn-neutral w-full"
                  onClick={() => setActiveForm("login")}
                >
                  Connexion
                </button>
                <button
                  className="btn btn-outline w-full"
                  onClick={() => setActiveForm("register")}
                >
                  Inscription
                </button>
              </div>
            </div>
          </div>
        )}

        {activeForm === "login" && (
          <div className="flex flex-col items-center gap-3">
            <LoginForm />
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setActiveForm(null)}
            >
              ← Retour
            </button>
          </div>
        )}

        {activeForm === "register" && (
          <div className="flex flex-col items-center gap-3">
            <RegisterForm />
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setActiveForm(null)}
            >
              ← Retour
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
