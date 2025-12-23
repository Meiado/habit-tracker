'use client';

import React, { useState, useMemo } from 'react';

export default function WeekView({ 
  habitos, progresso, onToggle, getInfoDia, sAtual, agenda, onToggleTarefa, onAdicionarTarefa, onRemoverTarefa
}: any) {

  const statsAgendaSemana = useMemo(() => {
    let concluidas = 0;
    let atrasadas = 0;
    let total = 0;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const { dataChave } = getInfoDia(sAtual, i);
      const tarefas = agenda[dataChave] || [];
      const dataTarefa = new Date(dataChave + 'T00:00:00');
      
      total += tarefas.length;
      concluidas += tarefas.filter((t: any) => t.feito).length;
      atrasadas += tarefas.filter((t: any) => !t.feito && dataTarefa < hoje).length;
    }

    return { total, concluidas, atrasadas, percent: total > 0 ? Math.round((concluidas / total) * 100) : 0 };
  }, [agenda, sAtual, getInfoDia]);

  const progressoSemanal = useMemo(() => {
    if (habitos.length === 0) return 0;
    const dados = progresso[`s${sAtual}`];
    if (!dados) return 0;
    let checks = 0;
    habitos.forEach((h: string) => { if (dados[h]) checks += dados[h].filter(Boolean).length; });
    return Math.round((checks / (habitos.length * 7)) * 100);
  }, [habitos, progresso, sAtual]);

  const [inputs, setInputs] = useState<{ [key: string]: string }>({});
  const handleAddClick = (dataChave: string) => {
    const texto = inputs[dataChave];
    if (!texto || !texto.trim()) return;
    onAdicionarTarefa(dataChave, texto);
    setInputs({ ...inputs, [dataChave]: '' });
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in slide-in-from-right-4 duration-500">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-[#161b22] p-6 rounded-3xl border border-slate-800 shadow-xl border-l-4 border-l-blue-500">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Consistência Hábitos</p>
          <p className="text-3xl font-mono font-black text-blue-500">{progressoSemanal}%</p>
        </div>
      </div>

      <section className="bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1c2128] text-[10px] text-slate-500 font-black uppercase tracking-widest">
                <th className="p-4 text-left border-r border-slate-800 w-48">Hábito</th>
                {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'].map((dia, idx) => {
                  const { dataFormatada, isHoje } = getInfoDia(sAtual, idx);
                  return (
                    <th key={idx} className={`p-4 text-center border-r border-slate-800 last:border-0 ${isHoje ? 'bg-blue-600/10 text-blue-400' : ''}`}>
                      {dia} <br /> <span className="text-[8px] opacity-50">{dataFormatada}</span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {habitos.map((habito: string) => (
                <tr key={habito} className="border-b border-slate-800 hover:bg-slate-800/30 transition-all">
                  <td className="p-4 text-xs font-bold text-slate-300 border-r border-slate-800 uppercase tracking-tighter">{habito}</td>
                  {[...Array(7)].map((_, dIdx) => {
                    const checked = progresso[`s${sAtual}`]?.[habito]?.[dIdx];
                    const { isHoje } = getInfoDia(sAtual, dIdx);
                    return (
                      <td key={dIdx} onClick={() => onToggle(sAtual, habito, dIdx)} className={`p-2 border-r border-slate-800 last:border-0 cursor-pointer transition-colors ${isHoje ? 'bg-blue-600/5' : ''}`}>
                        <div className="flex items-center justify-center">
                          <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-300
                            ${checked ? 'bg-blue-500 border-blue-400 rotate-0 shadow-lg' : 'border-slate-700 rotate-45 hover:border-slate-500'}`}>
                            <span className={`text-lg font-bold ${checked ? 'text-white' : 'text-slate-700'} ${checked ? 'rotate-0' : '-rotate-45'}`}>
                              {checked ? '✓' : '+'}
                            </span>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
        WEEK <span className="text-blue-500">PLANNING</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {[...Array(7)].map((_, idx) => {
          const { dataFormatada, isHoje, dataChave } = getInfoDia(sAtual, idx);
          const tarefas = agenda[dataChave] || [];
          const dataTarefa = new Date(dataChave + 'T00:00:00');
          const hoje = new Date();
          hoje.setHours(0,0,0,0);

          return (
            <div key={idx} className={`flex flex-col p-4 rounded-2xl border min-h-[250px] transition-all ${isHoje ? 'bg-blue-600/5 border-blue-500 shadow-2xl' : 'bg-[#161b22] border-slate-800'}`}>
              <div className="mb-4">
                <p className={`text-[10px] font-black ${isHoje ? 'text-blue-400' : 'text-slate-500'}`}>{dataFormatada}</p>
                <p className={`text-xs font-bold uppercase tracking-tighter ${isHoje ? 'text-white' : 'text-slate-400'}`}>
                  {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'][idx]}
                </p>
              </div>

              <div className="flex-1 space-y-2 mb-4 overflow-y-auto max-h-40 custom-scrollbar no-scrollbar">
                {tarefas.length > 0 ? tarefas.map((t: any) => {
                  const estaAtrasada = !t.feito && dataTarefa < hoje;
                  return (
                    <div key={t.id} className="group flex items-center justify-between gap-1 py-0.5">
                    <div 
                        onClick={() => onToggleTarefa(dataChave, t.id)} 
                        className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                    >
                        <div className={`w-3 h-3 rounded-sm border transition-all shrink-0 flex items-center justify-center
                            ${t.feito ? 'bg-green-500 border-green-500' : estaAtrasada ? 'bg-red-500/20 border-red-500' : 'border-slate-700'}`} 
                        >
                            {t.feito && <span className="text-[8px] text-white font-bold">✓</span>}
                        </div>

                        <span className={`text-[14px] leading-none transition-all truncate
                            ${t.feito ? 'text-slate-600 line-through' : estaAtrasada ? 'text-red-400' : 'text-slate-300'}`}>
                            {t.texto}
                        </span>
                    </div>

                    <button 
                        onClick={(e) => {
                        e.stopPropagation(); 
                        onRemoverTarefa(dataChave, t.id);
                        }} 
                        className="cursor-pointer opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-500 transition-all p-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                        </svg>
                    </button>
                    </div>
                  );
                }) : <p className="text-[10px] text-slate-500">Sem tarefas</p>}
              </div>

              <div className="mt-auto pt-2 border-t border-slate-800/50">
                <div className="flex gap-1">
                  <input type="text" value={inputs[dataChave] || ''} onChange={(e) => setInputs({...inputs, [dataChave]: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && handleAddClick(dataChave)} placeholder="Add..." className="bg-[#0d1117] border border-slate-800 rounded-lg px-2 py-1 text-[9px] text-white outline-none w-full" />
                  <button onClick={() => handleAddClick(dataChave)} className="bg-slate-800 hover:bg-blue-600 text-white p-1 px-2 rounded-lg text-[10px]">+</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#161b22] p-6 rounded-3xl border border-slate-800 shadow-xl border-l-4 border-l-green-500">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Agenda Concluída</p>
          <p className="text-3xl font-mono font-black text-green-500">{statsAgendaSemana.total > 0 ? statsAgendaSemana.percent + '%' : '-'}</p>
        </div>
        <div className="bg-[#161b22] p-6 rounded-3xl border border-slate-800 shadow-xl border-l-4 border-l-red-500">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tarefas Atrasadas</p>
          <p className="text-3xl font-mono font-black text-red-500">{statsAgendaSemana.atrasadas}</p>
        </div>
      </div>
    </div>
  );
}