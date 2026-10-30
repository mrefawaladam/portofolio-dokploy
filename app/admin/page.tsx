"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FolderGit2, Boxes, Newspaper, Briefcase, GraduationCap,
  Layers, TrendingUp, Plus, Edit2, Trash2, KeyRound, LogOut,
  RefreshCw, CheckCircle, AlertCircle, ArrowLeft, ExternalLink
} from "lucide-react";

type TabKey = "projects" | "products" | "news" | "experiences" | "educations" | "stacks" | "impact";

interface TabConfig {
  key: TabKey;
  label: string;
  icon: any;
  singular: string;
  fields: { name: string; label: string; type: "text" | "textarea" | "number" | "boolean" | "tags"; required?: boolean }[];
}

const TABS: TabConfig[] = [
  {
    key: "projects",
    label: "Projects",
    icon: FolderGit2,
    singular: "Project",
    fields: [
      { name: "title", label: "Project Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "category", label: "Category (e.g. Backend, Full Stack, Architecture)", type: "text" },
      { name: "tags", label: "Tags (comma-separated, e.g. Golang, RabbitMQ, Docker)", type: "tags" },
      { name: "demo_url", label: "Demo / Live URL", type: "text" },
      { name: "github_url", label: "GitHub URL", type: "text" },
      { name: "metrics", label: "Key Metrics (e.g. -35% Latency)", type: "text" },
      { name: "featured", label: "Featured on Homepage", type: "boolean" },
      { name: "order_index", label: "Display Order (1, 2, 3...)", type: "number" },
    ],
  },
  {
    key: "products",
    label: "Products",
    icon: Boxes,
    singular: "Product",
    fields: [
      { name: "name", label: "Product Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "headline", label: "Headline", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "status", label: "Status (Live, Beta, In Development, Concept)", type: "text" },
      { name: "pricing_type", label: "Pricing Type (Open Source, Free, Freemium, Commercial)", type: "text" },
      { name: "product_url", label: "Product URL", type: "text" },
      { name: "github_url", label: "GitHub URL", type: "text" },
      { name: "badge", label: "Badge (e.g. v1.2, Popular, New)", type: "text" },
      { name: "icon_name", label: "Icon Name (Network, Cpu, Layers3, Boxes)", type: "text" },
      { name: "order_index", label: "Display Order", type: "number" },
    ],
  },
  {
    key: "news",
    label: "News & Articles",
    icon: Newspaper,
    singular: "Article",
    fields: [
      { name: "title", label: "Article Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "excerpt", label: "Excerpt Summary", type: "textarea", required: true },
      { name: "content", label: "Full Content", type: "textarea" },
      { name: "category", label: "Category (Architecture, Engineering, Milestone)", type: "text" },
      { name: "read_time", label: "Read Time (e.g. 4 min read)", type: "text" },
      { name: "tags", label: "Tags (comma-separated)", type: "tags" },
      { name: "published", label: "Published Status", type: "boolean" },
    ],
  },
  {
    key: "experiences",
    label: "Experience",
    icon: Briefcase,
    singular: "Experience",
    fields: [
      { name: "role", label: "Job Role", type: "text", required: true },
      { name: "company", label: "Company Name", type: "text", required: true },
      { name: "brand", label: "Brand / Work Type (e.g. Nexmedis · Full-time)", type: "text", required: true },
      { name: "period", label: "Period (e.g. MAR 2025 — APR 2026)", type: "text", required: true },
      { name: "detail", label: "Job Details & Achievements", type: "textarea", required: true },
      { name: "tags", label: "Tech Stack Tags (comma-separated)", type: "tags" },
      { name: "url", label: "Company Website URL", type: "text" },
      { name: "order_index", label: "Display Order", type: "number" },
    ],
  },
  {
    key: "educations",
    label: "Education",
    icon: GraduationCap,
    singular: "Education",
    fields: [
      { name: "institution", label: "Institution", type: "text", required: true },
      { name: "degree", label: "Degree / Program", type: "text", required: true },
      { name: "period", label: "Period (e.g. Jan 2020 — Dec 2024)", type: "text", required: true },
      { name: "detail", label: "Specialization & Notes", type: "textarea" },
      { name: "order_index", label: "Display Order", type: "number" },
    ],
  },
  {
    key: "stacks",
    label: "Tech Stacks",
    icon: Layers,
    singular: "Tech Stack",
    fields: [
      { name: "title", label: "Category Title (e.g. Backend engineering)", type: "text", required: true },
      { name: "icon_name", label: "Icon Name (ServerCog, Braces, Network, Database, Workflow)", type: "text" },
      { name: "note", label: "Description Note", type: "textarea", required: true },
      { name: "tags", label: "Technologies (comma-separated)", type: "tags" },
      { name: "grid_span", label: "Grid Span (e.g. lg:col-span-3, lg:col-span-2)", type: "text" },
      { name: "order_index", label: "Display Order", type: "number" },
    ],
  },
  {
    key: "impact",
    label: "Impact Metrics",
    icon: TrendingUp,
    singular: "Metric",
    fields: [
      { name: "metric", label: "Metric Stat (e.g. +70%, -35%)", type: "text", required: true },
      { name: "title", label: "Metric Title", type: "text", required: true },
      { name: "detail", label: "Context Detail", type: "textarea", required: true },
      { name: "order_index", label: "Display Order", type: "number" },
    ],
  },
];

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabKey>("projects");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("refa_admin_key");
    if (saved) {
      setAdminKey(saved);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchItems();
    }
  }, [isAuthenticated, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secretKey: inputKey }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      localStorage.setItem("refa_admin_key", inputKey);
      setAdminKey(inputKey);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("refa_admin_key");
    setAdminKey("");
    setIsAuthenticated(false);
  };

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/${activeTab}`, {
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch items");
      }
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const currentTabConfig = TABS.find((t) => t.key === activeTab)!;

  const openCreateModal = () => {
    setEditingItem(null);
    const initial: Record<string, any> = {};
    currentTabConfig.fields.forEach((f) => {
      if (f.type === "boolean") initial[f.name] = false;
      else if (f.type === "number") initial[f.name] = (items.length + 1);
      else if (f.type === "tags") initial[f.name] = "";
      else initial[f.name] = "";
    });
    setFormData(initial);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    const formatted: Record<string, any> = { ...item };
    currentTabConfig.fields.forEach((f) => {
      if (f.type === "tags" && Array.isArray(item[f.name])) {
        formatted[f.name] = item[f.name].join(", ");
      }
    });
    setFormData(formatted);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title?: string) => {
    if (!confirm(`Are you sure you want to delete ${title ? `"${title}"` : "this item"}?`)) {
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/admin/${activeTab}/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      setSuccessMsg("Deleted successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchItems();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload: Record<string, any> = {};
    currentTabConfig.fields.forEach((f) => {
      const val = formData[f.name];
      if (f.type === "tags") {
        payload[f.name] = typeof val === "string"
          ? val.split(",").map((s) => s.trim()).filter(Boolean)
          : Array.isArray(val) ? val : [];
      } else if (f.type === "number") {
        payload[f.name] = val !== "" && !isNaN(Number(val)) ? Number(val) : 0;
      } else if (f.type === "boolean") {
        payload[f.name] = Boolean(val);
      } else {
        payload[f.name] = val || null;
      }
    });

    try {
      const url = editingItem
        ? `/api/admin/${activeTab}/${editingItem.id}`
        : `/api/admin/${activeTab}`;
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Save failed");
      }

      setSuccessMsg(editingItem ? "Updated successfully!" : "Created successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
      setIsModalOpen(false);
      fetchItems();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Auth gate render
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1020] px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl text-white shadow-2xl">
          <div className="flex flex-col items-center text-center mb-6">
            <Image
              src="/logo-light.png"
              alt="mrefawm"
              width={160}
              height={53}
              priority
              className="h-10 w-auto object-contain mb-3"
            />
            <h1 className="text-lg font-bold tracking-tight text-white">Portfolio Admin Portal</h1>
            <p className="text-xs text-white/50 mt-0.5">Dokploy PostgreSQL Content Management System</p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/20 border border-red-500/40 p-3 text-xs text-red-200">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5 font-medium">
                Admin Secret Key
              </label>
              <input
                type="password"
                placeholder="e.g. refa-admin-2026"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                required
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-110 active:scale-[0.98]"
            >
              Sign In to Admin
            </button>
            <div className="text-center pt-2">
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:underline">
                <ArrowLeft size={13} /> Back to Portfolio
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-85">
            <Image
              src="/logo-dark.png"
              alt="mrefawm"
              width={120}
              height={40}
              className="h-7 w-auto object-contain"
            />
            <span className="text-blue-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">Admin</span>
          </Link>
          <span className="hidden sm:inline text-xs text-slate-400">|</span>
          <Link href="/" target="_blank" className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition">
            View Live Site <ExternalLink size={12} />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchItems}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            <div className="flex items-center gap-2"><AlertCircle size={18} /> {error}</div>
            <button onClick={() => setError(null)} className="text-red-500 font-bold">✕</button>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">
            <CheckCircle size={18} /> {successMsg}
          </div>
        )}

        {/* Tab Selection */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Header Action & Stats */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              <currentTabConfig.icon className="text-blue-600" size={24} />
              {currentTabConfig.label} Management
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Currently showing {items.length} {currentTabConfig.label.toLowerCase()} stored in PostgreSQL.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:brightness-105"
          >
            <Plus size={16} /> Add New {currentTabConfig.singular}
          </button>
        </div>

        {/* Table / List View */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-400 animate-pulse">
              Loading {currentTabConfig.label}...
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm font-semibold text-slate-600">No {currentTabConfig.label.toLowerCase()} found.</p>
              <p className="text-xs text-slate-400 mt-1">Click &quot;Add New {currentTabConfig.singular}&quot; to create your first record.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Title / Primary</th>
                    <th className="px-6 py-4">Key Info</th>
                    <th className="px-6 py-4">Tags / Meta</th>
                    <th className="px-6 py-4 text-center">Order</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => {
                    const primaryTitle = item.title || item.name || item.role || item.institution || item.metric || "Untitled";
                    const subtitle = item.tagline || item.headline || item.company || item.degree || item.note || item.excerpt || "";
                    const tags = item.tags || (item.category ? [item.category] : []);

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 text-sm">{primaryTitle}</div>
                          {subtitle && <div className="text-slate-500 text-xs mt-0.5 line-clamp-1 max-w-sm">{subtitle}</div>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-slate-600 font-medium">
                            {item.brand || item.period || item.pricing_type || item.read_time || item.slug || "-"}
                          </div>
                          {item.metrics && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">
                              {item.metrics}
                            </span>
                          )}
                          {item.featured && (
                            <span className="inline-block ml-1 mt-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                              ★ Featured
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {Array.isArray(tags) && tags.slice(0, 4).map((tg: string) => (
                              <span key={tg} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 font-semibold">
                                {tg}
                              </span>
                            ))}
                            {Array.isArray(tags) && tags.length > 4 && (
                              <span className="text-[10px] text-slate-400">+{tags.length - 4} more</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-xs text-slate-500">
                          {item.order_index ?? "-"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(item)}
                              className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition"
                              title="Edit item"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, primaryTitle)}
                              className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
                              title="Delete item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingItem ? `Edit ${currentTabConfig.singular}` : `Add New ${currentTabConfig.singular}`}
                </h3>
                <p className="text-xs text-slate-400">Fill in the fields below to update PostgreSQL database.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {currentTabConfig.fields.map((field) => {
                if (field.type === "textarea") {
                  return (
                    <div key={field.name}>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <textarea
                        rows={3}
                        value={formData[field.name] || ""}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        required={field.required}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                      />
                    </div>
                  );
                }

                if (field.type === "boolean") {
                  return (
                    <div key={field.name} className="flex items-center gap-3 py-1">
                      <input
                        type="checkbox"
                        id={field.name}
                        checked={Boolean(formData[field.name])}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={field.name} className="text-xs font-semibold text-slate-700">
                        {field.label}
                      </label>
                    </div>
                  );
                }

                return (
                  <div key={field.name}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={field.type === "number" ? "number" : "text"}
                      value={formData[field.name] ?? ""}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      required={field.required}
                      placeholder={field.type === "tags" ? "e.g. Next.js, Golang, RabbitMQ" : ""}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                );
              })}

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingItem ? "Update Changes" : "Save to Database"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
