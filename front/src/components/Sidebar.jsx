import { Link } from "react-router-dom";
import { File, Home, Settings2 } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="drawer-side is-drawer-close:overflow-visible">
      <label
        htmlFor="my-drawer-4"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
        <ul className="menu w-full grow">
          <li>
            <Link
              to="/"
              className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              data-tip="Accueil"
            >
              <Home className="my-1.5 inline-block w-4 h-4" strokeWidth={2} />
              <span className="is-drawer-close:hidden">Accueil</span>
            </Link>
          </li>
          <li>
            <Link
              to="/files"
              className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              data-tip="Fichiers"
            >
              <File className="my-1.5 inline-block w-4 h-4" strokeWidth={2} />
              <span className="is-drawer-close:hidden">Fichiers</span>
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              data-tip="Paramètres"
            >
              <Settings2
                className="my-1.5 inline-block w-4 h-4"
                strokeWidth={2}
              />
              <span className="is-drawer-close:hidden">Paramètres</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
