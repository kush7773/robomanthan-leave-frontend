"use client";

import { useCallback, useEffect, useState } from "react";
import LeaveCards from "./components/LeaveCards";
import ApplyLeaveForm from "./components/ApplyLeaveForm";
import LeaveHistory from "./components/LeaveHistory";
import { getToken } from "@/utils/auth";

export default function EmployeePage() {
  const [employeeName, setEmployeeName] = useState("");
  const [balances, setBalances] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    const token = getToken();
    const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    // 1️⃣ Load dashboard data (balances + leaves)
    fetch(`${API_BASE}/dashboard/employee`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setBalances(data.leaveBalances || []);
        setLeaves(data.leaves || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const token = getToken();
    const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    // 2️⃣ Load profile ONLY for name (once)
    fetch(`${API_BASE}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setEmployeeName(data.name))
      .catch(console.error)
      .finally(() => setLoading(false));

    loadData();
  }, [loadData]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <>
      <div id="top"></div>

      <section id="dashboard">
        <div className="employee-header">
          <div className="user-info">{employeeName}</div>
        </div>

        <LeaveCards balances={balances} />
      </section>

      <section id="apply-leave">
        <ApplyLeaveForm onApplied={loadData} />
      </section>

      <section id="leave-history">
        <LeaveHistory leaves={leaves} onWithdraw={loadData} />
      </section>
    </>
  );
}
