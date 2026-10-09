/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { GameSetupScreen } from './components/setup/GameSetupScreen';
import { SecretRevealScreen } from './components/reveal/SecretRevealScreen';
import { DebateScreen } from './components/debate/DebateScreen';
import { ResultScreen } from './components/result/ResultScreen';
import { WordManager } from './services/wordManager';
import { WORD_CATEGORIES, ALL_WORDS } from './data/wordPacks';
import { GameSettings, Player } from './types/game';
import { WordItem } from './types/word';
import {
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Eye,
  Database,
  Layers,
  Trash2,
  Play,
  Users,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'setup' | 'reveal' | 'debate' | 'result' | 'wordManager'>('setup');
  const [playerNames, setPlayerNames] = useState<string[]>([
    'Lucas',
    'Mariana',
    'Gabriel',
    'Beatriz',
  ]);
  const [gamePlayers, setGamePlayers] = useState<Player[]>([]);
  const [gameSecretWord, setGameSecretWord] = useState<WordItem | null>(null);
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    impostorCount: 1,
    giveHintToImpostor: false,
    impostorsKnowEachOther: false,
    categoryId: 'all',
  });
  const [usedIds, setUsedIds] = useState<string[]>([]);
  const [firstSpeakerIndex, setFirstSpeakerIndex] = useState(0);

  useEffect(() => {
    setUsedIds(Array.from(WordManager.getUsedWordIds()));
  }, [view]);

  // Função central para iniciar ou reiniciar uma rodada
  const startRoundWithPlayers = (names: string[], settings: GameSettings) => {
    // 1. Sorteia palavra inédita da memória permanente
    const categoryFilter = settings.categoryId === 'all' ? undefined : [settings.categoryId];
    const drawResult = WordManager.drawRandomWord(categoryFilter, true, true);

    if (!drawResult.word) {
      alert('Todas as palavras foram usadas! O histórico foi resetado automaticamente para permitir novos sorteios.');
      return;
    }

    const secretWord = drawResult.word;
    setGameSecretWord(secretWord);
    setGameSettings(settings);
    setPlayerNames(names);

    // 2. Sorteia impostores aleatoriamente
    const totalPlayers = names.length;
    const impostorIndices = new Set<number>();
    const actualImpostorCount = Math.min(settings.impostorCount, totalPlayers - 1);

    while (impostorIndices.size < actualImpostorCount) {
      const randIdx = Math.floor(Math.random() * totalPlayers);
      impostorIndices.add(randIdx);
    }

    const assignedPlayers: Player[] = names.map((name, index) => {
      const isImpostor = impostorIndices.has(index);
      return {
        id: `p_${index}_${Date.now()}`,
        name,
        isImpostor,
        word: isImpostor ? undefined : secretWord.word,
        hint: isImpostor && settings.giveHintToImpostor ? secretWord.hint : undefined,
      };
    });

    setGamePlayers(assignedPlayers);

    // 3. Sorteia quem começa falando com probabilidade enviesada:
    // 95% de chance de ser um Civil e 5% de chance de ser um Impostor
    const civilIndices = assignedPlayers
      .map((p, idx) => ({ isImpostor: p.isImpostor, idx }))
      .filter((p) => !p.isImpostor)
      .map((p) => p.idx);

    const impostorIndicesList = assignedPlayers
      .map((p, idx) => ({ isImpostor: p.isImpostor, idx }))
      .filter((p) => p.isImpostor)
      .map((p) => p.idx);

    let chosenSpeaker = 0;
    const roll = Math.random();

    if (roll < 0.95 && civilIndices.length > 0) {
      chosenSpeaker = civilIndices[Math.floor(Math.random() * civilIndices.length)];
    } else if (impostorIndicesList.length > 0) {
      chosenSpeaker = impostorIndicesList[Math.floor(Math.random() * impostorIndicesList.length)];
    } else if (civilIndices.length > 0) {
      chosenSpeaker = civilIndices[Math.floor(Math.random() * civilIndices.length)];
    }

    setFirstSpeakerIndex(chosenSpeaker);
    setView('reveal');
  };

  const handleStartGame = (names: string[], settings: GameSettings) => {
    startRoundWithPlayers(names, settings);
  };

  const handlePlayNewRound = () => {
    // Preserva jogadores e configurações, puxa nova palavra inédita e novos papéis
    startRoundWithPlayers(playerNames, gameSettings);
  };

  const handleAllRevealed = () => {
    setView('debate');
  };

  const handleRevealTruth = () => {
    setView('result');
  };

  const handleCancelGame = () => {
    if (confirm('Deseja voltar à tela inicial?')) {
      setView('setup');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Barra de Navegação Superior */}
      <nav className="border-b border-neutral-900 bg-neutral-950/90 backdrop-blur px-4 py-3 sticky top-0 z-30">
        <div className="max-w-md sm:max-w-2xl mx-auto flex items-center justify-between">
          {view !== 'setup' ? (
            <button
              onClick={handleCancelGame}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Início</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-neutral-300 tracking-wider uppercase">
                Impostor Social
              </span>
            </div>
          )}

          <div className="flex items-center gap-3">
            {view === 'setup' && (
              <button
                onClick={() => setView('wordManager')}
                className="text-xs text-neutral-400 hover:text-rose-400 transition-colors flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-neutral-900 cursor-pointer"
                title="Ver banco de palavras e histórico do localStorage"
              >
                <Database className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Memória de Palavras</span>
              </button>
            )}

            {view === 'wordManager' && (
              <button
                onClick={() => setView('setup')}
                className="text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Voltar ao Jogo</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Container Principal */}
      <main className="flex-1 flex flex-col justify-center items-center py-2 sm:py-6">
        {/* TELA 1: CONFIGURAÇÃO / SETUP */}
        {view === 'setup' && (
          <GameSetupScreen
            onStartGame={handleStartGame}
            onOpenWordManager={() => setView('wordManager')}
          />
        )}

        {/* TELA 2: REVELAÇÃO SECRETA "SEGURE PARA VER" */}
        {view === 'reveal' && gameSecretWord && (
          <SecretRevealScreen
            players={gamePlayers}
            secretWord={gameSecretWord}
            settings={gameSettings}
            onAllPlayersRevealed={handleAllRevealed}
            onCancelGame={handleCancelGame}
          />
        )}

        {/* TELA 3: RODA DE DEBATE (SEM CONTAGEM REGRESSIVA) */}
        {view === 'debate' && (
          <DebateScreen
            players={gamePlayers}
            firstSpeakerIndex={firstSpeakerIndex}
            onRevealTruth={handleRevealTruth}
            onCancelGame={handleCancelGame}
          />
        )}

        {/* TELA 4: A VERDADE REVELADA */}
        {view === 'result' && gameSecretWord && (
          <ResultScreen
            players={gamePlayers}
            secretWord={gameSecretWord}
            settings={gameSettings}
            onPlayNewRound={handlePlayNewRound}
            onBackToSetup={() => setView('setup')}
          />
        )}

        {/* TELA 5: GERENCIADOR DE PALAVRAS E HISTÓRICO LOCALSTORAGE */}
        {view === 'wordManager' && (
          <div className="w-full max-w-2xl mx-auto px-4 py-4 flex flex-col gap-5 text-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-rose-500" />
                  Gerenciador de Memória Permanente
                </h2>
                <p className="text-xs text-neutral-400">
                  Total de {ALL_WORDS.length} palavras cadastradas · {usedIds.length} salvas no localStorage
                </p>
              </div>

              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja resetar todo o histórico de palavras usadas?')) {
                    WordManager.resetHistory();
                    setUsedIds([]);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-rose-600/50 text-xs text-neutral-300 hover:text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Resetar Histórico</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {WORD_CATEGORIES.map((cat) => {
                const usedInCat = cat.words.filter((w) => usedIds.includes(w.id)).length;
                return (
                  <div
                    key={cat.id}
                    className="p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-white truncate">{cat.name}</h3>
                      <span className="text-[11px] font-mono text-neutral-400">
                        {cat.words.length - usedInCat} / {cat.words.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {cat.words.slice(0, 6).map((w) => {
                        const isUsed = usedIds.includes(w.id);
                        return (
                          <span
                            key={w.id}
                            className={`text-[10px] px-2 py-0.5 rounded ${
                              isUsed
                                ? 'bg-neutral-950 text-neutral-500 line-through'
                                : 'bg-neutral-800 text-neutral-300'
                            }`}
                          >
                            {w.word}
                          </span>
                        );
                      })}
                      {cat.words.length > 6 && (
                        <span className="text-[10px] text-neutral-500 px-1 py-0.5">
                          +{cat.words.length - 6} mais
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
