import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import useAuth from "../hooks/useAuth";
import { getStats } from "../services/fileService";
import { formatSize } from "../utils/formatSize";
import { Files, HardDrive, Clock, ArrowRight } from "lucide-react";

const Home = () => {
  const { setTitle } = useTitle();
  const { authUser } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTitle("Accueil");
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await getStats();
      setStats(data);
    } catch {
      /* silently fail */
    } finally {
      setLoading(false);
    }
  };

  const firstName = authUser?.first_name || "utilisateur";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Bonjour, {firstName}
        </h1>
        <p className="text-base-content/60 mt-1">
          Bienvenue sur votre gestionnaire de fichiers.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body flex-row items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Files className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.totalFiles ?? 0}</p>
                  <p className="text-sm text-base-content/60">Fichiers</p>
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-sm">
              <div className="card-body flex-row items-center gap-4">
                <div className="bg-secondary/10 p-3 rounded-xl">
                  <HardDrive className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {formatSize(stats?.totalSize ?? 0)}
                  </p>
                  <p className="text-sm text-base-content/60">Espace utilisé</p>
                </div>
              </div>
            </div>
          </div>

          {stats?.recentFiles?.length > 0 && (
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="card-title text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Derniers fichiers
                  </h2>
                  <button
                    className="btn btn-ghost btn-sm gap-1"
                    onClick={() => navigate("/files")}
                  >
                    Voir tout <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Type</th>
                        <th>Taille</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentFiles.map((file) => (
                        <tr key={file._id} className="hover">
                          <td className="font-medium">{file.name}</td>
                          <td>
                            <span className="badge badge-ghost badge-sm">
                              {file.extension}
                            </span>
                          </td>
                          <td>{formatSize(file.size)}</td>
                          <td className="text-base-content/60">
                            {new Date(file.createdAt).toLocaleDateString("fr-FR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              className="btn btn-primary gap-2"
              onClick={() => navigate("/files")}
            >
              <Files className="w-4 h-4" /> Gérer mes fichiers
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
