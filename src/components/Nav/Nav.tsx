import { FC, ReactElement } from "react";
import Link from "next/link";
import { Menu } from "react-daisyui";
import { AppLogoSvg } from "./AppLogo";
import { Menu as MenuIcon } from "react-feather";

/**
 * @TODO Split the component
 * 
 * - Make constants for drawer class names
 * - DrawerContent
 * - DrawerSide
 * - NavigationBar
 * - NavigationMenu
 *    - create a model to generate navigation items
 * 
 */

type NavProps = {
  children: ReactElement;
};

export const Nav: FC<NavProps> = ({ children }) => {
  return (
    <div className="drawer drawer-mobile">
      <input id="navigation-bar" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-200 lg:hidden">
          <div className="flex-none">
            <label htmlFor="navigation-bar" className="btn btn-square drawer-button btn-ghost">
              <MenuIcon />
            </label>
          </div>
          <div className="flex-1">
            <a className="p-2 normal-case text-xl">Perpetual trailing</a>
          </div>
        </div>
        {children}
      </div>
      <div className="drawer-side h-screen">
        <label htmlFor="navigation-bar" className="drawer-overlay" />
        <div className="min-w-[240px] max-w-[240px] flex flex-col p-[24px] bg-base-100">
          <Link href="/">
            <div className="flex flex-row items-center">
              <div className="w-24 h-24">
                <AppLogoSvg />
              </div>
              <h4 className="pl-3 m-0 text-accent-content">Perpetual Trailing</h4>
            </div>
          </Link>
          <div className="pt-6" />
          <Menu>
            <li className="menu-title">
              <span className="pl-0">Project</span>
            </li>
            <li>
              <Link href={"/project/introduction"} className="rounded-lg">
                Introduction
              </Link>
            </li>
            <li>
              <Link href={"/project/get_started"} className="rounded-lg">
                Get started
              </Link>
            </li>
            <div className="pt-1" />
            <li className="menu-title">
              <span className="pl-0">Experiments</span>
            </li>
            <li>
              <Link href={"/"} className="rounded-lg">
                BTC-USDT
              </Link>
            </li>
            <li>
              <Link href={"/perpetual_trailing"} className="rounded-lg">
                ETH-USDT
              </Link>
            </li>
            <li>
              <Link href={"/"} className="rounded-lg">
                BNB-USDT
              </Link>
            </li>
            <li>
              <Link href={"/"} className="rounded-lg">
                MATIC-USDT
              </Link>
            </li>
          </Menu>
          <div className="flex flex-grow" />
        </div>
      </div>
    </div>
  );
};
