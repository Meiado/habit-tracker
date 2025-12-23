'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import DayView from './views/DayView';
import WeekView from './views/WeekView';
import CycleView from './views/CycleView';

const DIAS_NOMES = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
const TOTAL_SEMANAS = 4;

export default function HabitTracker() {
  const [progresso, setProgresso] = useState<any>(null);
  const [habitos, setHabitos] = useState<string[]>([]);
  const [dataInicio, setDataInicio] = useState<string>('');
  const [novoHabito, setNovoHabito] = useState('');
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [abaAtiva, setAbaAtiva] = useState('dia');
  const [agenda, setAgenda] = useState<any>({});

  const semanaAtualIndex = useMemo(() => {
    if (!dataInicio) return 0;
    const hoje = new Date();
    const inicio = new Date(dataInicio + 'T00:00:00');
    const diffTime = Math.abs(hoje.getTime() - inicio.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const sIndex = Math.floor(diffDays / 7);
    return sIndex > 3 ? 3 : sIndex;
  }, [dataInicio]);

  const getInfoDia = (sIndex: number, dIndex: number) => {
    if (!dataInicio) return { dataFormatada: '', isHoje: false, dataChave: '' };
    const data = new Date(dataInicio + 'T00:00:00');
    data.setDate(data.getDate() + (sIndex * 7) + dIndex);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataComparar = new Date(data);
    dataComparar.setHours(0, 0, 0, 0);

    return {
      dataFormatada: data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      isHoje: dataComparar.getTime() === hoje.getTime(),
      dataChave: data.toISOString().split('T')[0]
    };
  };

  const getHojeIndices = () => {
    const hoje = new Date();
    const diaSemana = hoje.getDay();
    const dIndex = diaSemana === 0 ? 6 : diaSemana - 1;
    return { 
      sIndex: semanaAtualIndex, 
      dIndex, 
      dataChaveHoje: hoje.toISOString().split('T')[0] 
    };
  };

  const adicionarTarefa = (data: string, texto: string) => {
    const novaAgenda = { ...agenda };
    if (!novaAgenda[data]) novaAgenda[data] = [];
    novaAgenda[data].push({ id: Date.now(), texto, feito: false });
    setAgenda(novaAgenda);
  };

  const toggleTarefa = (data: string, id: number) => {
    const novaAgenda = { ...agenda };
    if (!novaAgenda[data]) return;
    novaAgenda[data] = novaAgenda[data].map((t: any) => 
      t.id === id ? { ...t, feito: !t.feito } : t
    );
    setAgenda(novaAgenda);
  };

  const removerTarefa = (dataChave: string, id: number) => {
    const novaAgenda = { ...agenda };
    if (!novaAgenda[dataChave]) return;
    novaAgenda[dataChave] = novaAgenda[dataChave].filter((t: any) => t.id !== id);
    setAgenda(novaAgenda);
  };

  useEffect(() => {
    const habitosSalvos = localStorage.getItem('@Focus:habitos');
    const progressoSalvo = localStorage.getItem('@Focus:progresso');
    const inicioSalvo = localStorage.getItem('@Focus:dataInicio');
    const agendaSalva = localStorage.getItem('@Focus:agenda');

    setHabitos(habitosSalvos ? JSON.parse(habitosSalvos) : ["Treino", "Leitura"]);
    setProgresso(progressoSalvo ? JSON.parse(progressoSalvo) : {});
    setAgenda(agendaSalva ? JSON.parse(agendaSalva) : {});

    if (inicioSalvo) {
      setDataInicio(inicioSalvo);
    } else {
      const hoje = new Date();
      const diaDaSemana = hoje.getDay(); 
      const diff = hoje.getDate() - diaDaSemana + (diaDaSemana === 0 ? -6 : 1); 
      const segundaFeira = new Date(hoje.setDate(diff)).toISOString().split('T')[0];
      setDataInicio(segundaFeira);
      localStorage.setItem('@Focus:dataInicio', segundaFeira);
    }
  }, []);

  useEffect(() => {
    if (progresso !== null) {
      localStorage.setItem('@Focus:habitos', JSON.stringify(habitos));
      localStorage.setItem('@Focus:progresso', JSON.stringify(progresso));
      localStorage.setItem('@Focus:agenda', JSON.stringify(agenda));
    }
  }, [habitos, progresso, agenda]);

  const statsOrdemOriginal = useMemo(() => {
    if (!progresso || habitos.length === 0) return [];
    return habitos.map(h => {
      let totalConcluido = 0;
      for (let s = 0; s < TOTAL_SEMANAS; s++) {
        const checksVal = (progresso[`s${s}`]?.[h] || []).filter(Boolean).length;
        totalConcluido += checksVal;
      }
      const percent = Math.round((totalConcluido / (TOTAL_SEMANAS * 7)) * 100);
      return { nome: h, percent };
    });
  }, [habitos, progresso, dataInicio]);

  const statsOrdenado = useMemo(() => {
    return [...statsOrdemOriginal].sort((a, b) => b.percent - a.percent);
  }, [statsOrdemOriginal]);

  const toggleHabito = (s: number, h: string, d: number) => {
    const key = `s${s}`;
    const novo = { ...progresso };
    if (!novo[key]) novo[key] = {};
    if (!novo[key][h]) novo[key][h] = Array(7).fill(false);
    novo[key][h][d] = !novo[key][h][d];
    setProgresso(novo);
  };

  const calcularProgressoSemana = (sIndex: number) => {
    if (!progresso || habitos.length === 0) return 0;
    const dados = progresso[`s${sIndex}`];
    if (!dados) return 0;
    let checks = 0;
    habitos.forEach(h => { if (dados[h]) checks += dados[h].filter(Boolean).length; });
    return Math.round((checks / (habitos.length * 7)) * 100);
  };

  const reiniciarCiclo = () => {
    if (confirm("Resetar ciclo e agenda?")) {
      const hoje = new Date();
      const segunda = hoje.toISOString().split('T')[0];
      setDataInicio(segunda);
      setProgresso({});
      setAgenda({});
      localStorage.setItem('@Focus:dataInicio', segunda);
    }
  };

  if (progresso === null || !dataInicio) return null;

  const { dataChaveHoje, ...indicesHoje } = getHojeIndices();

  return (
    <>
      <Navbar view={abaAtiva} setView={setAbaAtiva} />
      {abaAtiva === 'dia' && (
        <DayView 
          habitos={habitos} 
          progresso={progresso} 
          onToggle={toggleHabito} 
          indices={indicesHoje}
          agenda={agenda[dataChaveHoje] || []}
          onToggleTarefa={(id: number) => toggleTarefa(dataChaveHoje, id)}
          onAdicionarTarefa={(txt: string) => adicionarTarefa(dataChaveHoje, txt)}
          onRemoverTarefa={(id: number) => removerTarefa(dataChaveHoje, id)}
        />
      )}

      {abaAtiva === 'semana' && (
        <WeekView 
          habitos={habitos} 
          progresso={progresso} 
          onToggle={toggleHabito} 
          getInfoDia={getInfoDia}
          sAtual={semanaAtualIndex}
          agenda={agenda}
          onToggleTarefa={toggleTarefa}
          onAdicionarTarefa={adicionarTarefa}
          onRemoverTarefa={removerTarefa}
        />
      )}

      {abaAtiva === 'ciclo' && (
        <CycleView
          habitos={habitos}
          agenda={agenda}
          progresso={progresso}
          toggleHabito={toggleHabito}
          getInfoDia={getInfoDia}
          dataInicio={dataInicio}
          statsOrdemOriginal={statsOrdemOriginal}
          statsOrdenado={statsOrdenado}
          reiniciarCiclo={reiniciarCiclo}
          editandoIndex={editandoIndex}
          setEditandoIndex={setEditandoIndex}
          setHabitos={setHabitos} 
          calcularProgressoSemana={calcularProgressoSemana} 
          novoHabito={novoHabito} 
          setNovoHabito={setNovoHabito} 
          DIAS_NOMES={DIAS_NOMES} 
          TOTAL_SEMANAS={TOTAL_SEMANAS}      
        />
      )}
    </>
  );
}