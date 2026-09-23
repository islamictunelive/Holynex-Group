import React from 'react';
import { MessageCircle, Youtube, Globe, FileText } from 'lucide-react';

export const FloatingSocialBar: React.FC = () => {
  const socialLinks = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: (
        <svg className="w-4 h-4 fill-amber-300 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      url: 'https://www.facebook.com/holynexgroup',
      hoverColor: 'hover:border-blue-500 hover:shadow-blue-500/30 hover:bg-blue-600',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: <Youtube className="w-4 h-4 text-amber-300 group-hover:text-white transition-colors" />,
      url: 'https://www.youtube.com/@holynexgroup1',
      hoverColor: 'hover:border-red-500 hover:shadow-red-500/30 hover:bg-red-600',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp (01307835260)',
      icon: <MessageCircle className="w-4 h-4 text-amber-300 group-hover:text-white transition-colors" />,
      url: 'https://wa.me/8801307835260',
      hoverColor: 'hover:border-emerald-500 hover:shadow-emerald-500/30 hover:bg-emerald-600',
    },
    {
      id: 'website',
      name: 'Official Website',
      icon: <Globe className="w-4 h-4 text-amber-300 group-hover:text-white transition-colors" />,
      url: 'https://holynex-group-bay.vercel.app/',
      hoverColor: 'hover:border-amber-400 hover:shadow-amber-500/30 hover:bg-amber-500',
    },
    {
      id: 'dealer-application',
      name: 'Dealer Application',
      icon: <FileText className="w-4 h-4 text-amber-300 group-hover:text-slate-950 transition-colors" />,
      url: 'https://holynex-group-bay.vercel.app/#/dealer-application',
      hoverColor: 'hover:border-amber-300 hover:shadow-amber-500/40 hover:bg-amber-400',
    },
  ];

  return (
    <aside aria-label="Official Holynex Group Channels" className="fixed left-3 sm:left-5 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5">
      {socialLinks.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.name}
          title={item.name}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950/85 border border-amber-500/35 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg ${item.hoverColor} group`}
        >
          {item.icon}
        </a>
      ))}
    </aside>
  );
};
