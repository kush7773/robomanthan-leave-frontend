"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "../../../utils/auth";

const SECTIONS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "apply-leave", label: "Apply for Leave" },
  { id: "leave-history", label: "My Leave History" },
];

export default function Sidebar({ open, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState("dashboard");

  // ✅ Scroll-based active section detection
  useEffect(() => {
    if (pathname !== "/employee") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        root: null,
        threshold: 0.6, // section must be 60% visible
      }
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

    if (pathname !== "/employee") {
      router.push(`/employee#${id}`);
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const goToProfile = () => {
    setActive("profile");
    onClose?.();
    router.push("/employee/profile");
  };

  const handleLogout = () => {
    logout()
    router.push("/login");
  };

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo" />
          <span>ROBOMANTHAN</span>
          <button className="close-btn" onClick={onClose}>✕</button>
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

          <a
            className={active === "profile" ? "active" : ""}
            onClick={goToProfile}
          >
            Profile
          </a>
        </nav>

        <div className="sidebar-logout">
          <button onClick={handleLogout}>⏻ Logout</button>
        </div>
      </aside>
    </>
  );
}
