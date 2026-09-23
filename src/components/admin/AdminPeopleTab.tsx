import React, { useState, useMemo } from 'react';
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
  ArrowRightLeft,
  GitBranch,
  Building2,
  AlertTriangle,
  Check,
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

  // Transfer Modal State
  const [transferPerson, setTransferPerson] = useState<NetworkPerson | null>(null);
  const [transferWorkerParentType, setTransferWorkerParentType] = useState<'dealer' | 'sub_dealer'>('dealer');
  const [transferTargetDealerId, setTransferTargetDealerId] = useState<string>('');
  const [transferTargetSubDealerId, setTransferTargetSubDealerId] = useState<string>('');
  const [transferTargetWorkerId, setTransferTargetWorkerId] = useState<string>('');
  const [transferError, setTransferError] = useState<string>('');

  // Worker Parent Type for Creation Form
  const [workerParentType, setWorkerParentType] = useState<'dealer' | 'sub_dealer'>('dealer');
  const [formError, setFormError] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    role: 'sub_dealer' as PersonRole,
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

  // Helper getters for hierarchy
  const allDealers = useMemo(() => people.filter((p) => p.role === 'dealer'), [people]);
  const allSubDealers = useMemo(() => people.filter((p) => p.role === 'sub_dealer'), [people]);
  const allWorkers = useMemo(() => people.filter((p) => p.role === 'worker'), [people]);

  // Filtered Sub-Dealers for current form Dealer selection
  const availableSubDealersForDealer = useMemo(() => {
    if (!formData.parentDealerId) return [];
    return allSubDealers.filter((s) => s.parentDealerId === formData.parentDealerId);
  }, [allSubDealers, formData.parentDealerId]);

  // Filtered Sub-Dealers for Transfer modal
  const transferAvailableSubDealers = useMemo(() => {
    if (!transferTargetDealerId) return [];
    return allSubDealers.filter((s) => s.parentDealerId === transferTargetDealerId);
  }, [allSubDealers, transferTargetDealerId]);

  const handleOpenCreate = (role: PersonRole = 'sub_dealer') => {
    setEditingPerson(null);
    setFormError('');
    const prefixMap: Record<PersonRole, string> = {
      dealer: 'DLR',
      sub_dealer: 'SUB',
      worker: 'WRK',
      representative: 'REP',
      customer: 'CUS',
    };
    const randomId = `${prefixMap[role] || 'USR'}-${Math.floor(100000 + Math.random() * 900000)}`;

    const defaultDealer = allDealers[0]?.id || 'DLR-000101';
    const defaultSub = allSubDealers.find((s) => s.parentDealerId === defaultDealer)?.id || '';
    const defaultWorker = allWorkers[0]?.id || '';

    setWorkerParentType('dealer');
    setFormData({
      id: randomId,
      role,
      name: '',
      mobile: '',
      email: '',
      address: '',
      area: '',
      parentDealerId: defaultDealer,
      parentSubDealerId: '',
      parentWorkerId: role === 'customer' ? defaultWorker : '',
      parentRepresentativeId: '',
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
    setFormError('');
    if (person.role === 'worker') {
      setWorkerParentType(person.parentSubDealerId ? 'sub_dealer' : 'dealer');
    }
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

  const handleRoleChange = (newRole: PersonRole) => {
    const defaultDealer = allDealers[0]?.id || '';
    const defaultWorker = allWorkers[0]?.id || '';

    let updatedParentWorkerId = '';
    let updatedParentSubDealerId = '';
    let updatedParentDealerId = defaultDealer;

    if (newRole === 'customer') {
      updatedParentWorkerId = defaultWorker;
      const worker = allWorkers.find((w) => w.id === defaultWorker);
      if (worker) {
        updatedParentSubDealerId = worker.parentSubDealerId || '';
        updatedParentDealerId = worker.parentDealerId || defaultDealer;
      }
    } else if (newRole === 'worker') {
      if (workerParentType === 'sub_dealer') {
        const subs = allSubDealers.filter((s) => s.parentDealerId === defaultDealer);
        updatedParentSubDealerId = subs[0]?.id || '';
      }
    }

    setFormData({
      ...formData,
      role: newRole,
      parentDealerId: updatedParentDealerId,
      parentSubDealerId: updatedParentSubDealerId,
      parentWorkerId: updatedParentWorkerId,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.mobile.trim()) {
      setFormError(t('নাম ও মোবাইল নম্বর আবশ্যক।', 'Name and mobile are required.'));
      return;
    }

    // Resolve hierarchy according to mandatory corporate rules
    let finalDealerId: string | undefined = formData.parentDealerId || undefined;
    let finalSubDealerId: string | undefined = formData.parentSubDealerId || undefined;
    let finalWorkerId: string | undefined = formData.parentWorkerId || undefined;

    if (formData.role === 'sub_dealer') {
      if (!finalDealerId) {
        setFormError('সাব-ডিলার তৈরির জন্য অবশ্যই একটি মূল ডিলার (Main Dealer) নির্বাচন করতে হবে।');
        return;
      }
      finalSubDealerId = undefined;
      finalWorkerId = undefined;
    } else if (formData.role === 'worker') {
      if (workerParentType === 'dealer') {
        if (!finalDealerId) {
          setFormError('কর্মীর জন্য মূল ডিলার নির্বাচন করুন।');
          return;
        }
        finalSubDealerId = undefined;
      } else {
        if (!finalDealerId) {
          setFormError('কর্মীর জন্য মূল ডিলার নির্বাচন করুন।');
          return;
        }
        if (!finalSubDealerId) {
          setFormError('সাব-ডিলার নির্বাচন করুন যার অধীনে কর্মী থাকবে।');
          return;
        }
      }
      finalWorkerId = undefined;
    } else if (formData.role === 'customer') {
      if (!finalWorkerId) {
        setFormError('গ্রাহক নিবন্ধনের জন্য অবশ্যই একজন কর্মী (Worker) নির্বাচন করতে হবে।');
        return;
      }
      const selectedWorker = allWorkers.find((w) => w.id === finalWorkerId);
      if (!selectedWorker) {
        setFormError('নির্বাচিত কর্মী পাওয়া যায়নি।');
        return;
      }
      finalSubDealerId = selectedWorker.parentSubDealerId;
      finalDealerId = selectedWorker.parentDealerId;
    }

    // Validate using server/storage rules
    const validation = Storage.validateHierarchy({
      role: formData.role,
      parentDealerId: finalDealerId,
      parentSubDealerId: finalSubDealerId,
      parentWorkerId: finalWorkerId,
    });

    if (!validation.valid) {
      setFormError(validation.error || 'হায়ারার্কি কাঠামো সঠিক নয়।');
      return;
    }

    const personToSave: NetworkPerson = {
      id: formData.id,
      role: formData.role,
      name: formData.name.trim(),
      mobile: formData.mobile.trim(),
      email: formData.email?.trim() || undefined,
      address: formData.address.trim(),
      area: formData.area.trim(),
      parentDealerId: finalDealerId || undefined,
      parentSubDealerId: finalSubDealerId || undefined,
      parentWorkerId: finalWorkerId || undefined,
      parentRepresentativeId: formData.parentRepresentativeId || undefined,
      status: formData.status,
      nid: formData.nid?.trim() || '',
      tradeLicense: formData.tradeLicense?.trim() || '',
      joinedDate: editingPerson ? editingPerson.joinedDate : new Date().toISOString().split('T')[0],
      commissionBalance: Number(formData.commissionBalance) || 0,
      totalCommissionEarned: Number(formData.totalCommissionEarned) || 0,
    };

    Storage.saveNetworkPerson(personToSave);

    // If new customer, auto-issue fair price card
    if (!editingPerson && formData.role === 'customer') {
      const assignedWorkerName = allWorkers.find((w) => w.id === finalWorkerId)?.name || 'দায়িত্বপ্রাপ্ত কর্মী';
      Storage.saveFairPriceCard({
        id: `card-${Date.now()}`,
        cardNumber: `FPC-${Math.floor(10000000 + Math.random() * 90000000)}`,
        customerId: personToSave.id,
        customerName: personToSave.name,
        customerMobile: personToSave.mobile,
        customerNid: personToSave.nid || '',
        customerAddress: personToSave.address,
        customerArea: personToSave.area,
        status: 'active',
        assignedRepresentative: assignedWorkerName,
        parentDealerId: finalDealerId,
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: '2028-12-31',
        monthlyGroceryLimit: 5000,
        groceryPurchasedThisMonth: 0,
        applianceCreditLimit: 40000,
        applianceCreditUsed: 0,
        totalSavings: 0,
      });
    }

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
    const updated: NetworkPerson = {
      ...person,
      status: person.status === 'active' ? 'suspended' : 'active',
    };
    Storage.saveNetworkPerson(updated);
    reloadData();
    if (inspectingPerson?.id === person.id) setInspectingPerson(updated);
  };

  // Open Transfer Modal
  const handleOpenTransfer = (person: NetworkPerson) => {
    setTransferPerson(person);
    setTransferError('');
    if (person.role === 'worker') {
      setTransferWorkerParentType(person.parentSubDealerId ? 'sub_dealer' : 'dealer');
      setTransferTargetDealerId(person.parentDealerId || allDealers[0]?.id || '');
      setTransferTargetSubDealerId(person.parentSubDealerId || '');
    } else if (person.role === 'customer') {
      setTransferTargetWorkerId(person.parentWorkerId || allWorkers[0]?.id || '');
    }
  };

  // Execute Transfer
  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferPerson) return;
    setTransferError('');

    if (transferPerson.role === 'worker') {
      if (transferWorkerParentType === 'dealer') {
        if (!transferTargetDealerId) {
          setTransferError('টার্গেট মূল ডিলার নির্বাচন করুন।');
          return;
        }
        Storage.transferWorker(transferPerson.id, 'dealer', transferTargetDealerId);
      } else {
        if (!transferTargetSubDealerId) {
          setTransferError('টার্গেট সাব-ডিলার নির্বাচন করুন।');
          return;
        }
        Storage.transferWorker(transferPerson.id, 'sub_dealer', transferTargetSubDealerId);
      }
    } else if (transferPerson.role === 'customer') {
      if (!transferTargetWorkerId) {
        setTransferError('নতুন দায়িত্বপ্রাপ্ত কর্মী নির্বাচন করুন।');
        return;
      }
      Storage.transferCustomer(transferPerson.id, transferTargetWorkerId);
    }

    reloadData();
    setTransferPerson(null);
    if (inspectingPerson && inspectingPerson.id === transferPerson.id) {
      setInspectingPerson(Storage.getNetworkPeople().find((p) => p.id === transferPerson.id) || null);
    }
  };

  const filteredPeople = people.filter((p) => {
    if (selectedRole !== 'all' && p.role !== selectedRole) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.mobile.includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getRoleBadge = (role: PersonRole) => {
    switch (role) {
      case 'dealer':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Store className="w-3 h-3 text-amber-400" />
            <span>মূল ডিলার (Dealer)</span>
          </span>
        );
      case 'sub_dealer':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
            <Building2 className="w-3 h-3 text-blue-400" />
            <span>সাব-ডিলার (Sub-Dealer)</span>
          </span>
        );
      case 'worker':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
            <Briefcase className="w-3 h-3 text-purple-400" />
            <span>ফিল্ড কর্মী (Worker)</span>
          </span>
        );
      case 'representative':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <UserCheck className="w-3 h-3 text-cyan-400" />
            <span>প্রতিনিধি (Rep)</span>
          </span>
        );
      case 'customer':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <Users className="w-3 h-3 text-emerald-400" />
            <span>গ্রাহক (Customer)</span>
          </span>
        );
    }
  };

  // Helper to render hierarchical breadcrumb
  const renderHierarchyBreadcrumb = (person: NetworkPerson) => {
    const parentDealer = allDealers.find((d) => d.id === person.parentDealerId);
    const parentSub = allSubDealers.find((s) => s.id === person.parentSubDealerId);
    const parentWorker = allWorkers.find((w) => w.id === person.parentWorkerId);

    if (person.role === 'dealer') {
      return (
        <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
          <span>হোলিনেক্স সেন্ট্রাল</span>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <span className="font-bold text-white">মূল ডিলার</span>
        </div>
      );
    }

    if (person.role === 'sub_dealer') {
      return (
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <span className="text-amber-400 font-semibold">{parentDealer?.name || person.parentDealerId || 'মূল ডিলার'}</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-blue-300 font-bold">{person.name} (সাব-ডিলার)</span>
        </div>
      );
    }

    if (person.role === 'worker') {
      return (
        <div className="flex items-center gap-1 text-[11px] text-slate-400 flex-wrap">
          <span className="text-amber-400">{parentDealer?.name || person.parentDealerId}</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          {parentSub ? (
            <>
              <span className="text-blue-400">{parentSub.name}</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
            </>
          ) : (
            <span className="text-slate-500 italic text-[10px]">(সরাসরি ডিলার)</span>
          )}
          <span className="text-purple-300 font-bold">{person.name} (কর্মী)</span>
        </div>
      );
    }

    if (person.role === 'customer') {
      return (
        <div className="flex items-center gap-1 text-[11px] text-slate-400 flex-wrap">
          <span className="text-amber-400">{parentDealer?.name || person.parentDealerId}</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          {parentSub && (
            <>
              <span className="text-blue-400">{parentSub.name}</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
            </>
          )}
          <span className="text-purple-400">{parentWorker?.name || person.parentWorkerId}</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-emerald-300 font-bold">{person.name} (গ্রাহক)</span>
        </div>
      );
    }

    return <span className="text-slate-500">—</span>;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <GitBranch className="w-4 h-4" />
            <span>হায়ারার্কি-ভিত্তিক নিবন্ধন ও ওনারশিপ সিস্টেম</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {t('নেটওয়ার্ক কাঠামো ও জনবল প্রশাসন', 'Hierarchical Personnel Management')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t(
              'মূল ডিলার ➔ সাব-ডিলার ➔ ফিল্ড কর্মী ➔ গ্রাহক। জিরো-অরফান পলিসি ও স্পষ্ট প্যারেন্ট-চাইল্ড রিলেশনশিপ।',
              'Main Dealer -> Sub-Dealer -> Worker -> Customer. Strict parent validation and audit trails.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleOpenCreate('sub_dealer')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>+ সাব-ডিলার যুক্ত করুন</span>
          </button>
          <button
            onClick={() => handleOpenCreate('worker')}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>+ কর্মী যুক্ত করুন</span>
          </button>
          <button
            onClick={() => handleOpenCreate('customer')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <Users className="w-3.5 h-3.5" />
            <span>+ গ্রাহক যুক্ত করুন</span>
          </button>
        </div>
      </div>

      {/* Role Counts Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'মোট নেটওয়ার্ক', role: 'all', count: people.length, color: 'text-amber-400' },
          { label: 'মূল ডিলার (Dealers)', role: 'dealer', count: allDealers.length, color: 'text-amber-400' },
          { label: 'সাব-ডিলার (Sub-Dealers)', role: 'sub_dealer', count: allSubDealers.length, color: 'text-blue-400' },
          { label: 'কর্মী (Workers)', role: 'worker', count: allWorkers.length, color: 'text-purple-400' },
          { label: 'গ্রাহক (Customers)', role: 'customer', count: people.filter((p) => p.role === 'customer').length, color: 'text-emerald-400' },
        ].map((item) => (
          <div
            key={item.role}
            onClick={() => setSelectedRole(item.role)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              selectedRole === item.role
                ? 'bg-slate-800 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-[11px] font-bold text-slate-400 block">{item.label}</span>
            <span className={`text-2xl font-black font-mono mt-1 block ${item.color}`}>
              {item.count}
            </span>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedRole('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedRole === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            সকল ({people.length})
          </button>
          <button
            onClick={() => setSelectedRole('dealer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedRole === 'dealer'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            ডিলার ({allDealers.length})
          </button>
          <button
            onClick={() => setSelectedRole('sub_dealer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedRole === 'sub_dealer'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            সাব-ডিলার ({allSubDealers.length})
          </button>
          <button
            onClick={() => setSelectedRole('worker')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedRole === 'worker'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            কর্মী ({allWorkers.length})
          </button>
          <button
            onClick={() => setSelectedRole('customer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedRole === 'customer'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            গ্রাহক ({people.filter((p) => p.role === 'customer').length})
          </button>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম, মোবাইল বা এলাকা খুঁজুন..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Main Personnel Table with Hierarchy Path */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">সদস্যের বিবরণ</th>
                <th className="py-3 px-4">পদবী / ভূমিকা</th>
                <th className="py-3 px-4">যোগাযোগ ও এলাকা</th>
                <th className="py-3 px-4">হায়ারার্কি ও প্যারেন্ট রিলেশন</th>
                <th className="py-3 px-4">কমিশন স্থিতি</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredPeople.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    কোনো তথ্য পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredPeople.map((person) => (
                  <tr key={person.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-amber-400 shrink-0">
                          {person.name.charAt(0)}
                        </div>
                        <div>
                          <span
                            onClick={() => setInspectingPerson(person)}
                            className="font-bold text-white block hover:text-amber-400 cursor-pointer"
                          >
                            {person.name}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">{person.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">{getRoleBadge(person.role)}</td>

                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-200">{person.mobile}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[160px]">{person.area}</div>
                    </td>

                    <td className="py-3 px-4">
                      {renderHierarchyBreadcrumb(person)}
                    </td>

                    <td className="py-3 px-4">
                      {person.role !== 'customer' ? (
                        <div>
                          <span className="font-mono font-bold text-emerald-400">
                            ৳ {person.commissionBalance?.toLocaleString() || 0}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            মোট: ৳ {person.totalCommissionEarned?.toLocaleString() || 0}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-[11px]">N/A (Consumer)</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
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

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Transfer Button for Worker and Customer */}
                        {(person.role === 'worker' || person.role === 'customer') && (
                          <button
                            title="হায়ারার্কি স্থানান্তর (Transfer/Reassign)"
                            onClick={() => handleOpenTransfer(person)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 transition-all"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          title="বিস্তারিত দেখুন"
                          onClick={() => setInspectingPerson(person)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="সম্পাদনা করুন"
                          onClick={() => handleOpenEdit(person)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="মুছে ফেলুন"
                          onClick={() => handleDelete(person.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 hover:text-rose-300 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------------------------------------------------
          HIERARCHY-BASED CREATE / EDIT MODAL
      ----------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto text-white p-6 sm:p-8 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-amber-400" />
                  <span>
                    {editingPerson ? t('সদস্যের তথ্য সম্পাদনা', 'Edit Personnel') : t('হায়ারার্কি-ভিত্তিক নতুন নিবন্ধন', 'Hierarchy-Based Registration')}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  স্পষ্ট প্যারেন্ট-চাইল্ড চেইন বাধ্যতামূলক (Zero-Orphan Policy)।
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

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
                    disabled={!!editingPerson}
                    onChange={(e) => handleRoleChange(e.target.value as PersonRole)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="sub_dealer">সাব-ডিলার (Sub-Dealer)</option>
                    <option value="worker">ফিল্ড কর্মী (Worker)</option>
                    <option value="customer">গ্রাহক (Customer)</option>
                    <option value="dealer">মূল ডিলার (Main Dealer)</option>
                  </select>
                </div>
              </div>

              {/* -------------------------------------------------------------
                  CASCADING HIERARCHY SELECTION & PREVIEW (MANDATORY REQUIREMENT)
              -------------------------------------------------------------- */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    <span>হায়ারার্কি লিঙ্কিং ও প্যারেন্ট রিলেশনশিপ</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    Zero-Orphan Verified
                  </span>
                </div>

                {/* 1. SUB-DEALER REGISTRATION LOGIC */}
                {formData.role === 'sub_dealer' && (
                  <div>
                    <label className="block text-[11px] text-slate-300 font-bold mb-1">
                      মূল ডিলার নির্বাচন করুন (Main Dealer) *
                    </label>
                    <select
                      value={formData.parentDealerId}
                      onChange={(e) => setFormData({ ...formData, parentDealerId: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
                      required
                    >
                      <option value="">-- মূল ডিলার নির্বাচন করুন --</option>
                      {allDealers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.area}) - {d.id}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1">
                      সাব-ডিলার তৈরির জন্য অবশ্যই একটি মূল ডিলার নির্বাচন করতে হবে।
                    </p>
                  </div>
                )}

                {/* 2. WORKER REGISTRATION LOGIC */}
                {formData.role === 'worker' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-slate-300 font-bold mb-1.5">
                        কর্মী কার অধীনে থাকবে? (Parent Type) *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setWorkerParentType('dealer');
                            setFormData({ ...formData, parentSubDealerId: '' });
                          }}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                            workerParentType === 'dealer'
                              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                              : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                          }`}
                        >
                          1. সরাসরি মূল ডিলার (Main Dealer)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setWorkerParentType('sub_dealer');
                            const firstSub = availableSubDealersForDealer[0]?.id || '';
                            setFormData({ ...formData, parentSubDealerId: firstSub });
                          }}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                            workerParentType === 'sub_dealer'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                          }`}
                        >
                          2. সাব-ডিলার (Sub-Dealer)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 font-bold mb-1">
                        মূল ডিলার নির্বাচন করুন (Main Dealer) *
                      </label>
                      <select
                        value={formData.parentDealerId}
                        onChange={(e) => {
                          const newDealerId = e.target.value;
                          const subs = allSubDealers.filter((s) => s.parentDealerId === newDealerId);
                          setFormData({
                            ...formData,
                            parentDealerId: newDealerId,
                            parentSubDealerId: workerParentType === 'sub_dealer' ? subs[0]?.id || '' : '',
                          });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
                        required
                      >
                        <option value="">-- মূল ডিলার নির্বাচন করুন --</option>
                        {allDealers.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.area}) - {d.id}
                          </option>
                        ))}
                      </select>
                    </div>

                    {workerParentType === 'sub_dealer' && (
                      <div>
                        <label className="block text-[11px] text-slate-300 font-bold mb-1">
                          সাব-ডিলার নির্বাচন করুন (Sub-Dealer) *
                        </label>
                        <select
                          value={formData.parentSubDealerId}
                          onChange={(e) => setFormData({ ...formData, parentSubDealerId: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
                          required
                        >
                          <option value="">-- নির্বাচিত ডিলারের অধীনস্থ সাব-ডিলার --</option>
                          {availableSubDealersForDealer.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.area}) - {s.id}
                            </option>
                          ))}
                        </select>
                        {availableSubDealersForDealer.length === 0 && (
                          <p className="text-[10px] text-amber-400 mt-1">
                            এই ডিলারের অধীনে কোনো সাব-ডিলার নেই। অনুগ্রহ করে প্রথমে সাব-ডিলার তৈরি করুন বা সরাসরি ডিলারের অধীনে কর্মী নিয়োগ দিন।
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. CUSTOMER REGISTRATION LOGIC */}
                {formData.role === 'customer' && (
                  <div>
                    <label className="block text-[11px] text-slate-300 font-bold mb-1">
                      দায়িত্বপ্রাপ্ত কর্মী নির্বাচন করুন (Assigned Worker) *
                    </label>
                    <select
                      value={formData.parentWorkerId}
                      onChange={(e) => {
                        const selectedWorkerId = e.target.value;
                        const worker = allWorkers.find((w) => w.id === selectedWorkerId);
                        if (worker) {
                          setFormData({
                            ...formData,
                            parentWorkerId: selectedWorkerId,
                            parentSubDealerId: worker.parentSubDealerId || '',
                            parentDealerId: worker.parentDealerId || '',
                          });
                        }
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
                      required
                    >
                      <option value="">-- কর্মী নির্বাচন করুন --</option>
                      {allWorkers.map((w) => {
                        const dealer = allDealers.find((d) => d.id === w.parentDealerId);
                        const sub = allSubDealers.find((s) => s.id === w.parentSubDealerId);
                        const lineage = sub ? `${dealer?.name || 'ডিলার'} ➔ ${sub.name}` : `${dealer?.name || 'ডিলার'} (সরাসরি)`;
                        return (
                          <option key={w.id} value={w.id}>
                            {w.name} ({w.area}) [{lineage}]
                          </option>
                        );
                      })}
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1">
                      গ্রাহক নিবন্ধনের জন্য কর্মী নির্বাচন করলে তার সম্পূর্ণ চেইন (ডিলার ও সাব-ডিলার) স্বয়ংক্রিয়ভাবে নির্ধারিত হয়।
                    </p>
                  </div>
                )}

                {/* LIVE HIERARCHY PREVIEW ACCORDING TO USER PROMPT SPECIFICATION */}
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
                    হায়ারার্কি প্রিভিউ (Hierarchy Preview):
                  </span>
                  <div className="space-y-1 font-mono text-[11px]">
                    {formData.role === 'dealer' && (
                      <div className="text-white">
                        <div className="text-slate-400">হোলিনেক্স সেন্ট্রাল (Corporate HQ)</div>
                        <div className="text-amber-400 pl-4">↓ মূল ডিলার: {formData.name || '[নতুন ডিলারের নাম]'}</div>
                      </div>
                    )}

                    {formData.role === 'sub_dealer' && (
                      <div className="text-white">
                        <div className="text-amber-400">
                          Main Dealer: {allDealers.find((d) => d.id === formData.parentDealerId)?.name || 'নির্বাচিত হয়নি'}
                        </div>
                        <div className="text-blue-300 pl-4">
                          ↓ Sub-Dealer: {formData.name || '[নতুন সাব-ডিলার]'}
                        </div>
                      </div>
                    )}

                    {formData.role === 'worker' && (
                      <div className="text-white">
                        <div className="text-amber-400">
                          Main Dealer: {allDealers.find((d) => d.id === formData.parentDealerId)?.name || 'নির্বাচিত হয়নি'}
                        </div>
                        {workerParentType === 'sub_dealer' && (
                          <div className="text-blue-400 pl-4">
                            ↓ Sub-Dealer: {allSubDealers.find((s) => s.id === formData.parentSubDealerId)?.name || 'নির্বাচিত হয়নি'}
                          </div>
                        )}
                        <div className={`text-purple-300 ${workerParentType === 'sub_dealer' ? 'pl-8' : 'pl-4'}`}>
                          ↓ Worker: {formData.name || '[নতুন কর্মী]'}
                        </div>
                      </div>
                    )}

                    {formData.role === 'customer' && (
                      <div className="text-white">
                        {(() => {
                          const assignedWorker = allWorkers.find((w) => w.id === formData.parentWorkerId);
                          const dealer = allDealers.find((d) => d.id === (assignedWorker?.parentDealerId || formData.parentDealerId));
                          const sub = allSubDealers.find((s) => s.id === (assignedWorker?.parentSubDealerId || formData.parentSubDealerId));
                          return (
                            <>
                              <div className="text-amber-400">Main Dealer: {dealer?.name || 'অনির্ধারিত'}</div>
                              {sub && <div className="text-blue-400 pl-4">↓ Sub-Dealer: {sub.name}</div>}
                              <div className={`text-purple-400 ${sub ? 'pl-8' : 'pl-4'}`}>
                                ↓ Worker: {assignedWorker?.name || 'অনির্ধারিত'}
                              </div>
                              <div className={`text-emerald-300 font-bold ${sub ? 'pl-12' : 'pl-8'}`}>
                                ↓ Customer: {formData.name || '[নতুন গ্রাহক]'}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Standard Personnel Data Inputs */}
              <div>
                <label className="block text-slate-400 mb-1 font-bold">পূর্ণ নাম (Full Name) *</label>
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
                  <label className="block text-slate-400 mb-1 font-bold">মোবাইল নম্বর *</label>
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
                <label className="block text-slate-400 mb-1 font-bold">এলাকা / কর্মক্ষেত্র (Area/Territory) *</label>
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

      {/* ----------------------------------------------------
          TRANSFER / REASSIGNMENT MODAL (MANDATORY REQUIREMENT)
      ----------------------------------------------------- */}
      {transferPerson && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-amber-400" />
                  <span>হায়ারার্কি স্থানান্তর / রিঅ্যাসাইনমেন্ট</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {transferPerson.name} ({transferPerson.role.toUpperCase()})
                </p>
              </div>
              <button onClick={() => setTransferPerson(null)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {transferError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{transferError}</span>
              </div>
            )}

            <form onSubmit={handleExecuteTransfer} className="space-y-4 text-xs">
              {/* CURRENT HIERARCHY */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  বর্তমান অবস্থান (Current Location):
                </span>
                {renderHierarchyBreadcrumb(transferPerson)}
              </div>

              {/* TRANSFER WORKER */}
              {transferPerson.role === 'worker' && (
                <div className="space-y-3">
                  <label className="block text-slate-300 font-bold">
                    নতুন প্যারেন্ট নির্বাচন করুন:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTransferWorkerParentType('dealer')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        transferWorkerParentType === 'dealer'
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      সরাসরি মূল ডিলারের অধীনে
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTransferWorkerParentType('sub_dealer');
                        const defaultSub = transferAvailableSubDealers[0]?.id || '';
                        setTransferTargetSubDealerId(defaultSub);
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        transferWorkerParentType === 'sub_dealer'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      সাব-ডিলারের অধীনে
                    </button>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">মূল ডিলার *</label>
                    <select
                      value={transferTargetDealerId}
                      onChange={(e) => {
                        setTransferTargetDealerId(e.target.value);
                        setTransferTargetSubDealerId('');
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
                      required
                    >
                      <option value="">-- মূল ডিলার নির্বাচন করুন --</option>
                      {allDealers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.area})
                        </option>
                      ))}
                    </select>
                  </div>

                  {transferWorkerParentType === 'sub_dealer' && (
                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">সাব-ডিলার *</label>
                      <select
                        value={transferTargetSubDealerId}
                        onChange={(e) => setTransferTargetSubDealerId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
                        required
                      >
                        <option value="">-- সাব-ডিলার নির্বাচন করুন --</option>
                        {transferAvailableSubDealers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.area})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-[11px] leading-relaxed">
                    <strong>সতর্কবার্তা:</strong> এই কর্মীকে স্থানান্তর করলে তার অধীনে নিবন্ধিত সমস্ত গ্রাহক স্বয়ংক্রিয়ভাবে নতুন হায়ারার্কিতে স্থানান্তরিত হবে এবং অডিট লগে রেকর্ড সংরক্ষিত থাকবে।
                  </div>
                </div>
              )}

              {/* TRANSFER CUSTOMER */}
              {transferPerson.role === 'customer' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">
                      নতুন দায়িত্বপ্রাপ্ত কর্মী নির্বাচন করুন (New Worker) *
                    </label>
                    <select
                      value={transferTargetWorkerId}
                      onChange={(e) => setTransferTargetWorkerId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
                      required
                    >
                      <option value="">-- কর্মী নির্বাচন করুন --</option>
                      {allWorkers.map((w) => {
                        const dealer = allDealers.find((d) => d.id === w.parentDealerId);
                        const sub = allSubDealers.find((s) => s.id === w.parentSubDealerId);
                        const lineage = sub ? `${dealer?.name || 'ডিলার'} ➔ ${sub.name}` : `${dealer?.name || 'ডিলার'} (সরাসরি)`;
                        return (
                          <option key={w.id} value={w.id}>
                            {w.name} ({w.area}) [{lineage}]
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-300 text-[11px] leading-relaxed">
                    গ্রাহককে নতুন কর্মীর অধীনে স্থানান্তর করলে তার সাব-ডিলার ও ডিলার লিংক নতুন কর্মীর লাইন অনুযায়ী স্বয়ংক্রিয়ভাবে আপডেট হবে।
                  </div>
                </div>
              )}

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setTransferPerson(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                >
                  স্থানান্তর সম্পন্ন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          INSPECT PERSON DRAWER / MODAL
      ----------------------------------------------------- */}
      {inspectingPerson && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-white p-6 sm:p-8 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-950 border border-amber-400/50 flex items-center justify-center font-bold text-lg text-amber-400">
                  {inspectingPerson.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{inspectingPerson.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {getRoleBadge(inspectingPerson.role)}
                    <span className="text-xs text-slate-400 font-mono">{inspectingPerson.id}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setInspectingPerson(null)} className="text-slate-400 hover:text-white">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Complete Hierarchy Lineage */}
            <div className="my-5 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5" />
                <span>সম্পূর্ণ হায়ারার্কি সংযোগ (Lineage Chain):</span>
              </span>
              <div className="text-xs">{renderHierarchyBreadcrumb(inspectingPerson)}</div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">মোবাইল নম্বর</span>
                <span className="font-mono font-bold text-white text-sm">{inspectingPerson.mobile}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">এলাকা</span>
                <span className="font-bold text-white text-sm">{inspectingPerson.area}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">এনআইডি (NID)</span>
                <span className="font-mono text-white">{inspectingPerson.nid || 'তথ্য প্রদান করা হয়নি'}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">যুক্ত হওয়ার তারিখ</span>
                <span className="font-mono text-white">{inspectingPerson.joinedDate}</span>
              </div>
            </div>

            {inspectingPerson.role !== 'customer' && (
              <div className="mt-4 grid grid-cols-2 gap-3">
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
              {(inspectingPerson.role === 'worker' || inspectingPerson.role === 'customer') && (
                <button
                  onClick={() => {
                    const target = inspectingPerson;
                    setInspectingPerson(null);
                    handleOpenTransfer(target);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>হায়ারার্কি স্থানান্তর</span>
                </button>
              )}
              <button
                onClick={() => {
                  const target = inspectingPerson;
                  setInspectingPerson(null);
                  handleOpenEdit(target);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all"
              >
                তথ্য আপডেট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
