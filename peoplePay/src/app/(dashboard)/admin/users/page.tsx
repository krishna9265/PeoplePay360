"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Plus,
  Search,
  Filter,
  UserCheck,
  UserX,
  Edit,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Mail,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRoleId, setFormRoleId] = useState("");
  const [formEmpId, setFormEmpId] = useState("");
  const [formActive, setFormActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [usersRes, empsRes, rolesRes] = await Promise.all([
        fetch("/api/v1/users").then((r) => r.json()).catch(() => []),
        fetch("/api/v1/employees").then((r) => r.json()).catch(() => []),
        fetch("/api/v1/roles").then((r) => r.json()).catch(() => []),
      ]);

      if (Array.isArray(usersRes)) setUsers(usersRes);
      if (Array.isArray(empsRes)) setEmployees(empsRes);
      if (Array.isArray(rolesRes) && rolesRes.length > 0) {
        setRoles(rolesRes);
      } else if (Array.isArray(usersRes)) {
        const distinctRoles = Array.from(
          new Map(usersRes.filter((u) => u.role).map((u) => [u.role.id, u.role])).values()
        );
        setRoles(distinctRoles);
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to load user accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormEmail("");
    setFormPassword("");
    setFormRoleId(roles[0]?.id || "");
    setFormEmpId("");
    setFormActive(true);
    setStatusMsg(null);
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormEmail(user.workEmail);
    setFormPassword("");
    setFormRoleId(user.role?.id || "");
    setFormEmpId(user.employee?.id || "");
    setFormActive(user.active);
    setStatusMsg(null);
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    try {
      if (editingUser) {
        // Edit user
        const res = await fetch(`/api/v1/users/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workEmail: formEmail,
            roleId: formRoleId,
            employeeId: formEmpId || null,
            active: formActive,
            password: formPassword || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Update failed");
      } else {
        // Create user
        if (!formPassword) throw new Error("Password is required for new user");
        const res = await fetch("/api/v1/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workEmail: formEmail,
            password: formPassword,
            roleId: formRoleId,
            employeeId: formEmpId || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Creation failed");
      }

      setModalOpen(false);
      setStatusMsg("User saved successfully.");
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (user: any) => {
    try {
      await fetch(`/api/v1/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !user.active }),
      });
      await loadData();
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter && u.role?.name !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const email = u.workEmail?.toLowerCase() || "";
      const emp = u.employee?.fullName?.toLowerCase() || "";
      return email.includes(q) || emp.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-blue-400" />
            User Account Management
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            System administration: credential provisioning, employee linking, and role access control (Admin only).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Create User
          </Button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {statusMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by work email or linked employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-blue-500 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-500" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-zinc-950/70 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="HR Manager">HR Manager</option>
              <option value="HR Payroll User">HR Payroll User</option>
              <option value="HR Payroll Manager">HR Payroll Manager</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-zinc-400 font-mono">
          {filteredUsers.length} user accounts
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-md shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="text-xs uppercase bg-zinc-800/40 text-zinc-400 font-mono">
              <tr>
                <th className="px-6 py-4 font-semibold rounded-tl-xl">Work Email</th>
                <th className="px-6 py-4 font-semibold">Assigned Role</th>
                <th className="px-6 py-4 font-semibold">Linked Employee</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Created</th>
                <th className="px-6 py-4 font-semibold rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-500">
                    Loading user accounts...
                  </td>
                </tr>
              ) : filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-white font-mono text-xs">
                    {u.workEmail}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded text-xs font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700">
                      {u.role?.name || "No Role"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {u.employee ? (
                      <span className="text-blue-400 font-medium">
                        {u.employee.fullName} ({u.employee.jobPosition || "Staff"})
                      </span>
                    ) : (
                      <span className="text-zinc-500 italic">None (System Admin)</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(u)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition ${
                        u.active
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                          : "bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25"
                      }`}
                    >
                      {u.active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                      {u.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-zinc-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openEditModal(u)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-500">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Create/Edit Modal (Screen 3) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                {editingUser ? "Edit User Account" : "Create New User Account"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="text-zinc-300 block mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="user@peoplepay360.demo"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-300 block mb-1">
                  {editingUser ? "Change Password (leave blank to keep)" : "Password *"}
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder={editingUser ? "••••••••" : "Enter password"}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-zinc-300 block mb-1">Role *</label>
                <select
                  required
                  value={formRoleId}
                  onChange={(e) => setFormRoleId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-blue-500"
                >
                  <option value="">Select Role...</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1">Linked Employee (Optional)</label>
                <select
                  value={formEmpId}
                  onChange={(e) => setFormEmpId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-blue-500"
                >
                  <option value="">None (System / Admin account)</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.workEmail})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="userActive"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="rounded bg-zinc-950 border-zinc-800 text-blue-600 focus:ring-0"
                />
                <label htmlFor="userActive" className="text-zinc-300 cursor-pointer">
                  Account is Active (can authenticate)
                </label>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20"
                >
                  {saving ? "Saving..." : "Save Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
