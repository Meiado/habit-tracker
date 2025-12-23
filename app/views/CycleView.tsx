'use client';

import React, { useMemo } from 'react';

interface CycleViewProps {
  habitos: string[];
  agenda: any;
  setHabitos: (habitos: string[]) => void;
  progresso: any;
  toggleHabito: (s: number, h: string, d: number) => void;
  dataInicio: string;
  reiniciarCiclo: () => void;
  calcularProgressoSemana: (sIndex: number) => number;
  getInfoDia: (sIndex: number, dIndex: number) => { dataFormatada: string, isHoje: boolean };
  statsOrdemOriginal: any[];
  statsOrdenado: any[];
  novoHabito: string;
  setNovoHabito: (val: string) => void;
  editandoIndex: number | null;
  setEditandoIndex: (val: number | null) => void;
  DIAS_NOMES: string[];
  TOTAL_SEMANAS: number;
}

export default function CycleView({
  habitos,
  agenda,
  setHabitos,
  progresso,
  toggleHabito,
  dataInicio,
  reiniciarCiclo,
  calcularProgressoSemana,
  getInfoDia,
  statsOrdemOriginal,
  statsOrdenado,
  novoHabito,
  setNovoHabito,
  editandoIndex,
  setEditandoIndex,
  DIAS_NOMES,
  TOTAL_SEMANAS
}: CycleViewProps) {
  
  const adicionarHabitoLocal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoHabito.trim()) return;
    setHabitos([...habitos, novoHabito]);
    setNovoHabito('');
  };

  const removerHabitoLocal = (index: number) => {
    const nome = habitos[index];
    if (confirm(`Remover "${nome}" e todo o seu progresso?`)) {
      setHabitos(habitos.filter((_, i) => i !== index));
    }
  };

  const statsAgendaGlobal = useMemo(() => {
    let concluidas = 0;
    let atrasadas = 0;
    let total = 0;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    Object.keys(agenda).forEach(dataChave => {
        const tarefas = agenda[dataChave];
        const dataTarefa = new Date(dataChave + 'T00:00:00');
        
        total += tarefas.length;
        concluidas += tarefas.filter((t: any) => t.feito).length;
        atrasadas += tarefas.filter((t: any) => !t.feito && dataTarefa < hoje).length;
    });

    return { total, concluidas, atrasadas, percent: total > 0 ? Math.round((concluidas / total) * 100) : 0 };
  }, [agenda]);

  return (
    <main className="p-4 md:p-8 animate-in fade-in duration-500">
      <div className="mx-auto max-w-full">
        
        <header className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
              GRIND MODE <span className="text-blue-500">ON</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-tighter uppercase">GESTÃO DINÂMICA DE HÁBITOS</p>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-[10px] text-slate-500 font-bold uppercase">
                Ciclo iniciado: {new Date(dataInicio + 'T00:00:00').toLocaleDateString('pt-BR')}
              </p>
              <button onClick={reiniciarCiclo} className="text-[9px] text-blue-500 hover:underline font-bold uppercase tracking-widest">
                Resetar Ciclo
              </button>
            </div>
          </div>

          <form onSubmit={adicionarHabitoLocal} className="flex gap-2 bg-[#161b22] p-2 rounded-xl border border-slate-800 shadow-xl">
            <input 
              type="text" 
              value={novoHabito} 
              onChange={(e) => setNovoHabito(e.target.value)} 
              placeholder="Novo hábito..." 
              className="bg-transparent border-none focus:ring-0 text-sm px-4 w-48 md:w-64 text-white outline-none" 
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-xs font-black transition-all uppercase">
              Add +
            </button>
          </form>
        </header>

        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-[#161b22] shadow-2xl custom-scrollbar">
          <table className="border-collapse min-w-max w-full">
            <thead>
              <tr className="bg-[#1c2128]">
                <th className="sticky left-0 z-20 bg-[#1c2128] p-6 border-r border-b border-slate-700 text-left min-w-[240px] text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  Hábito
                </th>
                {[...Array(TOTAL_SEMANAS)].map((_, sIndex) => (
                  <th key={sIndex} colSpan={7} className="border-r border-b border-slate-700 px-6 py-4">
                    <div className="flex justify-between items-center px-2">
                       <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Semana {sIndex + 1}</span>
                       <span className="text-blue-400 font-mono text-xs">{calcularProgressoSemana(sIndex)}%</span>
                    </div>
                  </th>
                ))}
              </tr>
              <tr className="bg-[#0d1117]/40">
                <th className="sticky left-0 z-20 bg-[#161b22] border-r border-b border-slate-800 p-2"></th>
                {[...Array(TOTAL_SEMANAS)].map((_, sIndex) => (
                  DIAS_NOMES.map((dia, dIndex) => {
                    const { dataFormatada, isHoje } = getInfoDia(sIndex, dIndex);
                    return (
                      <th key={`${sIndex}-${dIndex}`} className={`w-14 border-r border-b border-slate-800 p-3 text-center transition-colors ${isHoje ? 'bg-blue-600/20' : ''}`}>
                        <p className={`text-[10px] font-bold ${isHoje ? 'text-blue-400' : 'text-slate-500'}`}>{dia}</p>
                        <p className="text-[8px] font-mono text-slate-600 mt-1">{dataFormatada}</p>
                      </th>
                    );
                  })
                ))}
              </tr>
            </thead>
            <tbody>
              {habitos.map((habito, index) => (
                <tr key={index} className="group hover:bg-slate-800/20 border-b border-slate-800/50 transition-colors">
                  <td className="sticky left-0 z-30 bg-[#161b22] border-r border-slate-800 p-4 px-8">
                    {editandoIndex === index ? (
                      <input 
                        autoFocus 
                        className="bg-slate-800 text-sm font-bold text-blue-400 px-2 py-1 rounded w-full outline-none border border-blue-500" 
                        value={habito} 
                        onChange={(e) => {
                          const n = [...habitos];
                          n[index] = e.target.value;
                          setHabitos(n);
                        }} 
                        onBlur={() => setEditandoIndex(null)} 
                        onKeyDown={(e) => e.key === 'Enter' && setEditandoIndex(null)} 
                      />
                    ) : (
                      <div className="flex justify-between items-center group">
                        <span onClick={() => setEditandoIndex(index)} className=" font-bold cursor-pointer hover:text-blue-400 transition-colors tracking-tight">
                          {habito}
                        </span>
                        <button onClick={() => removerHabitoLocal(index)} className="cursor-pointer opacity-0 group-hover:opacity-100 text-[9px] font-black text-red-900 hover:text-red-500 ml-4 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                        </button>
                      </div>
                    )}
                  </td>
                  {[...Array(TOTAL_SEMANAS)].map((_, sIndex) => (
                    [...Array(7)].map((_, dIndex) => {
                        const { isHoje } = getInfoDia(sIndex, dIndex);
                        const checked = progresso[`s${sIndex}`]?.[habito]?.[dIndex];

                        return (
                        <td 
                            key={`${sIndex}-${dIndex}`} 
                            className={`border-r border-slate-800/30 p-1 text-center transition-colors ${isHoje ? 'bg-blue-500/10' : ''}`}
                        >
                            <div className="flex items-center justify-center">
                            <button 
                                onClick={() => toggleHabito(sIndex, habito, dIndex)}
                                className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center group/btn
                                ${checked 
                                    ? 'bg-blue-600 border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)] rotate-0 scale-110' 
                                    : 'border-slate-800 rotate-45 hover:border-slate-600'}`}
                            >
                                <span className={`text-[10px] font-bold transition-transform duration-300 
                                ${checked ? 'text-white rotate-0' : 'text-slate-700 -rotate-45 group-hover/btn:text-slate-500'}`}
                                >
                                {checked ? '✓' : '+'}
                                </span>
                            </button>
                            </div>
                        </td>
                        );
                    })
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#161b22] p-6 rounded-3xl border border-slate-800 shadow-xl mt-8">
          <h3 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-[0.4em]">Status Acumulado</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {statsOrdemOriginal.map((s, idx) => (
              <div key={idx} className="bg-[#0d1117] p-4 rounded-2xl border border-slate-800/50 hover:border-blue-500/30 transition-all group">
                <p className="text-[9px] text-slate-500 truncate mb-1 uppercase font-black tracking-tight group-hover:text-slate-300">{s.nome}</p>
                <p className="text-xl font-mono font-bold text-blue-500">{s.percent}%</p>
              </div>
            ))}
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pb-12">
          <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col justify-center">
            <h3 className="text-xs font-black text-slate-500 uppercase mb-6 tracking-widest">Hábito Campeão 🏆</h3>
            {statsOrdenado[0] && statsOrdenado[0].percent > 0 ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <p className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">{statsOrdenado[0].nome}</p>
                <div className="bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full shadow-[0_0_10px_#22c55e]" style={{ width: `${statsOrdenado[0].percent}%` }} />
                </div>
                <p className="text-xs font-mono font-bold text-green-500 mt-2">{statsOrdenado[0].percent}% CONSISTÊNCIA</p>
              </div>
            ) : <p className="text-slate-600 text-sm font-bold italic tracking-widest uppercase">Sem Frequência Registrada</p>}
          </div>

          <div className="bg-[#161b22] border border-slate-800 p-8 rounded-3xl shadow-xl md:col-span-2">
            <h3 className="text-xs font-black text-slate-500 uppercase mb-8 tracking-widest">Ranking de Disciplina</h3>
            <div className="space-y-6">
              {statsOrdenado.map(stat => (
                <div key={stat.nome} className="flex items-center gap-6 group">
                  <span className="text-[10px] font-black text-slate-500 w-28 truncate group-hover:text-blue-400 transition-colors uppercase tracking-tight">{stat.nome}</span>
                  <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800/50">
                    <div className={`h-full transition-all duration-1000 ${stat.percent > 75 ? 'bg-green-500' : stat.percent > 40 ? 'bg-blue-600' : 'bg-red-500/40'}`} 
                         style={{ width: `${stat.percent}%` }} />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 w-10 text-right">{stat.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-[#161b22] p-6 rounded-3xl border border-slate-800 shadow-xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total de Compromissos</p>
                <p className="text-3xl font-mono font-black text-white">{statsAgendaGlobal.total}</p>
            </div>
            <div className="bg-[#161b22] p-6 rounded-3xl border border-slate-800 shadow-xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dívida de Tarefas (Atrasadas)</p>
                <p className="text-3xl font-mono font-black text-red-500">{statsAgendaGlobal.atrasadas}</p>
            </div>
            <div className="bg-[#161b22] p-6 rounded-3xl border border-slate-800 shadow-xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Concluídas</p>
                <p className="text-3xl font-mono font-black text-blue-500">{statsAgendaGlobal.concluidas}</p>
            </div>
            <div className="bg-[#161b22] p-6 rounded-3xl border border-slate-800 shadow-xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Eficiência Global</p>
                <p className="text-3xl font-mono font-black text-green-500">{statsAgendaGlobal.percent}%</p>
            </div>
        </div>
      </div>
    </main>
  );
}