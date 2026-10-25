import { Link } from "react-router";
import Navbar from "../components/Navbar.jsx";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar>
        <Link to="/login" className="btn-outline">Login</Link>
      </Navbar>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 bg-cream">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">One topic. One week. Your say.</h1>
        <p className="text-lg max-w-xl mb-8 text-plum/80">
          sayso is a weekly debate platform where you share your opinion and engage with others on a fresh topic every week.
        </p>
        <Link to="/login" className="btn-primary text-lg px-8 py-3">Join Debate</Link>
      </main>
    </div>
  );
}