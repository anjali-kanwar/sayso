import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";

export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [debates, setDebates] = useState([]);
  const [open, setOpen] = useState(null); // expanded debate id
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });

  const loadDebates = async () => {
    try {
      const { data } = await api.get("/debates");
      setDebates(data);
    } catch {
      toast.error("Could not load debates");
    }
  };

  useEffect(() => {
    loadDebates();
  }, []);

  const toggleActivity = async (id) => {
    if (open === id) return setOpen(null);
    try {
      const { data } = await api.get(`/debates/${id}/comments`);
      setComments(data);
      setOpen(id);
    } catch {
      toast.error("Could not load debate activity");
    }
  };

  const addDebate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/debates", form);
      toast.success("Debate posted");
      setForm({ title: "", description: "" });
      setShowModal(false);
      setOpen(null);
      loadDebates();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post debate");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <Navbar>
        <button onClick={() => setShowModal(true)} className="btn-outline">Add Debate</button>
        <button onClick={handleLogout} className="btn-outline">Logout</button>
      </Navbar>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-4">
        <h1 className="text-2xl font-bold">Debate History</h1>
        {debates.length === 0 && <p className="text-plum/70">No debates yet. Click "Add Debate" to post one.</p>}

        {debates.map((d) => (
          <div key={d._id} className="card">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold">{d.title}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${d.isActive ? "bg-plum text-cream" : "bg-cream text-plum"}`}>
                    {d.isActive ? "Live" : "Closed"}
                  </span>
                </div>
                {d.description && <p className="text-plum/80 text-sm">{d.description}</p>}
                <p className="text-xs text-plum/60 mt-2">
                  Posted {new Date(d.createdAt).toLocaleDateString()} · {d.commentCount} comments
                </p>
              </div>
              <button className="btn-outline-dark whitespace-nowrap" onClick={() => toggleActivity(d._id)}>
                {open === d._id ? "Hide" : "View Activity"}
              </button>
            </div>

            {open === d._id && (
              <div className="mt-4 border-t border-plum/10 pt-4 space-y-3">
                {comments.length === 0 && <p className="text-sm text-plum/70">No comments yet.</p>}
                {comments.map((c) => (
                  <div key={c._id} className="bg-cream-light rounded-md p-3 text-sm">
                    <p className="font-medium">@{c.user?.username} <span className="font-normal text-plum/60">({c.user?.name})</span></p>
                    <p className="my-1 whitespace-pre-wrap">{c.text}</p>
                    <p className="text-plum/80">
                      Likes ({c.likesCount}): {c.likedBy?.join(", ") || "none"}
                    </p>
                    <p className="text-plum/80">
                      Dislikes ({c.dislikesCount}): {c.dislikedBy?.join(", ") || "none"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <form onSubmit={addDebate} className="card w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">Add New Debate</h2>
            <input className="input" placeholder="Debate topic" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <textarea className="input" rows={4} placeholder="Description (optional)" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <p className="text-xs text-plum/60">Posting a new debate will close the current live one.</p>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn-outline-dark" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary">Post Debate</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}