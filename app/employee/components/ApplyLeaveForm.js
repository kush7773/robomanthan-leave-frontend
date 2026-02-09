"use client";

import { useState } from "react";
import { getToken } from "@/utils/auth";
import toast from "react-hot-toast";

export default function ApplyLeaveForm() {
  const [type, setType] = useState("Sick");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitLeave() {
    if (!fromDate || !toDate) {
      toast.error("Please select both From and To dates");
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      toast.error("From date cannot be after To date");
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    try {
      setSubmitting(true);

      const API_BASE = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${API_BASE}/leaves/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          fromDate,
          toDate,
          reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to apply leave");
        return;
      }

      toast.success("Leave applied successfully");

      // reset form
      setReason("");
      setFromDate("");
      setToDate("");
      setType("Sick");
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="apply-leave">
      <h3>Apply for Leave</h3>

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Sick">Sick</option>
        <option value="Casual">Casual</option>
        <option value="Paid">Paid</option>
      </select>

      {/* FROM / TO */}
      <div className="date-row">
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "13px", color: "#6b7280" }}>From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "13px", color: "#6b7280" }}>To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      <textarea
        placeholder="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <button onClick={submitLeave} disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Request"}
      </button>
    </div>
  );
}
