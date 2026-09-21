import React, { useState } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import { NetworkPerson, PersonRole, FairPriceCardRecord, ProductScheduleItem } from '../../types';
import {
  Users,
  UserCheck,
  Store,
  Briefcase,
  UserPlus,
  Search,
  Filter,
  Shield,
  Phone,
  MapPin,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Sparkles,
  CreditCard,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export const AdminPeopleTab: React.FC = () => {
  const { t } = useLanguage();
  const [people, setPeople] = useState<NetworkPerson[]>(() => Storage.getNetworkPeople());
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<NetworkPerson | null>(null);
  const [inspectingPerson, setInspectingPerson] = useState<NetworkPerson | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    role: 'representative' as PersonRole,
    name: '',
    mobile: '',
    email: '',
    address: '',
    area: '',
    parentDealerId: '',
    parentSubDealerId: '',
    parentWorkerId: '',
    parentRepresentativeId: '',
    status: 'active' as 'active' | 'suspended' | 'pending',
    nid: '',
    tradeLicense: '',
    commissionBalance: 0,
    totalCommissionEarned: 0,
  });

  const reloadData = () => {
    setPeople(Storage.getNetworkPeople());
  };

  const handleOpenCreate = (role: PersonRole = 'representative') => {
    setEditingPerson(null);
    const prefixMap: Record<PersonRole, string> = {
      dealer: 'DLR',
      sub_dealer: 'SUB',
      worker: 'WRK',
      representative: 'REP',
      customer: 'CUS',
    };
    const randomId = `${prefixMap[role]}-${Math.floor(100000 + Math.random() * 900000)}`;

    setFormData({
      id: randomId,
      role,
      name: '',
      mobile: '',
      email: '',
      address: '',
      area: '',
      parentDealerId: 'DLR-000101',
      parentSubDealerId: '',
      parentWorkerId: '',
      parentRepresentativeId: role === 'customer' ? 'REP-000401' : '',
      status: 'active',
      nid: '',
      tradeLicense: '',
      commissionBalance: 0,
      totalCommissionEarned: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (person: NetworkPerson) => {
    setEditingPerson(person);
    setFormData({
      id: person.id,
      role: person.role,
      name: person.name,
      mobile: person.mobile,
      email: person.email || '',
      address: person.address,
      area: person.area,
      parentDealerId: person.parentDealerId || '',
      parentSubDealerId: person.parentSubDealerId || '',
      parentWorkerId: person.parentWorkerId || '',
      parentRepresentativeId: person.parentRepresentativeId || '',
      status: person.status,
      nid: person.nid || '',
      tradeLicense: person.tradeLicense || '',
      commissionBalance: person.commissionBalance,
      totalCommissionEarned: person.totalCommissionEarned,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      alert(t('নাম ও মোবাইল নম্বর আবশ্যক।', 'Name and mobile are required.'));
      return;
    }

    const personToSave: NetworkPerson = {
      id: formData.id,
      role: formData.role,
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      address: formData.address,
      area: formData.area,
      parentDealerId: formData.parentDealerId || undefined,
      parentSubDealerId: formData.parentSubDealerId || undefined,
      parentWorkerId: formData.parentWorkerId || undefined,
      parentRepresentativeId: formData.parentRepresentativeId || undefined,
      status: formData.status,
      nid: formData.nid,
      tradeLicense: formData.tradeLicense,
      joinedDate: editingPerson ? editingPerson.joinedDate : new Date().toISOString().split('T')[0],
      commissionBalance: Number(formData.commissionBalance) || 0,
      totalCommissionEarned: Number(formData.totalCommissionEarned) || 0,
    };

    Storage.saveNetworkPerson(personToSave);
    reloadData();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('আপনি কি নিশ্চিত যে এই ব্যক্তিকে ডিলিট করতে চান?', 'Are you sure to delete this person?'))) {
      Storage.deleteNetworkPerson(id);
      reloadData();
      if (inspectingPerson?.id === id) setInspectingPerson(null);
    }
  };

  const handleToggleStatus = (person: NetworkPerson) => {
    const nextStatus = person.status === 'active' ? 'suspended' : 'active';
    Storage.saveNetworkPerson({ ...person, status: nextStatus });
    reloadData();
  };

  // Filtered list
  const filteredPeople = people.filter((p) => {
    const matchesRole = selectedRole === 'all' || p.role === selectedRole;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mobile.includes(searchQuery) ||
      p.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleBadge = (role: PersonRole) => {
    switch (role) {
      case 'dealer':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full">ডিলার (Dealer)</span>;
      case 'sub_dealer':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full">সাব-ডিলার (Sub-Dealer)</span>;
      case 'worker':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full">কর্মী (Field Worker)</span>;
      case 'representative':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full">প্রতিনিধি (Representative)</span>;
      case 'customer':
        return <span className="bg-slate-700/60 text-slate-300 border border-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full">গ্রাহক (Customer)</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>নেটওয়ার্ক হায়ারার্কি ও পিপল ডিরেক্টরি</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {t('ডিলার, কর্মী, প্রতিনিধি ও গ্রাহক ব্যবস্থাপনা', 'Network Hierarchy & People Management')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Admin → Dealer → Sub-Dealer → Worker → Representative → Customer
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleOpenCreate('dealer')}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ ডিলার যুক্ত</span>
          </button>
          <button
            onClick={() => handleOpenCreate('representative')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ প্রতিনিধি যুক্ত</span>
          </button>
          <button
            onClick={() => handleOpenCreate('customer')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>+ গ্রাহক এন্ট্রি</span>
          </button>
        </div>
      </div>

      {/* Role Tabs & Instant Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Role Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {[
            { id: 'all', label: 'সবাই (All)', count: people.length },
            { id: 'dealer', label: 'ডিলার (Dealers)', count: people.filter((p) => p.role === 'dealer').length },
            { id: 'sub_dealer', label: 'সাব-ডিলার', count: people.filter((p) => p.role === 'sub_dealer').length },
            { id: 'worker', label: 'কর্মী (Workers)', count: people.filter((p) => p.role === 'worker').length },
            { id: 'representative', label: 'প্রতিনিধি (Reps)', count: people.filter((p) => p.role === 'representative').length },
            { id: 'customer', label: 'গ্রাহক (Customers)', count: people.filter((p) => p.role === 'customer').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedRole(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedRole === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedRole === tab.id ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('নাম, আইডি, মোবাইল বা এলাকা দিয়ে খুঁজুন...', 'Search by ID, name, mobile, area...')}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
          />
        </div>
      </div>

      {/* People Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">{t('আইডি ও নাম', 'ID & Person')}</th>
                <th className="px-4 py-3.5">{t('পদবী ও রোল', 'Role')}</th>
                <th className="px-4 py-3.5">{t('যোগাযোগ ও এলাকা', 'Mobile & Area')}</th>
                <th className="px-4 py-3.5">{t('সুপারভাইজার / প্যারেন্ট', 'Hierarchy Parent')}</th>
                <th className="px-4 py-3.5">{t('কমিশন ব্যালেন্স', 'Commission')}</th>
                <th className="px-4 py-3.5">{t('স্ট্যাটাস', 'Status')}</th>
                <th className="px-5 py-3.5 text-right">{t('অ্যাকশন', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPeople.map((person) => (
                <tr key={person.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 shrink-0 overflow-hidden">
                        {person.photoUrl ? (
                          <img src={person.photoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          person.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-white text-xs block hover:text-amber-300 cursor-pointer" onClick={() => setInspectingPerson(person)}>
                          {person.name}
                        </span>
                        <span className="font-mono text-[10px] text-amber-400/90">{person.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    {getRoleBadge(person.role)}
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-mono text-slate-200">{person.mobile}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[160px]">{person.area}</div>
                  </td>

                  <td className="px-4 py-3.5 text-[11px] text-slate-400 font-mono">
                    {person.parentRepresentativeId && <div>REP: {person.parentRepresentativeId}</div>}
                    {person.parentWorkerId && <div>WRK: {person.parentWorkerId}</div>}
                    {person.parentSubDealerId && <div>SUB: {person.parentSubDealerId}</div>}
                    {person.parentDealerId && <div>DLR: {person.parentDealerId}</div>}
                    {!person.parentRepresentativeId && !person.parentWorkerId && !person.parentSubDealerId && !person.parentDealerId && (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    {person.role !== 'customer' ? (
                      <div>
                        <span className="font-mono font-bold text-emerald-400">৳ {person.commissionBalance.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-500 block">মোট: ৳ {person.totalCommissionEarned.toLocaleString()}</span>
                      </div>
                    ) : (
                      <span className="text-slate-600 text-[11px]">N/A (Customer)</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => handleToggleStatus(person)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                        person.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                      }`}
                    >
                      {person.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{person.status === 'active' ? 'সক্রিয়' : 'স্থগিত'}</span>
                    </button>
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        title={t('বিস্তারিত প্রোফাইল দেখুন', 'Inspect Profile')}
                        onClick={() => setInspectingPerson(person)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title={t('সম্পাদনা করুন', 'Edit')}
                        onClick={() => handleOpenEdit(person)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title={t('ডিলিট করুন', 'Delete')}
                        onClick={() => handleDelete(person.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 hover:text-rose-300 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPeople.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500 text-xs">
                    {t('কোনো তথ্য পাওয়া যায়নি।', 'No personnel found matching the query.')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------------------------------------------------
          INSPECT CUSTOMER / PERSON DRAWER / MODAL
      ----------------------------------------------------- */}
      {inspectingPerson && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-white p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setInspectingPerson(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 pb-6 border-b border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl font-bold">
                {inspectingPerson.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{inspectingPerson.name}</h3>
                  {getRoleBadge(inspectingPerson.role)}
                </div>
                <p className="text-xs font-mono text-amber-400 mt-0.5">ID: {inspectingPerson.id}</p>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{inspectingPerson.address} • {inspectingPerson.area}</span>
                </p>
              </div>
            </div>

            {/* If Customer: Show their Fair Price Card & Product Entitlement */}
            {inspectingPerson.role === 'customer' && (
              <div className="py-6 space-y-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <CreditCard className="w-4 h-4" />
                  <span>ফেয়ার প্রাইস কার্ড ও খাদ্য বরাদ্দ (Customer Profile)</span>
                </div>

                {(() => {
                  const card = Storage.getFairPriceCards().find((c) => c.customerId === inspectingPerson.id);
                  const schedules = Storage.getProductSchedules().filter((s) => s.customerId === inspectingPerson.id);
                  return (
                    <div className="space-y-4">
                      {card ? (
                        <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 flex justify-between items-center text-xs">
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase block font-mono">FAIR PRICE CARD</span>
                            <span className="font-mono text-base font-black text-amber-300">{card.cardNumber}</span>
                            <span className="text-slate-400 block text-[11px]">ইস্যু: {card.issueDate} • কোটা: {card.monthlyQuotaKg} কেজি</span>
                          </div>
                          <div className="text-right">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                              {card.status.toUpperCase()}
                            </span>
                            <span className="text-slate-400 block text-[10px] mt-1">ফি পরিশোধ: ৳ {card.paidFee}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 p-3 bg-slate-950 rounded-xl">
                          কোনো কার্ড ইস্যু করা হয়নি।
                        </div>
                      )}

                      {/* Schedules */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>খাদ্য সামগ্রী শিডিউল (Product Entitlement)</span>
                        </h4>
                        <div className="space-y-2">
                          {schedules.map((s) => (
                            <div key={s.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                              <div>
                                <span className="font-bold text-white block">{s.productNameBn}</span>
                                <span className="text-[11px] text-slate-400">পরিমাণ: {s.quantity} • পয়েন্ট: {s.deliveryPoint}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-emerald-400">৳ {s.allocatedPrice}</span>
                                <span className="text-[10px] text-amber-400 block font-mono">{s.scheduledDate}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Financial Overview if Dealer/Worker/Rep */}
            {inspectingPerson.role !== 'customer' && (
              <div className="py-6 grid grid-cols-2 gap-4 border-b border-slate-800">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">বর্তমান কমিশন ব্যালেন্স</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    ৳ {inspectingPerson.commissionBalance.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">সর্বমোট অর্জিত কমিশন</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    ৳ {inspectingPerson.totalCommissionEarned.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className="pt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setInspectingPerson(null);
                  handleOpenEdit(inspectingPerson);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all"
              >
                তথ্য আপডেট করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          CREATE / EDIT MODAL
      ----------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto text-white p-6 sm:p-8 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingPerson ? t('ব্যক্তির তথ্য সম্পাদনা', 'Edit Personnel') : t('নতুন ব্যক্তি / মেম্বার যুক্ত করুন', 'Add Network Member')}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">আইডি (System ID)</label>
                  <input
                    type="text"
                    value={formData.id}
                    disabled={!!editingPerson}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">পদবী / রোল (Role)</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as PersonRole })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="dealer">ডিলার (Dealer)</option>
                    <option value="sub_dealer">সাব-ডিলার (Sub-Dealer)</option>
                    <option value="worker">ফিল্ড কর্মী (Worker)</option>
                    <option value="representative">প্রতিনিধি (Representative)</option>
                    <option value="customer">গ্রাহক (Customer)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">পূর্ণ নাম (Full Name)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="যেমন: মোঃ কামাল হোসেন"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="017xxxxxxxx"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">জাতীয় পরিচয়পত্র (NID)</label>
                  <input
                    type="text"
                    value={formData.nid}
                    onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
                    placeholder="19xxxxxxxxxxxx"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">এলাকা / কর্মক্ষেত্র (Area/Territory)</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="যেমন: সাভার পৌর এলাকা, ঢাকা"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">বিস্তারিত ঠিকানা</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="দোকান বা বাড়ির পূর্ণ ঠিকানা..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              {/* Hierarchy Assigning */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  হায়ারার্কি লিঙ্কিং (Parent Assignment)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400">দায়িত্বপ্রাপ্ত ডিলার (Parent Dealer ID)</label>
                    <input
                      type="text"
                      value={formData.parentDealerId}
                      onChange={(e) => setFormData({ ...formData, parentDealerId: e.target.value })}
                      placeholder="DLR-000101"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                    />
                  </div>
                  {formData.role === 'customer' && (
                    <div>
                      <label className="block text-[10px] text-slate-400">নিবন্ধনকারী প্রতিনিধি (Rep ID)</label>
                      <input
                        type="text"
                        value={formData.parentRepresentativeId}
                        onChange={(e) => setFormData({ ...formData, parentRepresentativeId: e.target.value })}
                        placeholder="REP-000401"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
