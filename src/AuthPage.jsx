import React, { useState } from "react";

export default function AuthPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });

  function handleSubmit(e) {
    e.preventDefault();
    // fake auth - in real app connect backend
    if (form.email && form.password) {
      onAuth({ email: form.email });
    } else {
      alert("Please enter email and password");
    }
  }

  return (
    <div className="auth-page">
      <h2>{isLogin ? "Sign In" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn primary" type="submit">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button className="btn ghost" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Sign Up" : "Sign In"}
        </button>
      </p>
    </div>
  );
}
