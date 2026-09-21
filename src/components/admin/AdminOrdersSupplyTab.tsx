import React, { useState } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import { OrderRecord, DeliveryRecord } from '../../types';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  AlertCircle,
  ShoppingBag,
  Tv,
  Calendar,
  Phone,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

export const AdminOrdersSupplyTab: React.FC = () => {
  const { t } = useLanguage();
  const [subTab, setSubTab] = useState<'orders' | 'deliveries'>('orders');

  const [orders, setOrders] = useState<OrderRecord[]>(() => Storage.getOrders());
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(() => Storage.getDeliveries());
  const [searchQuery, setSearchQuery] = useState('');

  const reloadData = () => {
    setOrders(Storage.getOrders());
    setDeliveries(Storage.getDeliveries());
  };

  const handleUpdateOrderStatus = (id: string, status: OrderRecord['status']) => {
    Storage.updateOrderStatus(id, status);
    reloadData();
  };

  const handleUpdateDeliveryStatus = (id: string, status: DeliveryRecord['status']) => {
    Storage.updateDeliveryStatus(id, status);
    reloadData();
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDeliveries = deliveries.filter(
    (d) =>
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Truck className="w-4 h-4" />
            <span>সাপ্লাই চেইন ও অর্ডার ডেলিভারি ম্যানেজমেন্ট</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {t('অর্ডার প্রসেসিং ও পণ্য ডেলিভারি ট্র্যাকিং', 'Orders & Supply Chain Deliveries')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('নায্যমূল্য খাদ্য সামগ্রী এবং কিস্তির ইলেকট্রনিক্স পণ্যের মাঠপর্যায়ের ডেলিভারি ব্যবস্থাপনা।', 'Field dispatch tracking for Fair Price staples and installment appliances.')}
          </p>
        </div>

        <div className="flex gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setSubTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'orders' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>সকল অর্ডার ({orders.length})</span>
          </button>
          <button
            onClick={() => setSubTab('deliveries')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'deliveries' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>ডেলিভারি টাস্ক ({deliveries.length})</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('অর্ডার আইডি, গ্রাহকের নাম বা পণ্য দিয়ে খুঁজুন...', 'Search orders or deliveries...')}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
        />
      </div>

      {/* Orders Table */}
      {subTab === 'orders' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl backdrop-blur">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">অর্ডার আইডি</th>
                  <th className="px-4 py-3.5">প্রোগ্রাম টাইপ</th>
                  <th className="px-4 py-3.5">গ্রাহকের নাম ও যোগাযোগ</th>
                  <th className="px-4 py-3.5">পণ্য ও পরিমাণ</th>
                  <th className="px-4 py-3.5">মোট মূল্য</th>
                  <th className="px-4 py-3.5">দায়িত্বপ্রাপ্ত প্রতিনিধি</th>
                  <th className="px-4 py-3.5">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-amber-400">{order.id}</span>
                      <span className="text-[10px] text-slate-500 block font-mono">{order.date}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.type === 'fair_price_staple'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {order.type === 'fair_price_staple' ? 'নায্যমূল্য খাদ্য' : 'কিস্তি অ্যাপ্লায়েন্স'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-white block">{order.customerName}</span>
                      <span className="font-mono text-[10px] text-slate-400">{order.customerMobile}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-white block">{order.productName}</span>
                      <span className="text-[11px] text-slate-400">পরিমাণ: {order.quantity}</span>
                    </td>

                    <td className="px-4 py-3.5 font-mono font-bold text-emerald-400">
                      ৳ {order.totalAmount.toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 text-slate-300 text-[11px]">
                      {order.deliveryPerson}
                    </td>

                    <td className="px-4 py-3.5">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderRecord['status'])}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-white font-bold"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deliveries Table */}
      {subTab === 'deliveries' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl backdrop-blur">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">ডেলিভারি ট্র্যাকিং আইডি</th>
                  <th className="px-4 py-3.5">অর্ডার রেফারেন্স</th>
                  <th className="px-4 py-3.5">প্রাপকের নাম ও ঠিকানা</th>
                  <th className="px-4 py-3.5">পণ্যের বিবরণ</th>
                  <th className="px-4 py-3.5">ডেলিভারি পার্সন</th>
                  <th className="px-4 py-3.5">নির্ধারিত তারিখ</th>
                  <th className="px-4 py-3.5">অবস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredDeliveries.map((del) => (
                  <tr key={del.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-amber-400">{del.id}</span>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      {del.orderId}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-white block">{del.recipientName}</span>
                      <span className="font-mono text-[10px] text-slate-400">{del.recipientMobile}</span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[160px]">{del.address}</span>
                    </td>

                    <td className="px-4 py-3.5 text-slate-200">
                      {del.productDetails}
                    </td>

                    <td className="px-4 py-3.5 text-slate-300 text-[11px]">
                      {del.assignedRepresentative}
                    </td>

                    <td className="px-4 py-3.5 font-mono text-white">
                      {del.deliveryDate}
                    </td>

                    <td className="px-4 py-3.5">
                      <select
                        value={del.status}
                        onChange={(e) => handleUpdateDeliveryStatus(del.id, e.target.value as DeliveryRecord['status'])}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-white font-bold"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
