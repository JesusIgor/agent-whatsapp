import { Link } from "react-router-dom";

export interface AuthLinkProps {
  text: string;
  linkText: string;
  href: string;
}

export function AuthLink({ text, linkText, href }: AuthLinkProps) {
  return (
    <p className="text-center font-be-vietnam-pro text-sm text-[#727B8E] dark:text-[#8a94a6]">
      {text}{" "}
      <Link to={href} className="font-semibold text-[#1E62EC] hover:underline">
        {linkText}
      </Link>
    </p>
  );
}
