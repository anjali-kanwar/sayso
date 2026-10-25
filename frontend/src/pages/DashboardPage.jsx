import { useEffect, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import api from "../api.js";
import Navbar from "../components/Navbar.jsx";

export default function DashboardPage() {
  const [debate, setDebate] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const loadComments = async (id) => {
    const { data } = await api.get(`/debates/${id}/comments`);
    setComments(data);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/debates/current");
        setDebate(data);
        if (data) await loadComments(data._id);
      } catch {
        toast.error("Could not load debate");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const postComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post(`/debates/${debate._id}/comments`, { text });
      setText("");
      loadComments(debate._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post");
    }
  };

  const react = async (commentId, type) => {
    try {
      await api.post(`/comments/${commentId}/react`, { type });
      loadComments(debate._id);
    } catch {
      toast.error("Could not react");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar>
        <Link to="/profile" className="btn-outline">Profile</Link>
      </Navbar>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {loading ? (
          <p>Loading...</p>
        ) : !debate ? (
          <div className="card text-center">No debate is live right now. Please check back soon.</div>
        ) : (
          <>
            <section className="card bg-cream">
              <p className="text-sm uppercase tracking-wide text-plum/70 mb-1">This week's debate</p>
              <h1 className="text-2xl font-bold mb-2">{debate.title}</h1>
              {debate.description && <p className="text-plum/80">{debate.description}</p>}
            </section>

            <form onSubmit={postComment} className="card space-y-3">
              <textarea
                className="input"
                rows={3}
                maxLength={1000}
                placeholder="Share your opinion..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button className="btn-primary">Post Comment</button>
            </form>

            <section className="space-y-3">
              <h2 className="font-semibold text-lg">Comments ({comments.length})</h2>
              {comments.length === 0 && <p className="text-plum/70">Be the first to comment.</p>}
              {comments.map((c) => (
                <div key={c._id} className="card py-4">
                  <div className="flex justify-between text-sm text-plum/70 mb-1">
                    <span className="font-medium text-plum">{c.user?.name} (@{c.user?.username})</span>
                    <span>{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="mb-3 whitespace-pre-wrap">{c.text}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => react(c._id, "like")}
                      className={`px-3 py-1 rounded-md text-sm border border-plum ${
                        c.myReaction === "like" ? "bg-plum text-cream" : "text-plum hover:bg-cream"
                      }`}
                    >
                      Like · {c.likesCount}
                    </button>
                    <button
                      onClick={() => react(c._id, "dislike")}
                      className={`px-3 py-1 rounded-md text-sm border border-plum ${
                        c.myReaction === "dislike" ? "bg-plum text-cream" : "text-plum hover:bg-cream"
                      }`}
                    >
                      Dislike · {c.dislikesCount}
                    </button>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}