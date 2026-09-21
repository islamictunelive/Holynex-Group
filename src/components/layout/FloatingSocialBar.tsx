import React from 'react';
import { MessageCircle, Youtube, Facebook, Send } from 'lucide-react';

export const FloatingSocialBar: React.FC = () => {
  const socialLinks = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: (
        <svg className="w-4 h-4 fill-amber-300" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      url: 'https://facebook.com',
      hoverColor: 'hover:border-amber-400 hover:shadow-amber-500/30',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageCircle className="w-4 h-4 text-amber-300" />,
      url: 'https://wa.me/8801307835260',
      hoverColor: 'hover:border-emerald-400 hover:shadow-emerald-500/30',
    },
    {
      id: 'messenger',
      name: 'Messenger',
      icon: <Send className="w-4 h-4 text-amber-300 -rotate-45" />,
      url: 'https://m.me',
      hoverColor: 'hover:border-blue-400 hover:shadow-blue-500/30',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: <Youtube className="w-4 h-4 text-amber-300" />,
      url: 'https://youtube.com',
      hoverColor: 'hover:border-red-400 hover:shadow-red-500/30',
    },
  ];

  return (
    <aside aria-label="Social media links" className="fixed left-3 sm:left-5 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5">
      {socialLinks.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.name}
          title={item.name}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950/80 border border-amber-500/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg ${item.hoverColor} group`}
        >
          {item.icon}
        </a>
      ))}
    </aside>
  );
};
