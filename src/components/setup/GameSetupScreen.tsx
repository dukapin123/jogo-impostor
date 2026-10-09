import React, { useState, useEffect } from 'react';
import { GameSettings } from '../../types/game';
import { WORD_CATEGORIES, ALL_WORDS } from '../../data/wordPacks';
import { WordManager } from '../../services/wordManager';
import {
  UserPlus,
  Trash2,
  Users,
  Eye,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Check,
  X,
  Shuffle
} from 'lucide-react';

interface GameSetupScreenProps {
  onStartGame: (players: string[], settings: GameSettings) => void;
  onOpenWordManager?: () => void;
}

export const GameSetupScreen: React.FC<GameSetupScreenProps> = ({
  onStartGame,
  onOpenWordManager,
}) => {
  const [playerNameInput, setPlayerNameInput] = useState('');
  const [players, setPlayers] = useState<string[]>([
    'Lucas',
    'Mariana',
    'Gabriel',
    'Beatriz',
  ]);

  const [settings, setSettings] = useState<GameSettings>({
    impostorCount: 1,
    giveHintToImpostor: false,
    impostorsKnowEachOther: false,
    categoryId: 'all',
  });

  const [inputError, setInputError] = useState<string | null>(null);

  // If impostorCount drops to 1, ensure impostorsKnowEachOther is disabled
  useEffect(() => {
    if (settings.impostorCount === 1 && settings.impostorsKnowEachOther) {
      setSettings((prev) => ({ ...prev, impostorsKnowEachOther: false }));
    }
  }, [settings.impostorCount]);

  const handleAddPlayer = () => {
    const trimmed = playerNameInput.trim();
    if (!trimmed) return;

    if (players.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      setInputError('Já existe um jogador com esse nome.');
      return;
    }

    if (players.length >= 16) {
      setInputError('Limite máximo de 16 jogadores atingido.');
      return;
    }

    setPlayers((prev) => [...prev, trimmed]);
    setPlayerNameInput('');
    setInputError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPlayer();
    }
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddQuickPlayers = () => {
    const suggestions = ['Rafael', 'Camila', 'Thiago', 'Larissa', 'Bruno', 'Juliana'];
    const toAdd = suggestions.filter((s) => !players.includes(s)).slice(0, 4);
    if (toAdd.length > 0) {
      setPlayers((prev) => [...prev, ...toAdd]);
    }
  };

  const canStart = players.length >= 3;
  const usedStats = WordManager.getStats();

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 sm:py-6 flex flex-col gap-5 text-neutral-100">
      {/* Game Branding Hero Header */}
      <div className="text-center flex flex-col items-center">
        <div className="relative mb-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow-lg shadow-rose-950/60 border border-rose-400/30">
            <span className="text-2xl font-black text-white tracking-wider">?</span>
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          IMPOSTOR <span className="text-rose-500">SOCIAL</span>
        </h1>
        <p className="text-xs text-neutral-400 mt-1 max-w-xs">
          Descubra quem está mentindo secretamente antes que a rodada termine.
        </p>
      </div>

      {/* Card 1: Jogadores */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-500" />
            <h2 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
              Jogadores ({players.length})
            </h2>
          </div>
          <span
            className={`text-[11px] font-medium ${
              players.length < 3 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {players.length < 3 ? 'Mínimo de 3 jogadores' : 'Pronto para jogar'}
          </span>
        </div>

        {/* Campo de Input + Botão '+' */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={playerNameInput}
              onChange={(e) => {
                setPlayerNameInput(e.target.value);
                if (inputError) setInputError(null);
              }}
              onKeyDown={handleKeyDown}
              maxLength={18}
              placeholder="Digite o nome do jogador..."
              className="w-full bg-neutral-950/90 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
            />
          </div>
          <button
            onClick={handleAddPlayer}
            disabled={!playerNameInput.trim()}
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white font-bold flex items-center justify-center transition-all shadow-md shadow-rose-950/50 shrink-0"
            title="Adicionar jogador"
          >
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {inputError && (
          <p className="text-[11px] text-rose-400 px-1">{inputError}</p>
        )}

        {/* Lista Dinâmica com Apagar */}
        {players.length > 0 ? (
          <div className="mt-1 flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
            {players.map((name, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-neutral-950/60 border border-neutral-800/80 hover:border-neutral-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm group transition-all"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="w-5 h-5 rounded-full bg-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span className="font-medium text-neutral-200 truncate">{name}</span>
                </div>
                <button
                  onClick={() => handleRemovePlayer(index)}
                  className="text-neutral-500 hover:text-rose-400 active:scale-90 p-1 rounded-lg transition-colors"
                  title={`Remover ${name}`}
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-xs text-neutral-500">
            Nenhum jogador na sala. Adicione pelo menos 3 amigos!
          </div>
        )}

        {players.length < 3 && (
          <button
            onClick={handleAddQuickPlayers}
            className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors self-start underline underline-offset-2"
          >
            + Preencher com nomes de teste
          </button>
        )}
      </div>

      {/* Card 2: Regras & Configurações da Partida */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm flex flex-col gap-4">
        <h2 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
          Regras & Configuração da Sala
        </h2>

        {/* 2. Seletor de Quantidade de Impostores */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-300 font-medium">Quantidade de Impostores</span>
            <span className="text-[11px] text-neutral-400">
              {settings.impostorCount === 1 ? '1 mentiroso infiltrado' : '2 mentirosos na roda'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
            <button
              onClick={() => setSettings((s) => ({ ...s, impostorCount: 1 }))}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                settings.impostorCount === 1
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-950/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>1 Impostor</span>
            </button>
            <button
              onClick={() => setSettings((s) => ({ ...s, impostorCount: 2 }))}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                settings.impostorCount === 2
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-950/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>2 Impostores</span>
            </button>
          </div>
        </div>

        {/* 3. Toggle: Dar dica para o impostor? */}
        <div className="flex items-center justify-between py-2 border-t border-neutral-800/80">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-neutral-200">
              Dar dica para o impostor?
            </span>
            <span className="text-[11px] text-neutral-400">
              O impostor recebe uma pista sutil sobre o tema para ajudar no blefe
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
            <input
              type="checkbox"
              checked={settings.giveHintToImpostor}
              onChange={(e) =>
                setSettings((s) => ({ ...s, giveHintToImpostor: e.target.checked }))
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
          </label>
        </div>

        {/* 4. Toggle: Impostores se conhecem? (Só ativo com 2 impostores) */}
        <div
          className={`flex items-center justify-between py-2 border-t border-neutral-800/80 transition-opacity ${
            settings.impostorCount === 2 ? 'opacity-100' : 'opacity-40 cursor-not-allowed'
          }`}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-neutral-200">
                Impostores se conhecem?
              </span>
              {settings.impostorCount === 1 && (
                <span className="text-[10px] text-neutral-500 font-mono">
                  (Requer 2 impostores)
                </span>
              )}
            </div>
            <span className="text-[11px] text-neutral-400">
              Cada impostor verá o nome do seu parceiro na carta secreta
            </span>
          </div>

          <label
            className={`relative inline-flex items-center shrink-0 ml-3 ${
              settings.impostorCount === 2 ? 'cursor-pointer' : 'cursor-not-allowed pointer-events-none'
            }`}
          >
            <input
              type="checkbox"
              disabled={settings.impostorCount !== 2}
              checked={settings.impostorCount === 2 && settings.impostorsKnowEachOther}
              onChange={(e) =>
                setSettings((s) => ({ ...s, impostorsKnowEachOther: e.target.checked }))
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
          </label>
        </div>

        {/* 5. Seletor de Categoria ou Aleatório */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-neutral-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-300 font-medium">Categoria das Palavras</span>
            <span className="text-[11px] text-neutral-400 font-mono">
              {usedStats.available} palavras prontas
            </span>
          </div>

          <div className="relative">
            <select
              value={settings.categoryId}
              onChange={(e) => setSettings((s) => ({ ...s, categoryId: e.target.value }))}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 focus:outline-none focus:border-rose-500 cursor-pointer appearance-none"
            >
              <option value="all">🎲 Aleatório (Todas as Categorias)</option>
              {WORD_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.words.length} palavras)
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400">
              <Shuffle className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 6. Botão Chamativo 'Começar Jogo' */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={() => onStartGame(players, settings)}
          disabled={!canStart}
          className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-2xl ${
            canStart
              ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-950/80 active:scale-[0.98] cursor-pointer ring-1 ring-rose-400/30 animate-pulse'
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-60 shadow-none'
          }`}
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Começar Jogo</span>
        </button>

        {!canStart && (
          <p className="text-center text-[11px] text-amber-400/90 font-medium">
            Adicione pelo menos 3 jogadores para liberar o início da partida.
          </p>
        )}
      </div>

      {/* Footer Info & Quick Link to Word Storage Inspector */}
      {onOpenWordManager && (
        <div className="text-center pt-2">
          <button
            onClick={onOpenWordManager}
            className="text-[11px] text-neutral-400 hover:text-neutral-200 transition-colors inline-flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Gerenciar palavras & histórico permanente</span>
          </button>
        </div>
      )}
    </div>
  );
};
