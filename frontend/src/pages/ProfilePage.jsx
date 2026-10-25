import { Link, useNavigate } from "react-router";
import { useAuth } from "../AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <Navbar>
        <Link to="/dashboard" className="btn-outline">Back to Debate</Link>
      </Navbar>

      <main className="max-w-md mx-auto px-6 py-10">
        <div className="card space-y-4">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <div>
            <p className="text-sm text-plum/60">Name</p>
            <p className="font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-plum/60">Username</p>
            <p className="font-medium">@{user.username}</p>
          </div>
          <button onClick={handleLogout} className="btn-primary w-full">Logout</button>
        </div>
      </main>
    </div>
  );
}