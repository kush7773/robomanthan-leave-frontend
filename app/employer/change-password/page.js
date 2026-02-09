"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/auth";
import toast from "react-hot-toast";

export default function ChangePasswordPage() {
        const router = useRouter();

        const [currentPassword, setCurrentPassword] = useState("");
        const [newPassword, setNewPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const [loading, setLoading] = useState(false);

        async function handleSubmit(e) {
                e.preventDefault();

                if (newPassword !== confirmPassword) {
                        toast.error("New passwords do not match");
                        return;
                }

                if (newPassword.length < 8) {
                        toast.error("Password must be at least 8 characters");
                        return;
                }

                setLoading(true);

                try {
                        const token = getToken();
                        const API_BASE = process.env.NEXT_PUBLIC_API_URL;

                        const res = await fetch(`${API_BASE}/auth/change-password`, {
                                method: "POST",
                                headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({ currentPassword, newPassword }),
                        });

                        const data = await res.json();

                        if (!res.ok) {
                                throw new Error(data.message || "Failed to change password");
                        }

                        toast.success("Password changed successfully");
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");

                        setTimeout(() => {
                                router.push("/employer");
                        }, 1500);
                } catch (err) {
                        console.error(err);
                        toast.error(err.message || "Failed to change password");
                } finally {
                        setLoading(false);
                }
        }

        return (
                <div className="employee-view-page">
                        {/* HEADER */}
                        <div className="employee-header">
                                <h2>Change Password</h2>
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
                                        <h3>Update Your Password</h3>
                                </div>

                                <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
                                        <div className="form-group" style={{ marginBottom: "20px" }}>
                                                <label><b>Current Password</b></label>
                                                <input
                                                        type="password"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        required
                                                        style={{
                                                                width: "100%",
                                                                padding: "10px",
                                                                borderRadius: "6px",
                                                                border: "1px solid #d1d5db",
                                                                marginTop: "6px",
                                                        }}
                                                />
                                        </div>

                                        <div className="form-group" style={{ marginBottom: "20px" }}>
                                                <label><b>New Password</b></label>
                                                <input
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        required
                                                        style={{
                                                                width: "100%",
                                                                padding: "10px",
                                                                borderRadius: "6px",
                                                                border: "1px solid #d1d5db",
                                                                marginTop: "6px",
                                                        }}
                                                />
                                                <small style={{ color: "#6b7280", fontSize: "12px" }}>
                                                        Must be at least 8 characters with uppercase, lowercase, number & symbol
                                                </small>
                                        </div>

                                        <div className="form-group" style={{ marginBottom: "24px" }}>
                                                <label><b>Confirm New Password</b></label>
                                                <input
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required
                                                        style={{
                                                                width: "100%",
                                                                padding: "10px",
                                                                borderRadius: "6px",
                                                                border: "1px solid #d1d5db",
                                                                marginTop: "6px",
                                                        }}
                                                />
                                        </div>

                                        <button
                                                type="submit"
                                                className="primary-btn"
                                                disabled={loading}
                                                style={{ width: "100%" }}
                                        >
                                                {loading ? "Changing Password..." : "Change Password"}
                                        </button>
                                </form>
                        </section>
                </div>
        );
}
