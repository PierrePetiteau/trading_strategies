import { FC } from "react";
import Link from "next/link";
import { Menu } from "react-daisyui";
import { navItems } from "@/src/components/Nav/constants";
import { NavMenuHeader } from "@/src/components/Nav/components/NavMenu/NavMenuHeader";
import { toogleCheckboxInput } from "@/src/client/html/input";

type NavMenuProps = {};

export const NavMenu: FC<NavMenuProps> = ({}) => {
  return (
    <div className="min-w-[240px] max-w-[240px] flex flex-col p-[24px] bg-base-100">
      <NavMenuHeader />
      <div className="pt-6" />
      <Menu>
        {navItems.map((item) => {
          if (item.type === "nav-title") {
            return (
              <li key={item.name} className="menu-title pt-1">
                <span className="pl-0">{item.name}</span>
              </li>
            );
          } else if (item.type === "nav-link") {
            return (
              <li key={item.name}>
                <Link href={item.path} className="rounded-lg" onClick={() => toogleCheckboxInput("navigation-bar")}>
                  {item.name}
                </Link>
              </li>
            );
          }
        })}
      </Menu>
    </div>
  );
};
