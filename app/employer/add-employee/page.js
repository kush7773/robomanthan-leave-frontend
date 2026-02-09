"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/auth";
import toast from "react-hot-toast";

export default function AddEmployeePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobRole, setJobRole] = useState("");

  const [casual, setCasual] = useState(12);
  const [sick, setSick] = useState(8);
  const [paid, setPaid] = useState(10);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getToken();
      const API_BASE = process.env.NEXT_PUBLIC_API_URL;

      const payload = {
        name,
        email,
        jobRole,
        balances: [
          { type: "Casual", total: Number(casual) },
          { type: "Sick", total: Number(sick) },
          { type: "Paid", total: Number(paid) },
        ],
      };

      const res = await fetch(`${API_BASE}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add employee");
      }

      toast.success("Employee added successfully");
      router.push("/employer");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* HEADER */}
      <div className="employee-header">
        <h2>Add New Employee</h2>
        <button
          className="secondary-btn"
          onClick={() => router.push("/employer")}
        >
          ← Back
        </button>
      </div>

      {/* FORM */}
      <section className="table-card">
        <div className="table-header">
          <h3>Employee Details</h3>
        </div>

        <form onSubmit={handleSubmit} className="form-container">
          {/* BASIC INFO */}
          <div className="form-group">
            <label>Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Job Role</label>
            <input
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            />
          </div>

          {/* LEAVE BALANCES */}
          <div className="table-header">
            <h3>Initial Leave Balances</h3>
          </div>

          <div className="form-group">
            <label>Casual Leaves</label>
            <input
              type="number"
              min="0"
              value={casual}
              onChange={(e) => setCasual(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Sick Leaves</label>
            <input
              type="number"
              min="0"
              value={sick}
              onChange={(e) => setSick(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Paid Leaves</label>
            <input
              type="number"
              min="0"
              value={paid}
              onChange={(e) => setPaid(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button className="primary-btn" disabled={loading}>
              {loading ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
