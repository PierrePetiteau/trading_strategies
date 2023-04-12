import { FC, ReactElement } from "react";
import { NavMenu } from "@/src/components/Nav/components/NavMenu/NavMenu";
import { NavBar } from "@/src/components/Nav/components/NavBar";

type NavProps = {
  children: ReactElement;
};

export const Nav: FC<NavProps> = ({ children }) => {
  return (
    <div className="drawer drawer-mobile">
      <input id="navigation-bar" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <NavBar />
        {children}
      </div>
      <div className="drawer-side h-screen">
        <label htmlFor="navigation-bar" className="drawer-overlay" />
        <NavMenu />
      </div>
    </div>
  );
};
