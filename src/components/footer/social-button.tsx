import type { JSX } from "react";
import Link from "next/link";

interface SocialButtonProps {
  icon: JSX.Element;
  name?: string;
  buttonClassName: string;
  href?: string;
}

const SocialButton = ({
  icon,
  name,
  buttonClassName,
  href,
}: SocialButtonProps) => {
  return (
    <section className="flex justify-center items-center">
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href={href || "#"}
        className={buttonClassName}
      >
        {icon}
        {name && (
          <span className="absolute opacity-0 group-hover:opacity-100 group-hover:text-gray-700 group-hover:text-sm group-hover:-translate-y-10 duration-700">
            {name}
          </span>
        )}
      </Link>
    </section>
  );
};

export default SocialButton;
