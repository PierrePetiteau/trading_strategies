import { FC } from "react";
import Link from "next/link";
import { AppLogoSvg } from "@/src/components/Nav/components/AppLogo";

type NavMenuHeaderProps = {};

export const NavMenuHeader: FC<NavMenuHeaderProps> = ({}) => {
  return (
    <Link href="/">
      <div className="flex flex-row items-center">
        <div className="w-24 h-24">
          <AppLogoSvg />
        </div>
        <h4 className="pl-3 m-0 text-accent-content">Perpetual Trailing</h4>
      </div>
    </Link>
  );
};
