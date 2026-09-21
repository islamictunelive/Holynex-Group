import React, { useState } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import { AdminUser, AdminRole, AdminPermissions } from '../../types';
import {
  ShieldCheck,
  UserPlus,
  Edit2,
  Trash2,
  KeyRound,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  ShieldAlert,
  Save,
  X,
} from 'lucide-react';

interface AdminUsersTabProps {
  currentUser: AdminUser | null;
  onRefresh: () => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({ currentUser, onRefresh }) => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<AdminUser[]>(() => Storage.getAdminUsers());
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'sub_admin' as AdminRole,
    email: '',
    phone: '',
    status: 'active' as 'active' | 'inactive',
    canManageApplications: true,
    canManageProducts: true,
    canManageNews: true,
    canManageSlides: true,
    canManageSettings: false,
    canManageAdmins: false,
  });

  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const refreshList = () => {
    setUsers(Storage.getAdminUsers());
    onRefresh();
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      password: '',
      name: '',
      role: 'sub_admin',
      email: '',
      phone: '',
      status: 'active',
      canManageApplications: true,
      canManageProducts: true,
      canManageNews: true,
      canManageSlides: true,
      canManageSettings: false,
      canManageAdmins: false,
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: user.password || '',
      name: user.name,
      role: user.role,
      email: user.email || '',
      phone: user.phone || '',
      status: user.status,
      canManageApplications: user.permissions.canManageApplications,
      canManageProducts: user.permissions.canManageProducts,
      canManageNews: user.permissions.canManageNews,
      canManageSlides: user.permissions.canManageSlides,
      canManageSettings: user.permissions.canManageSettings,
      canManageAdmins: user.permissions.canManageAdmins,
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.username.trim() || !formData.name.trim()) {
      setErrorMsg(t('ইউজারনেম এবং নাম পূরণ আবশ্যক', 'Username and name are required'));
      return;
    }

    if (!editingUser && !formData.password.trim()) {
      setErrorMsg(t('পাসওয়ার্ড প্রদান আবশ্যক', 'Password is required'));
      return;
    }

    const permissions: AdminPermissions = {
      canManageApplications: formData.canManageApplications,
      canManageProducts: formData.canManageProducts,
      canManageNews: formData.canManageNews,
      canManageSlides: formData.canManageSlides,
      canManageSettings: formData.role === 'super_admin' || formData.canManageSettings,
      canManageAdmins: formData.role === 'super_admin' || formData.canManageAdmins,
    };

    const userObj: AdminUser = {
      id: editingUser ? editingUser.id : `admin-${Date.now()}`,
      username: formData.username.trim().toLowerCase(),
      password: formData.password ? formData.password.trim() : (editingUser?.password || ''),
      name: formData.name.trim(),
      role: formData.role,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      status: formData.status,
      permissions,
      createdAt: editingUser ? editingUser.createdAt : new Date().toISOString(),
      lastLogin: editingUser?.lastLogin,
    };

    // Save locally
    Storage.saveAdminUser(userObj);

    // Save to server if online
    try {
      if (editingUser) {
        await fetch(`/api/admin/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userObj),
        });
      } else {
        await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userObj),
        });
      }
    } catch {
      // client fallback
    }

    setFeedbackMsg(
      editingUser
        ? t('অ্যাকাউন্ট সফলভাবে আপডেট করা হয়েছে', 'User updated successfully')
        : t('নতুন সাব-এডমিন তৈরি সম্পন্ন হয়েছে', 'New sub-admin created successfully')
    );
    setShowModal(false);
    refreshList();
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিত যে '${name}' অ্যাকাউন্টটি মুছে ফেলতে চান?`)) {
      return;
    }

    const success = Storage.deleteAdminUser(id);
    if (!success) {
      alert(t('প্রধান অ্যাডমিন অ্যাকাউন্ট মুছে ফেলা যাবে না!', 'Super Admin account cannot be deleted!'));
      return;
    }

    try {
      await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    } catch {}

    refreshList();
    setFeedbackMsg(t('অ্যাকাউন্ট মুছে ফেলা হয়েছে', 'Account removed successfully'));
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const isSuperAdmin = currentUser?.role === 'super_admin';

  return (
    <div className="space-y-6">
      {/* Top Header info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              {t('অ্যাডমিন ও সাব-এডমিন টিম ব্যবস্থাপনা', 'Admin & Sub-Admin Staff Management')}
            </h2>
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
              {users.length} {t('জন সদস্য', 'Members')}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {t(
              'প্রধান অ্যাডমিন এবং সাব-এডমিনদের তালিকা, অ্যাক্সেস অনুমতি ও অ্যাকাউন্ট নিয়ন্ত্রণ।',
              'Manage Super Admin and Sub-Admin accounts, credentials, and editorial permissions.'
            )}
          </p>
        </div>

        {isSuperAdmin && (
          <button
            id="btn-add-new-subadmin"
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-xs transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('নতুন সাব-এডমিন যোগ করুন', 'Add New Sub-Admin')}</span>
          </button>
        )}
      </div>

      {feedbackMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {users.map((user) => {
          const isUserSuperAdmin = user.role === 'super_admin';
          return (
            <div
              key={user.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-xs ${
                isUserSuperAdmin ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner ${
                      isUserSuperAdmin
                        ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950'
                        : 'bg-slate-800 text-amber-400'
                    }`}
                  >
                    {user.name.charAt(0) || 'A'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{user.name}</h3>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isUserSuperAdmin
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}
                      >
                        {isUserSuperAdmin ? t('প্রধান অ্যাডমিন', 'Super Admin') : t('সাব-এডমিন', 'Sub-Admin')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                      <span>@{user.username}</span>
                      <span>•</span>
                      <span
                        className={`inline-flex items-center gap-1 ${
                          user.status === 'active' ? 'text-emerald-600 font-semibold' : 'text-rose-500'
                        }`}
                      >
                        {user.status === 'active' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            {t('সক্রিয়', 'Active')}
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            {t('নিষ্ক্রিয়', 'Inactive')}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {isSuperAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(user)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title={t('সম্পাদনা করুন', 'Edit')}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {!isUserSuperAdmin && (
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title={t('মুছে ফেলুন', 'Delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Contact info */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.phone || t('ফোন নেই', 'No phone')}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{user.email || t('ইমেইল নেই', 'No email')}</span>
                </div>
              </div>

              {/* Permission tags */}
              <div className="mt-3.5">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  {t('কার্যক্রম অনুমতি (Permissions):', 'Permissions:')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-md ${
                      user.permissions.canManageApplications
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-400 line-through'
                    }`}
                  >
                    {t('ডিলার আবেদন', 'Applications')}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-md ${
                      user.permissions.canManageProducts
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-400 line-through'
                    }`}
                  >
                    {t('পণ্য তালিকা', 'Products')}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-md ${
                      user.permissions.canManageNews
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-400 line-through'
                    }`}
                  >
                    {t('সংবাদ ও নোটিশ', 'News')}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-md ${
                      user.permissions.canManageSlides
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-400 line-through'
                    }`}
                  >
                    {t('ব্যানার স্লাইডার', 'Slides')}
                  </span>
                  {isUserSuperAdmin && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 font-semibold">
                      {t('সকল সেটিংস ও অ্যাডমিন নিয়ন্ত্রণ', 'Full Root Control')}
                    </span>
                  )}
                </div>
              </div>

              {/* Last login info */}
              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {user.lastLogin
                      ? `${t('সর্বশেষ লগইন:', 'Last Login:')} ${new Date(user.lastLogin).toLocaleDateString()}`
                      : t('লগইন হিস্ট্রি নেই', 'No login recorded')}
                  </span>
                </div>
                {user.password && isSuperAdmin && (
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                    Pass: {user.password}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-900">
                  {editingUser
                    ? t('সাব-এডমিন অ্যাকাউন্ট সম্পাদনা', 'Edit Sub-Admin Account')
                    : t('নতুন সাব-এডমিন যোগ করুন', 'Add New Sub-Admin')}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('পূর্ণ নাম *', 'Full Name *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="যেমন: মোঃ সাব্বির আহমেদ"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('ইউজারনেম (লগইনের জন্য) *', 'Username *')}
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingUser && editingUser.role === 'super_admin'}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="e.g. subadmin2"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('পাসওয়ার্ড *', 'Password *')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required={!editingUser}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={editingUser ? t('পরিবর্তন না করলে খালি রাখুন', 'Leave blank to keep') : 'যেমন: subadmin@2026'}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('অ্যাকাউন্টের ভূমিকা (Role)', 'Account Role')}
                  </label>
                  <select
                    value={formData.role}
                    disabled={editingUser?.role === 'super_admin'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="sub_admin">{t('সাব-এডমিন (Sub-Admin)', 'Sub-Admin')}</option>
                    <option value="super_admin">{t('প্রধান অ্যাডমিন (Super Admin)', 'Super Admin')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('মোবাইল নম্বর', 'Mobile')}</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="013XXXXXXXX"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('ইমেইল', 'Email')}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="officer@holynexgroup.com"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Permissions checkboxes */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <p className="text-xs font-bold text-slate-800">
                  {t('কার্যক্রম অনুমতি নির্ধারণ করুন:', 'Assign Action Permissions:')}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.canManageApplications}
                      onChange={(e) => setFormData({ ...formData, canManageApplications: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span>{t('ডিলার আবেদন অনুমোদন ও স্ট্যাটাস', 'Dealer Applications')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.canManageProducts}
                      onChange={(e) => setFormData({ ...formData, canManageProducts: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span>{t('পণ্য যোগ ও কিস্তি রেট পরিবর্তন', 'Manage Products')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.canManageNews}
                      onChange={(e) => setFormData({ ...formData, canManageNews: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span>{t('সংবাদ ও নোটিশ প্রকাশ', 'Publish News')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.canManageSlides}
                      onChange={(e) => setFormData({ ...formData, canManageSlides: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span>{t('ব্যানার স্লাইডার পরিবর্তন', 'Manage Slides')}</span>
                  </label>
                </div>
              </div>

              {/* Status toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-slate-800">{t('অ্যাকাউন্টের অবস্থা', 'Account Status')}</p>
                  <p className="text-[11px] text-slate-500">
                    {t('নিষ্ক্রিয় করলে এই অ্যাকাউন্টে লগইন বন্ধ থাকবে', 'Inactive disables portal login')}
                  </p>
                </div>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300"
                >
                  <option value="active">{t('সক্রিয় (Active)', 'Active')}</option>
                  <option value="inactive">{t('নিষ্ক্রিয় (Inactive)', 'Inactive')}</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  {t('বাতিল', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingUser ? t('আপডেট সংরক্ষণ করুন', 'Save Changes') : t('সাব-এডমিন তৈরি করুন', 'Create Sub-Admin')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
