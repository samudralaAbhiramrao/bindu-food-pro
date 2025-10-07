import React, { useState } from "react";
import AuthPage from "./AuthPage"; // Sign In / Sign Up component

// Sample data
const RESTAURANTS = [
  {
    id: 1,
    name: "Spice Villa",
    cuisine: "Indian",
    eta: "30-40 min",
    rating: 4.6,
    menu: [
      { id: "i1", name: "Butter Chicken", price: 220 },
      { id: "i2", name: "Paneer Tikka", price: 180 },
      { id: "i3", name: "Garlic Naan", price: 40 },
    ],
  },
  {
    id: 2,
    name: "Green Bowl",
    cuisine: "Healthy",
    eta: "20-30 min",
    rating: 4.4,
    menu: [
      { id: "i4", name: "Quinoa Salad", price: 150 },
      { id: "i5", name: "Falafel Wrap", price: 120 },
      { id: "i6", name: "Smoothie", price: 90 },
    ],
  },
  {
    id: 3,
    name: "Yummy-Yummy",
    cuisine: "Italian",
    eta: "20-25 min",
    rating: 4.8,
    menu: [
      { id: "i7", name: "Pizza Margherita", price: 220 },
      { id: "i8", name: "Pasta Carbonara", price: 280 },
      { id: "i9", name: "Lasagna", price: 340 },
    ],
  },
];

// Header
function Header({ onOpenCart, cartCount, user, onLogout }) {
  return (
    <header className="header">
      <div className="logo">Hunger Hub</div>
      <nav>
        {user && <span className="muted">Hello, {user.email}</span>}
        {user && (
          <button className="btn ghost" onClick={onLogout}>
            Sign Out
          </button>
        )}
        <button className="btn primary" onClick={onOpenCart}>
          Cart ({cartCount})
        </button>
      </nav>
    </header>
  );
}

// Restaurant card
function RestaurantCard({ r, onOpen }) {
  return (
    <article className="card" onClick={() => onOpen(r)}>
      <div className="card-body">
        <h3>{r.name}</h3>
        <p className="muted">
          {r.cuisine} • {r.eta}
        </p>
        <div className="rating">⭐ {r.rating}</div>
      </div>
    </article>
  );
}

// Menu
function Menu({ restaurant, onAdd }) {
  if (!restaurant)
    return <div className="panel">Select a restaurant to view menu.</div>;
  return (
    <div className="panel">
      <h2>{restaurant.name} — Menu</h2>
      <div className="menu-grid">
        {restaurant.menu.map((item) => (
          <div key={item.id} className="menu-item">
            <div>
              <div className="item-name">{item.name}</div>
              <div className="muted">₹{item.price}</div>
            </div>
            <button className="btn" onClick={() => onAdd(item)}>
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Cart
function Cart({ items, onRemove, onCheckout }) {
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  return (
    <div className="cart">
      <h3>Your Cart</h3>
      {items.length === 0 && <div className="muted">Cart is empty</div>}
      {items.map((it) => (
        <div key={it.id} className="cart-row">
          <div>
            <div className="item-name">{it.name}</div>
            <div className="muted">
              ₹{it.price} × {it.qty}
            </div>
          </div>
          <div>
            <button className="btn small" onClick={() => onRemove(it.id)}>
              -
            </button>
          </div>
        </div>
      ))}
      <div className="cart-footer">
        <div>
          Subtotal: <strong>₹{subtotal}</strong>
        </div>
        <button
          className="btn primary"
          onClick={onCheckout}
          disabled={items.length === 0}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

// Main App
export default function App() {
  const [restaurants] = useState(RESTAURANTS);
  const [selected, setSelected] = useState(RESTAURANTS[0]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [user, setUser] = useState(null); // logged-in user

  // Add item to cart
  function handleAdd(item) {
    setCart((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found)
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      return [...prev, { ...item, qty: 1 }];
    });
  }

  // Remove item from cart
  function handleRemove(id) {
    setCart((prev) => {
      const found = prev.find((p) => p.id === id);
      if (!found) return prev;
      if (found.qty === 1) return prev.filter((p) => p.id !== id);
      return prev.map((p) => (p.id === id ? { ...p, qty: p.qty - 1 } : p));
    });
  }

  // Checkout
  function handleCheckout() {
    const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
    setOrderPlaced({ id: Date.now(), total, items: cart });
    setCart([]);
    setCartOpen(false);
  }

  // Logout
  function handleLogout() {
    setUser(null);
    setCart([]);
    setOrderPlaced(null);
  }

  // If not logged in, show auth page
  if (!user) {
    return <AuthPage onAuth={setUser} />;
  }

  return (
    <div className="app">
      <Header
        onOpenCart={() => setCartOpen(true)}
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
        user={user}
        onLogout={handleLogout}
      />
      <main className="container">
        <aside className="sidebar">
          <h2>Restaurants</h2>
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} r={r} onOpen={setSelected} />
          ))}
        </aside>

        <section className="content">
          <Menu restaurant={selected} onAdd={handleAdd} />
        </section>

        <aside className={`drawer ${cartOpen ? "open" : ""}`}>
          <button className="close" onClick={() => setCartOpen(false)}>
            ✕
          </button>
          <Cart
            items={cart}
            onRemove={handleRemove}
            onCheckout={handleCheckout}
          />
          {orderPlaced && (
            <div className="order-confirm">
              <h4>Order #{orderPlaced.id}</h4>
              <p>₹{orderPlaced.total} — placed successfully.</p>
            </div>
          )}
        </aside>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} Hunger Hub — Logged in as {user.email}
      </footer>
    </div>
  );
}
