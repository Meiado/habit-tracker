import React from 'react';

export default function Navbar({ view, setView }: { view: string, setView: (v: string) => void }) {
  const itens = [
    { id: 'dia', label: 'Hoje', icon: '🎯' },
    { id: 'semana', label: 'Semana', icon: '📅' },
    { id: 'ciclo', label: 'Ciclo Completo', icon: '📊' }
  ];

  return (
    <nav className="flex justify-center gap-4 mb-8 mt-4">
      {itens.map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`px-6 py-2 rounded-full text-xs font-bold transition-all border ${
            view === item.id 
            ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
            : 'bg-[#161b22] border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
        >
          {item.icon} {item.label}
        </button>
      ))}
    </nav>
  );
}