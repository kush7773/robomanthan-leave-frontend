"use client";

export default function ApprovedLeavesTable({ leaves = [] }) {
        if (!leaves.length) {
                return (
                        <section className="table-card">
                                <h3>Approved Leaves</h3>
                                <p style={{ color: "#6b7280", fontSize: "14px" }}>
                                        No approved leaves yet 📋
                                </p>
                        </section>
                );
        }

        return (
                <section className="table-card">
                        <div className="table-header">
                                <h3>Approved Leaves</h3>
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
                                                                <th>Status</th>
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

                                                                        <td>
                                                                                <span className="status-badge approved">
                                                                                        ✓ Approved
                                                                                </span>
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
                                                        <span className="status-badge approved">
                                                                ✓ Approved
                                                        </span>
                                                </div>
                                        </div>
                                ))}
                        </div>
                </section>
        );
}
