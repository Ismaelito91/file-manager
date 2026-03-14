import { PanelRightClose } from "lucide-react";
import useTitle from "../hooks/useTitle";

const Navbar = () => {
  const { title } = useTitle();

  return (
    <nav className="navbar w-full bg-base-300">
      <label
        htmlFor="my-drawer-4"
        aria-label="open sidebar"
        className="btn btn-square btn-ghost"
      >
        <PanelRightClose
          className="my-1.5 inline-block w-4 h-4"
          strokeWidth={2}
        />
      </label>
      <div className="px-4">{title}</div>
    </nav>
  );
};

export default Navbar;
