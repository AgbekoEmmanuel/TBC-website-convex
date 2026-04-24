import React from "react";
import { Shield, Key, Mail, Pencil, MoreVertical, Plus } from "lucide-react";
import { Card } from "../components/ui/card";
import { cn } from "../lib/utils";

function AdminStatCard({
  title, value, badgeText, icon: Icon
}: {
  title: string, value: string | number, badgeText?: string, icon: any
}) {
  return (
    <Card className="p-6 md:p-8 flex flex-col bg-white dark:bg-[#061b30] border-transparent dark:border-transparent shadow-sm dark:shadow-none rounded-[24px] relative overflow-hidden transition-colors w-full h-[180px]">
      <div className="flex items-center gap-2 mb-auto z-10">
        <Icon className="w-[18px] h-[18px] text-slate-500 dark:text-[#8ba4b3]" />
        <h3 className="text-[14px] font-medium text-slate-600 dark:text-[#8ba4b3]">{title}</h3>
      </div>
      
      <div className="flex items-center gap-4 z-10">
        <h2 className="font-serif text-[42px] text-slate-900 dark:text-white leading-none">{value}</h2>
        {badgeText && (
          <span className="bg-slate-100 dark:bg-[#0b2b46]/50 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-[#8ba4b3] text-[12px] font-medium px-2.5 py-1 rounded-md">
            {badgeText}
          </span>
        )}
      </div>

      {/* Watermark Icon */}
      <div className="absolute -right-6 -bottom-6 opacity-[0.03] dark:opacity-5 pointer-events-none">
        <Icon className="w-[120px] h-[120px] text-slate-900 dark:text-white" />
      </div>
    </Card>
  );
}

function AdminTable() {
  const admins = [
    { 
      name: "Elias Vance", email: "elias.vance@sanctuary.org", 
      role: "Senior Pastor", permissions: "Full Access", 
      status: "Active", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&h=100&q=80" 
    },
    { 
      name: "Sarah Jenkins", email: "sarah.j@sanctuary.org", 
      role: "Finance Officer", permissions: "Limited (Financial)", 
      status: "Active", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80" 
    },
    { 
      name: "Marcus Thorne", email: "marcus.t@sanctuary.org", 
      role: "Media Lead", permissions: "View Only", 
      status: "Inactive", avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=100&h=100&q=80" 
    },
  ];

  return (
    <Card className="bg-white dark:bg-[#061b30] border-transparent dark:border-transparent shadow-sm dark:shadow-none rounded-[24px] overflow-hidden transition-colors w-full p-0">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent">
              <th className="py-5 text-[11px] font-medium text-slate-500 dark:text-[#648496] uppercase tracking-wider pl-8 w-[35%]">Administrator</th>
              <th className="py-5 text-[11px] font-medium text-slate-500 dark:text-[#648496] uppercase tracking-wider w-[30%]">Role & Permissions</th>
              <th className="py-5 text-[11px] font-medium text-slate-500 dark:text-[#648496] uppercase tracking-wider w-[15%]">Status</th>
              <th className="py-5 text-[11px] font-medium text-slate-500 dark:text-[#648496] uppercase tracking-wider text-right pr-8">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, i) => (
              <tr key={i} className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                <td className="py-6 pl-8">
                  <div className="flex items-center gap-4">
                    <img src={admin.avatar} alt={admin.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="text-[15px] font-bold text-slate-900 dark:text-white mb-0.5">{admin.name}</h4>
                      <p className="text-[13px] text-slate-500 dark:text-[#648496]">{admin.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-6">
                  <div>
                    <span className="inline-block bg-slate-100 dark:bg-[#0b2b46]/50 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-[#8ba4b3] text-[12px] font-medium px-2.5 py-1 rounded-md mb-1">
                      {admin.role}
                    </span>
                    <p className="text-[13px] text-slate-500 dark:text-[#648496] block">{admin.permissions}</p>
                  </div>
                </td>
                <td className="py-6">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      admin.status === 'Active' ? "bg-green-500 dark:bg-white" : "bg-slate-300 dark:bg-slate-600"
                    )} />
                    <span className={cn(
                      "text-[13px] font-medium",
                      admin.status === 'Active' ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-[#648496]"
                    )}>{admin.status}</span>
                  </div>
                </td>
                <td className="py-6 pr-8 text-right">
                  <div className="flex items-center justify-end gap-3 text-slate-400 dark:text-[#648496]">
                    <button className="p-2 hover:text-slate-900 dark:hover:text-white transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button className="p-2 hover:text-slate-900 dark:hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function AdminManagement() {
  return (
    <div className="max-w-[1400px] mx-auto px-1 sm:px-2 md:px-0 text-[#112a46] dark:text-white mb-20 animate-in fade-in duration-300 pt-2 w-full">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 w-full">
        <div className="flex flex-col max-w-2xl">
          <h1 className="text-[32px] md:text-[38px] font-serif text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-3">
            Team Management
          </h1>
          <p className="text-[15px] font-medium text-slate-500 dark:text-[#648496] leading-relaxed">
            Oversee administrative access, roles, and permissions across the sanctuary portal.
          </p>
        </div>
        <div className="shrink-0 pt-1">
           <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 dark:bg-[#2b6ba3] px-5 py-3 text-[14px] font-medium text-white shadow-sm hover:bg-blue-700 dark:hover:bg-[#3478b5] transition-colors whitespace-nowrap">
             <Plus className="w-4 h-4" /> Add New Admin
           </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
        <AdminStatCard title="Total Administrators" value="12" badgeText="+2 this month" icon={Shield} />
        <AdminStatCard title="Full Access Roles" value="4" icon={Key} />
        <AdminStatCard title="Pending Invitations" value="3" icon={Mail} />
      </div>

      {/* Team Table */}
      <div className="w-full">
         <AdminTable />
      </div>
    </div>
  );
}
