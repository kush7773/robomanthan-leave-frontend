"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const SECTIONS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "pending", label: "Pending Requests" },
  { id: "employees", label: "Employees" },
  { id: "reports", label: "Reports" },
];

export default function Sidebar({ open, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState("dashboard");

  // ✅ Highlight on scroll (desktop + mobile)
  useEffect(() => {
    if (pathname !== "/employer") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    SECTIONS.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const goToSection = (id) => {
    setActive(id);
    onClose?.();

    if (pathname !== "/employer") {
      router.push(`/employer#${id}`);
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const logout = () => {
    // clearAuth();
    router.push("/login");
  };

  return (
    <>
      {/* ✅ OVERLAY (mobile) */}
      {open && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo" />
          <span>ROBOMANTHAN</span>

          {/* ❌ close button (mobile only) */}
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {SECTIONS.map((item) => (
            <a
              key={item.id}
              className={active === item.id ? "active" : ""}
              onClick={() => goToSection(item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-logout">
          <button onClick={logout}>Logout</button>
        </div>
      </aside>
    </>
  );
}
