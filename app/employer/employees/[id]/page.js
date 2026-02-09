"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getToken } from "@/utils/auth";
import toast from "react-hot-toast";

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [employee, setEmployee] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit mode state
  const [isEditingBalances, setIsEditingBalances] = useState(false);
  const [editedBalances, setEditedBalances] = useState([]);
  const [saving, setSaving] = useState(false);

  // Edit employee info state
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editedInfo, setEditedInfo] = useState({ name: "", jobRole: "", phone: "" });

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  function loadEmployeeData() {
    const token = getToken();

    Promise.all([
      fetch(`${API_BASE}/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),

      fetch(`${API_BASE}/employees/${id}/leaves`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
    ])
      .then(([empData, leaveData]) => {
        setEmployee(empData);
        setLeaves(Array.isArray(leaveData) ? leaveData : []);
        setEditedBalances(empData.leaveBalances || []);
        setEditedInfo({
          name: empData.name || "",
          jobRole: empData.jobRole || "",
          phone: empData.phone || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadEmployeeData();
  }, [id]);

  async function handleSaveInfo() {
    setSaving(true);
    try {
      const token = getToken();

      const res = await fetch(`${API_BASE}/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedInfo),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update employee");
      }

      toast.success("Employee information updated successfully");
      setIsEditingInfo(false);
      loadEmployeeData();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update employee");
    } finally {
      setSaving(false);
    }
  }

  function handleCancelInfoEdit() {
    setEditedInfo({
      name: employee.name || "",
      jobRole: employee.jobRole || "",
      phone: employee.phone || "",
    });
    setIsEditingInfo(false);
  }

  async function handleSaveBalances() {
    setSaving(true);
    try {
      const token = getToken();

      const res = await fetch(`${API_BASE}/employees/${id}/leave-balances`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ leaveBalances: editedBalances }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update leave balances");
      }

      toast.success("Leave balances updated successfully");
      setIsEditingBalances(false);
      loadEmployeeData();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update leave balances");
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    setEditedBalances(employee.leaveBalances || []);
    setIsEditingBalances(false);
  }

  function handleBalanceChange(type, field, value) {
    setEditedBalances((prev) =>
      prev.map((b) =>
        b.type === type ? { ...b, [field]: parseInt(value) || 0 } : b
      )
    );
  }

  async function handleDeleteEmployee() {
    if (!confirm(`Are you sure you want to delete ${employee.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = getToken();

      const res = await fetch(`${API_BASE}/employees/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete employee");
      }

      toast.success("Employee deleted successfully");
      router.push("/employer");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to delete employee");
    }
  }

  if (loading) return <p className="p-6">Loading employee details...</p>;

  if (!employee) {
    return (
      <div className="p-6">
        <p className="text-red-500">Employee not found</p>
        <button
          className="secondary-btn mt-4"
          onClick={() => router.push("/employer")}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="employee-view-page">
      {/* HEADER */}
      <div className="employee-header">
        <h2>{employee.name}</h2>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="secondary-btn"
            onClick={() => router.push("/employer")}
          >
            ← Back
          </button>
          <button
            className="delete-btn"
            onClick={handleDeleteEmployee}
          >
            Delete Employee
          </button>
        </div>
      </div>

      {/* BASIC INFO */}
      <section className="table-card">
        <div className="table-header">
          <h3>Employee Information</h3>
          {!isEditingInfo ? (
            <button
              className="primary-btn"
              onClick={() => setIsEditingInfo(true)}
            >
              Edit Info
            </button>
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="primary-btn"
                onClick={handleSaveInfo}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                className="secondary-btn"
                onClick={handleCancelInfoEdit}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div style={{ padding: "16px" }}>
          {isEditingInfo ? (
            <>
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label><b>Name:</b></label>
                <input
                  type="text"
                  value={editedInfo.name}
                  onChange={(e) => setEditedInfo({ ...editedInfo, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    marginTop: "4px",
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label><b>Designation:</b></label>
                <input
                  type="text"
                  value={editedInfo.jobRole}
                  onChange={(e) => setEditedInfo({ ...editedInfo, jobRole: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    marginTop: "4px",
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label><b>Phone:</b></label>
                <input
                  type="text"
                  value={editedInfo.phone}
                  onChange={(e) => setEditedInfo({ ...editedInfo, phone: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    marginTop: "4px",
                  }}
                />
              </div>
              <p><b>Email:</b> {employee.email} <span style={{ fontSize: "12px", color: "#6b7280" }}>(cannot be changed)</span></p>
              <p><b>Status:</b> {employee.isActive ? "Active" : "Inactive"}</p>
              <p>
                <b>Joined On:</b>{" "}
                {new Date(employee.createdAt).toLocaleDateString()}
              </p>
            </>
          ) : (
            <>
              <p><b>Name:</b> {employee.name}</p>
              <p><b>Email:</b> {employee.email}</p>
              <p><b>Designation:</b> {employee.jobRole || "-"}</p>
              <p><b>Phone:</b> {employee.phone || "-"}</p>
              <p><b>Status:</b> {employee.isActive ? "Active" : "Inactive"}</p>
              <p>
                <b>Joined On:</b>{" "}
                {new Date(employee.createdAt).toLocaleDateString()}
              </p>
            </>
          )}
        </div>
      </section>

      {/* LEAVE BALANCES */}
      <section className="table-card">
        <div className="table-header">
          <h3>Leave Balances</h3>
          {!isEditingBalances ? (
            <button
              className="primary-btn"
              onClick={() => setIsEditingBalances(true)}
            >
              Edit Balances
            </button>
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="primary-btn"
                onClick={handleSaveBalances}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                className="secondary-btn"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Total</th>
              <th>Used</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {(employee.leaveBalances || []).length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No leave balance records found
                </td>
              </tr>
            ) : isEditingBalances ? (
              editedBalances.map((b) => (
                <tr key={b.type}>
                  <td>{b.type}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={b.total}
                      onChange={(e) => handleBalanceChange(b.type, 'total', e.target.value)}
                      style={{
                        width: "80px",
                        padding: "6px",
                        borderRadius: "6px",
                        border: "1px solid #d1d5db",
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max={b.total}
                      value={b.used}
                      onChange={(e) => handleBalanceChange(b.type, 'used', e.target.value)}
                      style={{
                        width: "80px",
                        padding: "6px",
                        borderRadius: "6px",
                        border: "1px solid #d1d5db",
                      }}
                    />
                  </td>
                  <td>{b.total - b.used}</td>
                </tr>
              ))
            ) : (
              (employee.leaveBalances || []).map((b) => (
                <tr key={b.type}>
                  <td>{b.type}</td>
                  <td>{b.total}</td>
                  <td>{b.used}</td>
                  <td>{b.total - b.used}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* LEAVE HISTORY */}
      <section className="table-card leave-history-section">
        <div className="table-header">
          <h3>Leave History</h3>
        </div>

        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Reason</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No leave records found
                </td>
              </tr>
            ) : (
              leaves.map((l) => (
                <tr key={l.id}>
                  <td>{l.type}</td>
                  <td>{l.reason || "-"}</td>
                  <td>{new Date(l.fromDate).toLocaleDateString()}</td>
                  <td>{new Date(l.toDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status ${l.status.toLowerCase()}`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* MOBILE */}
        <div className="leave-history-mobile">
          {leaves.length === 0 ? (
            <p style={{ textAlign: "center" }}>
              No leave records found
            </p>
          ) : (
            leaves.map((l) => (
              <div key={l.id} className="leave-history-card">
                <strong>{l.type} Leave</strong>
                <p>{l.reason || "—"}</p>
                <p><b>From:</b> {new Date(l.fromDate).toLocaleDateString()}</p>
                <p><b>To:</b> {new Date(l.toDate).toLocaleDateString()}</p>
                <span className={`status ${l.status.toLowerCase()}`}>
                  {l.status}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
