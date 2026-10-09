import React from 'react';
import { Player, GameSettings } from '../../types/game';
import { WordItem } from '../../types/word';
import {
  ShieldAlert,
  CheckCircle2,
  RotateCcw,
  Settings,
  Sparkles,
  HelpCircle,
  Users
} from 'lucide-react';

interface ResultScreenProps {
  players: Player[];
  secretWord: WordItem;
  settings: GameSettings;
  onPlayNewRound: () => void;
  onBackToSetup: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  players,
  secretWord,
  settings,
  onPlayNewRound,
  onBackToSetup,
}) => {
  const impostors = players.filter((p) => p.isImpostor);
  const civilians = players.filter((p) => !p.isImpostor);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 flex flex-col items-center justify-between min-h-[580px] text-neutral-100 animate-fadeIn">
      {/* Cabeçalho */}
      <div className="text-center flex flex-col items-center pt-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
          Fim da Rodada
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
          A Verdade Revelada
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Veja quem estava mentindo e qual era a palavra do jogo.
        </p>
      </div>

      <div className="w-full my-auto flex flex-col gap-4 py-3">
        {/* 1. Destaque dos Impostores com Animação */}
        <div className="bg-gradient-to-b from-rose-950/60 via-neutral-900 to-neutral-900 border border-rose-500/60 rounded-3xl p-5 text-center flex flex-col items-center shadow-2xl shadow-rose-950/70 relative overflow-hidden animate-bounce-short">
          <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/60 flex items-center justify-center text-rose-500 mb-2 shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-bold">
            {impostors.length > 1 ? 'Os Impostores Eram:' : 'O Impostor Era:'}
          </span>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            {impostors.map((imp) => (
              <span
                key={imp.id}
                className="text-2xl sm:text-3xl font-black text-white px-3 py-1 bg-rose-600/30 border border-rose-500/40 rounded-xl"
              >
                {imp.name}
              </span>
            ))}
          </div>

          {settings.giveHintToImpostor && (
            <p className="text-[11px] text-neutral-400 mt-2">
              (Eles receberam a dica temática para blefar)
            </p>
          )}
        </div>

        {/* 2. Destaque da Palavra Secreta */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 text-center flex flex-col items-center shadow-lg">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Categoria: <strong className="text-neutral-200">{secretWord.category}</strong>
          </span>

          <span className="text-xs text-neutral-400 mt-1">A palavra secreta era:</span>

          <h2 className="text-3xl font-black text-emerald-400 tracking-tight mt-1 drop-shadow-sm">
            {secretWord.word}
          </h2>

          <div className="mt-2 text-xs text-neutral-300 italic flex items-center gap-1.5 justify-center">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Dica do tema: "{secretWord.hint}"</span>
          </div>
        </div>

        {/* 3. Civis Inocentes */}
        <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-3 flex flex-col gap-1.5 text-xs">
          <div className="flex items-center justify-between text-neutral-400 font-mono text-[11px]">
            <span>Civis Inocentes ({civilians.length})</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {civilians.map((c) => (
              <span
                key={c.id}
                className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs font-medium"
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Ações Finais */}
      <div className="w-full flex flex-col gap-2 pt-2">
        {/* Botão Jogar Nova Rodada */}
        <button
          onClick={onPlayNewRound}
          className="w-full py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-rose-950/70 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Jogar Nova Rodada</span>
        </button>

        {/* Botão Configurar Nova Partida */}
        <button
          onClick={onBackToSetup}
          className="w-full py-2.5 px-4 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Alterar Jogadores ou Regras</span>
        </button>
      </div>
    </div>
  );
};
