import { Link } from "react-router-dom";


export const Navbar = () => {
return (
<nav className="w-full absolute top-0 left-0 z-50 px-10 py-6 flex items-center justify-between">
<h1 className="text-white text-xl font-bold">TeamFlow</h1>
<div className="hidden md:flex gap-8 text-white">
<a href="#" className="hover:text-yellow-400">Product</a>
<a href="#" className="hover:text-yellow-400">Solution</a>
<a href="#" className="hover:text-yellow-400">Enterprise</a>
<a href="#" className="hover:text-yellow-400">Pricing</a>
</div>
<div className="flex gap-4 items-center">
<Link to="/login" className="text-white">Login</Link>
<Link to="/signup" className="bg-yellow-400 px-5 py-2 rounded-md font-semibold">
Sign Up
</Link>
</div>
</nav>
);
};