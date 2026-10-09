import React, { useState } from 'react';
import { Player, GameSettings } from '../../types/game';
import { WordItem } from '../../types/word';
import {
  Fingerprint,
  Eye,
  EyeOff,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  Users2,
  Lock,
  Sparkles
} from 'lucide-react';

interface SecretRevealScreenProps {
  players: Player[];
  secretWord: WordItem;
  settings: GameSettings;
  onAllPlayersRevealed: () => void;
  onCancelGame: () => void;
}

export const SecretRevealScreen: React.FC<SecretRevealScreenProps> = ({
  players,
  secretWord,
  settings,
  onAllPlayersRevealed,
  onCancelGame,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [hasViewedCurrent, setHasViewedCurrent] = useState(false);

  const currentPlayer = players[currentIndex];
  const isLastPlayer = currentIndex === players.length - 1;

  // Encontra os parceiros impostores caso haja mais de 1
  const partnerImpostors = players
    .filter((p) => p.isImpostor && p.id !== currentPlayer.id)
    .map((p) => p.name);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsHolding(true);
    setHasViewedCurrent(true);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsHolding(false);
  };

  const handlePointerLeave = () => {
    if (isHolding) {
      setIsHolding(false);
    }
  };

  const handleNextPlayer = () => {
    setIsHolding(false);
    setHasViewedCurrent(false);

    if (isLastPlayer) {
      onAllPlayersRevealed();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 flex flex-col items-center justify-between min-h-[580px] text-neutral-100 select-none">
      {/* 1. Cabeçalho com o nome grande do jogador */}
      <div className="w-full text-center flex flex-col items-center pt-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
          Passe o celular para
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1 drop-shadow-sm">
          {currentPlayer.name}
        </h1>
        <div className="mt-1 flex items-center gap-2 text-xs text-neutral-400">
          <span>Jogador {currentIndex + 1} de {players.length}</span>
          <span>·</span>
          <span>Apenas você deve ver a tela</span>
        </div>
      </div>

      {/* 2. Cartão Central Interativo "Segure para Ver" */}
      <div className="w-full my-auto py-2">
        <div
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          onPointerCancel={handlePointerLeave}
          onContextMenu={(e) => e.preventDefault()}
          className={`w-full rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center min-h-[340px] border transition-all duration-200 cursor-pointer touch-none relative overflow-hidden shadow-2xl ${
            isHolding
              ? currentPlayer.isImpostor
                ? 'bg-gradient-to-b from-neutral-950 via-rose-950/40 to-neutral-950 border-rose-500/80 shadow-rose-950/80 scale-[1.01]'
                : 'bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 border-emerald-500/80 shadow-emerald-950/80 scale-[1.01]'
              : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700/80 shadow-black/80'
          }`}
        >
          {/* Luz de fundo atmosférica */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
              isHolding
                ? currentPlayer.isImpostor
                  ? 'bg-radial from-rose-500/20 via-transparent to-transparent opacity-100'
                  : 'bg-radial from-emerald-500/20 via-transparent to-transparent opacity-100'
                : 'opacity-0'
            }`}
          />

          {/* ESTADO 1: SOLTO (OCULTO) */}
          {!isHolding ? (
            <div className="flex flex-col items-center text-center gap-4 z-10 pointer-events-none animate-fadeIn">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-300 shadow-inner">
                  <Fingerprint className="w-10 h-10 text-rose-500" />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">
                  Segure para ver seu papel
                </h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-[240px]">
                  Pressione o dedo sobre este cartão e mantenha pressionado para espiar.
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-[11px] text-neutral-400 flex items-center gap-1.5 font-mono">
                <Lock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Ao soltar, a tela oculta na hora</span>
              </div>
            </div>
          ) : (
            /* ESTADO 2: SEGURANDO (REVELADO) */
            <div className="w-full flex flex-col items-center text-center gap-4 z-10 animate-fadeIn pointer-events-none">
              {currentPlayer.isImpostor ? (
                /* 4. CONTEÚDO DO IMPOSTOR */
                <div className="w-full flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/60 flex items-center justify-center text-rose-500">
                    <ShieldAlert className="w-8 h-8" />
                  </div>

                  {/* Aviso em destaque vermelho */}
                  <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-semibold">
                    Seu Papel Secreto
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-rose-500 tracking-tight leading-tight">
                    VOCÊ É O IMPOSTOR
                  </h2>

                  <p className="text-xs text-neutral-300 max-w-[260px] leading-relaxed">
                    Você não recebeu a palavra secreta. Observe os outros jogadores e finja que sabe!
                  </p>

                  {/* Com dica / Sem dica */}
                  {settings.giveHintToImpostor ? (
                    <div className="w-full mt-2 p-3 rounded-xl bg-neutral-950 border border-rose-900/50 text-xs text-neutral-200 flex items-start gap-2.5 text-left">
                      <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-amber-300 block text-[11px] uppercase tracking-wide">
                          Dica do Tema:
                        </span>
                        <span className="text-neutral-200">{secretWord.hint}</span>
                      </div>
                    </div>
                  ) : null}

                  {/* Impostores se conhecem */}
                  {settings.impostorsKnowEachOther && settings.impostorCount === 2 && partnerImpostors.length > 0 && (
                    <div className="w-full mt-1 p-3 rounded-xl bg-neutral-950 border border-rose-900/50 text-xs text-neutral-200 flex items-start gap-2.5 text-left">
                      <Users2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-rose-400 block text-[11px] uppercase tracking-wide">
                          Seu parceiro impostor é:
                        </span>
                        <strong className="text-white text-sm">
                          {partnerImpostors.join(', ')}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* 3. CONTEÚDO DO CIVIL */
                <div className="w-full flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-1">
                    <Eye className="w-6 h-6" />
                  </div>

                  <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                    Categoria: <strong className="text-neutral-200">{secretWord.category}</strong>
                  </span>

                  <span className="text-xs text-neutral-400 mt-1">Sua palavra secreta é:</span>
                  <h2 className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight drop-shadow-sm">
                    {secretWord.word}
                  </h2>

                  <p className="text-xs text-neutral-400 max-w-[240px] mt-2 leading-relaxed">
                    Você é um Civil. Fale dicas inteligentes sem entregar a palavra ao impostor.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 5. Botão "Próximo Jogador" (surge após o jogador soltar a tela) */}
      <div className="w-full flex flex-col gap-2 pt-2">
        {hasViewedCurrent ? (
          <button
            onClick={handleNextPlayer}
            className="w-full py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white font-extrabold text-sm sm:text-base tracking-wide shadow-xl shadow-rose-950/70 transition-all flex items-center justify-center gap-2 animate-fadeIn cursor-pointer"
          >
            <span>
              {isLastPlayer
                ? 'Todos Viram! Iniciar Rodada'
                : `Próximo Jogador (${players[currentIndex + 1].name})`}
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="py-3 text-center text-xs text-neutral-400 font-mono">
            {currentPlayer.name}, segure o cartão acima para desbloquear o botão
          </div>
        )}

        <button
          onClick={onCancelGame}
          className="text-center text-[11px] text-neutral-400 hover:text-neutral-300 transition-colors py-1"
        >
          Cancelar e Voltar ao Menu
        </button>
      </div>
    </div>
  );
};
