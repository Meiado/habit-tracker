'use client';

import React, { useState, useMemo } from 'react';

interface DayViewProps {
  habitos: string[];
  progresso: any;
  onToggle: (s: number, h: string, d: number) => void;
  indices: { sIndex: number; dIndex: number };
  agenda: any;
  onToggleTarefa: (id: number) => void;
  onAdicionarTarefa: (texto: string) => void;
  onRemoverTarefa: (id: number) => void;
}

export default function DayView({ 
  habitos, 
  progresso, 
  onToggle, 
  indices, 
  agenda, 
  onToggleTarefa, 
  onAdicionarTarefa,
  onRemoverTarefa 
}: DayViewProps) {
  const { sIndex, dIndex } = indices;
  const [novaTarefa, setNovaTarefa] = useState('');

  const progressoDia = useMemo(() => {
    const habitosConcluidos = habitos.filter(h => progresso[`s${sIndex}`]?.[h]?.[dIndex]).length;
    const tarefasConcluidas = agenda.filter((t: any) => t.feito).length;
    const totalItens = habitos.length + agenda.length;
    if (totalItens === 0) return 0;
    return Math.round(((habitosConcluidos + tarefasConcluidas) / totalItens) * 100);
  }, [habitos, progresso, sIndex, dIndex, agenda]);

  const handleSubmitTarefa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaTarefa.trim()) return;
    onAdicionarTarefa(novaTarefa);
    setNovaTarefa('');
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500 pb-20 no-scrollbar">
      
      <section className="bg-[#161b22] p-8 rounded-[2rem] border border-slate-800 shadow-2xl text-white">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Status de Hoje</h2>
            <p className="text-3xl font-black italic">FOCADO</p>
          </div>
          <div className="text-right font-mono font-black text-4xl text-blue-500">
            {progressoDia}%
          </div>
        </div>
        <div className="h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(37,99,235,0.6)]" 
            style={{ width: `${progressoDia}%` }}
          />
        </div>
      </section>

      <section>
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-2">Protocolo de Disciplina</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {habitos.map((habito: string) => {
            const checked = progresso[`s${sIndex}`]?.[habito]?.[dIndex];
            return (
              <div 
                key={habito}
                onClick={() => onToggle(sIndex, habito, dIndex)}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between group
                  ${checked 
                    ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.2)] scale-[1.02]' 
                    : 'bg-[#161b22] border-slate-800 hover:border-slate-700'}`}
              >
                <span className={`text-sm font-bold uppercase tracking-tighter ${checked ? 'text-blue-400' : 'text-slate-400'}`}>
                  {habito}
                </span>
                <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-300
                  ${checked 
                    ? 'bg-blue-500 border-blue-400 rotate-0 shadow-[0_0_20px_rgba(59,130,246,0.6)]' 
                    : 'border-slate-700 rotate-45 group-hover:border-slate-500'}`}>
                  <span className={`text-lg font-bold ${checked ? 'text-white rotate-0' : 'text-slate-700 -rotate-45'}`}>
                    {checked ? '✓' : '+'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-[#161b22] rounded-[2rem] border border-slate-800 shadow-xl overflow-hidden flex flex-col max-h-[500px]">
        <div className="p-8 pb-4 border-b border-slate-800/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Agenda & Pendências</h3>
            
            <form onSubmit={handleSubmitTarefa} className="flex gap-2 w-full md:w-auto">
              <input 
                type="text" 
                value={novaTarefa}
                onChange={(e) => setNovaTarefa(e.target.value)}
                placeholder="Nova tarefa extra..."
                className="bg-[#0d1117] border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:border-blue-500 outline-none flex-1 md:w-64"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white p-2 px-4 rounded-xl text-[10px] font-bold transition-all shrink-0">
                +
              </button>
            </form>
          </div>
        </div>

        <div className="p-6 space-y-3 overflow-y-auto no-scrollbar flex-1 max-h-[340px]">
          {agenda.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 opacity-30">
               <span className="text-xs font-bold uppercase tracking-widest">Grind Mode Clear</span>
               <p className="text-[10px]">Sem pendências extras hoje</p>
            </div>
          ) : (
            agenda.map((tarefa: any) => (
              <div 
                key={tarefa.id}
                className="flex items-center justify-between p-4 bg-[#0d1117]/50 rounded-2xl border border-slate-800/50 transition-all group hover:border-slate-600"
              >
                <div 
                  className="flex items-center gap-4 cursor-pointer flex-1"
                  onClick={() => onToggleTarefa(tarefa.id)}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all
                    ${tarefa.feito ? 'bg-green-500 border-green-500' : 'border-slate-700'}`}>
                    {tarefa.feito && <span className="text-[10px] text-white font-bold">✓</span>}
                  </div>
                  <span className={`text-sm font-medium transition-all ${tarefa.feito ? 'text-slate-600 line-through' : 'text-slate-300'}`}>
                    {tarefa.texto}
                  </span>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoverTarefa(tarefa.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-red-500 transition-all"
                  title="Remover tarefa"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}