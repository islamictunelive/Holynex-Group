import React, { useState } from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Storage } from '../../lib/storage';
import { AuditLog } from '../../types';
import { History, Shield, Clock, RefreshCw, UserCheck } from 'lucide-react';

export const AdminAuditLogsTab: React.FC = () => {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<AuditLog[]>(() => Storage.getAuditLogs());

  const handleRefresh = () => {
    setLogs(Storage.getAuditLogs());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              {t('অডিট লগ ও নিরাপত্তা রেকর্ড', 'Audit & Security Action Logs')}
            </h2>
            <span className="text-xs bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded-full">
              {logs.length} {t('টি রেকর্ড', 'Records')}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {t(
              'কোন অ্যাডমিন বা সাব-এডমিন কখন কোন তথ্য পরিবর্তন বা অনুমোদন করেছেন তার সম্পূর্ণ হিস্ট্রি।',
              'Traceability records showing which Admin or Sub-Admin edited, approved, or published data.'
            )}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t('রিফ্রেশ করুন', 'Refresh')}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3.5 px-4">{t('সময়', 'Time')}</th>
                <th className="py-3.5 px-4">{t('অ্যাডমিন / কর্মকর্তা', 'Admin Operator')}</th>
                <th className="py-3.5 px-4">{t('অ্যাকশন', 'Action')}</th>
                <th className="py-3.5 px-4">{t('বিভাগ', 'Entity')}</th>
                <th className="py-3.5 px-4">{t('বিস্তারিত তথ্য', 'Action Details')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    {t('কোনো অডিট লগ রেকর্ড নেই', 'No audit logs recorded yet')}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>{log.adminUser || 'Admin'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                        {log.entity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-md truncate">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
