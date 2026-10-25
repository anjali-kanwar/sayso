import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload =
        mode === "login"
          ? { username: form.username, password: form.password }
          : form;
      const { data } = await api.post(`/auth/${mode}`, payload);
      login(data);
      toast.success(mode === "login" ? "Welcome back!" : "Account created!");
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const tab = (m) =>
    `flex-1 py-2 font-medium rounded-md transition ${
      mode === m ? "bg-plum text-cream" : "text-plum hover:bg-cream"
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-cream px-4">
        <div className="card w-full max-w-md">
          <div className="flex gap-2 mb-6 bg-cream-light p-1 rounded-md">
            <button type="button" className={tab("login")} onClick={() => setMode("login")}>Login</button>
            <button type="button" className={tab("signup")} onClick={() => setMode("signup")}>Sign Up</button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <input className="input" name="name" placeholder="Name" value={form.name} onChange={onChange} required />
            )}
            <input className="input" name="username" placeholder="Username" value={form.username} onChange={onChange} required />
            <input className="input" type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} required />
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}