"use client";

import { useState } from "react";
import { getToken } from "@/utils/auth";
import toast from "react-hot-toast";

export default function PendingLeavesTable({ leaves = [], onAction }) {
  const [loading, setLoading] = useState({ id: null, action: null });

  async function handleAction(id, action) {
    try {
      setLoading({ id, action });

      const token = getToken();
      const API_BASE = process.env.NEXT_PUBLIC_API_URL;

      const url =
        action === "approve"
          ? `${API_BASE}/leaves/${id}/approve`
          : `${API_BASE}/leaves/${id}/reject`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Action failed");
        return;
      }

      toast.success(`Leave ${action.toUpperCase()} successful`);
      onAction?.();
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading({ id: null, action: null });
    }
  }

  if (!leaves.length) {
    return (
      <section className="table-card">
        <h3>Pending Leave Requests</h3>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>
          No pending leave requests 🎉
        </p>
      </section>
    );
  }

  return (
    <section className="table-card">
      <div className="table-header">
        <h3>Pending Leave Requests</h3>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="desktop-only">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id}>
                  <td>
                    <div className="employee-cell">
                      <strong>{leave.user?.name || "Employee"}</strong>
                      <span>{leave.user?.email}</span>
                    </div>
                  </td>

                  <td>{leave.type}</td>

                  <td>
                    {new Date(leave.fromDate).toDateString()} –{" "}
                    {new Date(leave.toDate).toDateString()}
                  </td>

                  <td className="reason-cell">{leave.reason}</td>

                  <td className="action-cell">
                    {/* APPROVE */}
                    <button
                      className="approve-btn"
                      disabled={
                        loading.id === leave.id &&
                        loading.action === "approve"
                      }
                      onClick={() =>
                        handleAction(leave.id, "approve")
                      }
                    >
                      {loading.id === leave.id &&
                      loading.action === "approve"
                        ? "Approving..."
                        : "Approve"}
                    </button>

                    {/* REJECT */}
                    <button
                      className="reject-btn"
                      disabled={
                        loading.id === leave.id &&
                        loading.action === "reject"
                      }
                      onClick={() =>
                        handleAction(leave.id, "reject")
                      }
                    >
                      {loading.id === leave.id &&
                      loading.action === "reject"
                        ? "Rejecting..."
                        : "Reject"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="mobile-only">
        {leaves.map((leave) => (
          <div key={leave.id} className="pending-mobile-card">
            <div className="pending-info">
              <strong>{leave.user?.name || "Employee"}</strong>
              <p className="muted">{leave.type} Leave</p>
              <p className="muted">
                {new Date(leave.fromDate).toDateString()} →{" "}
                {new Date(leave.toDate).toDateString()}
              </p>
              <p className="muted">{leave.reason}</p>
            </div>

            <div className="pending-actions">
              {/* APPROVE */}
              <button
                className="approve-btn"
                disabled={
                  loading.id === leave.id &&
                  loading.action === "approve"
                }
                onClick={() =>
                  handleAction(leave.id, "approve")
                }
              >
                {loading.id === leave.id &&
                loading.action === "approve"
                  ? "Approving..."
                  : "Approve"}
              </button>

              {/* REJECT */}
              <button
                className="reject-btn"
                disabled={
                  loading.id === leave.id &&
                  loading.action === "reject"
                }
                onClick={() =>
                  handleAction(leave.id, "reject")
                }
              >
                {loading.id === leave.id &&
                loading.action === "reject"
                  ? "Rejecting..."
                  : "Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
