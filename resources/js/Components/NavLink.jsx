import { Link } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <li className="relative px-6 py-3">
            {
                active ? <span
                className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                aria-hidden="true"
            ></span>
            : ''
            }
            <Link
                {...props}
                className={
                    "inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none " +
                    (active
                        ? "text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-900 focus:text-gray-900  ") +
                    className
                }
            >
                {children}
            </Link>
        </li>
    );
}
