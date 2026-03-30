"use client";

import { useState } from "react";
import { getToken } from "@/utils/auth";
import toast from "react-hot-toast";

// Withdraw is allowed when:
//  - leave is PENDING (any date), OR
//  - leave is APPROVED AND it hasn't started yet (fromDate > today)
function canWithdraw(leave) {
  if (leave.status === "PENDING") return true;
  if (leave.status === "APPROVED") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(leave.fromDate);
    start.setHours(0, 0, 0, 0);
    return start > today;
  }
  return false;
}

export default function LeaveHistory({ leaves = [], onWithdraw }) {
  const [withdrawingId, setWithdrawingId] = useState(null);

  async function handleWithdraw(leaveId) {
    const token = getToken();
    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    try {
      setWithdrawingId(leaveId);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${API_BASE}/leaves/${leaveId}/withdraw`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to withdraw leave");
        return;
      }

      toast.success("Leave withdrawn successfully");
      if (onWithdraw) onWithdraw(); // refresh parent state
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setWithdrawingId(null);
    }
  }

  return (
    <section className="leave-history leave-history-section">
      <h3>My Leave History</h3>

      {/* ===== DESKTOP TABLE ===== */}
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Dates</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No leave records found
              </td>
            </tr>
          ) : (
            leaves.map((l) => (
              <tr key={l.id}>
                <td>{l.type}</td>
                <td>
                  {new Date(l.fromDate).toDateString()}{" "}
                  <b>to</b>{" "}
                  {new Date(l.toDate).toDateString()}
                </td>
                <td className={l.status.toLowerCase()}>{l.status}</td>
                <td>
                  {canWithdraw(l) && (
                    <button
                      className="withdraw-btn"
                      onClick={() => handleWithdraw(l.id)}
                      disabled={withdrawingId === l.id}
                    >
                      {withdrawingId === l.id ? "Withdrawing…" : "Withdraw"}
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ===== MOBILE CARDS ===== */}
      <div className="leave-history-mobile">
        {leaves.map((l) => (
          <div key={l.id} className="leave-history-card">
            <strong>{l.type} Leave</strong>

            <p>
              <b>From:</b>{" "}
              {new Date(l.fromDate).toDateString()}
            </p>

            <p>
              <b>To:</b>{" "}
              {new Date(l.toDate).toDateString()}
            </p>

            <span className={`status ${l.status.toLowerCase()}`}>
              {l.status}
            </span>

            {canWithdraw(l) && (
              <button
                className="withdraw-btn"
                style={{ marginTop: "10px" }}
                onClick={() => handleWithdraw(l.id)}
                disabled={withdrawingId === l.id}
              >
                {withdrawingId === l.id ? "Withdrawing…" : "Withdraw"}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
