import React from 'react';
import { Player } from '../../types/game';
import { WordItem } from '../../types/word';
import {
  Users,
  Eye,
  MessageCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface DebateScreenProps {
  players: Player[];
  firstSpeakerIndex: number;
  onRevealTruth: () => void;
  onCancelGame: () => void;
}

export const DebateScreen: React.FC<DebateScreenProps> = ({
  players,
  firstSpeakerIndex,
  onRevealTruth,
  onCancelGame,
}) => {
  const firstSpeaker = players[firstSpeakerIndex];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 flex flex-col items-center justify-between min-h-[580px] text-neutral-100">
      {/* Cabeçalho */}
      <div className="text-center flex flex-col items-center pt-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
          Fase de Discussão
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
          Roda de Debate
        </h1>
        <p className="text-xs text-neutral-400 mt-1 max-w-xs">
          Todos já viram seus papéis secretos. Comecem as dicas ou conversem livremente para descobrir quem está mentindo!
        </p>
      </div>

      {/* Destaque de quem inicia as dicas */}
      <div className="w-full my-auto flex flex-col gap-4 py-3">
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 text-center flex flex-col items-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
          <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center justify-center gap-1.5">
            👉 Quem começa a falar:
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5 flex items-center gap-2">
            <span>{firstSpeaker.name}</span>
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-rose-600/20 text-rose-300 border border-rose-500/30">
              🎙️ 1º
            </span>
          </h2>
          <p className="text-[11px] text-neutral-400 mt-1.5">
            A roda de dicas segue no sentido horário a partir dele.
          </p>
        </div>

        {/* Participantes da Roda */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between pb-1 border-b border-neutral-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 uppercase tracking-wider">
              <Users className="w-4 h-4 text-rose-500" />
              <span>Participantes na Roda ({players.length})</span>
            </div>
            <span className="text-[11px] text-neutral-500 font-mono">Impostores ocultos</span>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {players.map((p, idx) => {
              const isFirst = idx === firstSpeakerIndex;
              return (
                <div
                  key={p.id}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                    isFirst
                      ? 'bg-rose-950/40 border-rose-500/50 text-white font-semibold'
                      : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded-full bg-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate">{p.name}</span>
                  </div>
                  {isFirst && (
                    <span className="text-[10px] text-rose-400 shrink-0 font-mono">
                      1º
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dicas de dinâmica */}
        <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60 text-[11px] text-neutral-400 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            Cada participante deve dar apenas <strong>uma dica curta ou palavra</strong>. Após todos falarem, debatam abertamente e façam suas acusações!
          </p>
        </div>
      </div>

      {/* Botão de Revelar Verdade */}
      <div className="w-full flex flex-col gap-2 pt-2">
        <button
          onClick={onRevealTruth}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-[0.98] text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-2xl shadow-rose-950/80 transition-all flex items-center justify-center gap-2 cursor-pointer ring-1 ring-rose-400/30"
        >
          <Eye className="w-5 h-5" />
          <span>Revelar a Verdade</span>
        </button>

        <button
          onClick={onCancelGame}
          className="text-center text-[11px] text-neutral-500 hover:text-neutral-400 py-1"
        >
          Cancelar Partida
        </button>
      </div>
    </div>
  );
};
