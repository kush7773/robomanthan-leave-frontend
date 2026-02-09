"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/utils/auth";
import toast from "react-hot-toast";

export default function EmployeeProfilePage() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadProfile() {
    try {
      const token = getToken();
      const API_BASE = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${API_BASE}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setProfile(data);
      setEmail(data.email || "");
      setPhone(data.phone || "");
    } catch (err) {
      console.error("Failed to load profile", err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    setSaving(true);
    try {
      const token = getToken();
      const API_BASE = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          phone,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) return <p className="page-loading">Loading profile...</p>;
  if (!profile) return <p className="page-error">Failed to load profile</p>;

  return (
    <div className="profile-page">
      {/* HEADER */}
      <div className="profile-header">
        <div className="profile-user">
          <div>
            <h2>{profile.name}</h2>
            <p>{profile.jobRole}</p>
          </div>
        </div>
      </div>

      {/* PERSONAL INFO */}
      <section className="profile-card">
        <h3>Personal Information</h3>

        <div className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input value={profile.name} disabled />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input value={profile.jobRole} disabled />
          </div>
        </div>

        <button
          className="primary-btn"
          onClick={saveProfile}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <a href="/employee/change-password" style={{ display: "inline-block", marginTop: "12px" }}>
          <button className="secondary-btn">
            Change Password
          </button>
        </a>
      </section>
    </div>
  );
}
