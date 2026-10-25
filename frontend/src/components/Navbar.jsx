import { Link } from "react-router";

export default function Navbar({ children }) {
  return (
    <header className="bg-plum text-cream">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold tracking-wide">sayso</Link>
        <div className="flex items-center gap-3">{children}</div>
      </div>
    </header>
  );
}