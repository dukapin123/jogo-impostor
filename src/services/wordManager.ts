import { ALL_WORDS, WORD_CATEGORIES } from '../data/wordPacks';
import { WordItem, WordManagerStats } from '../types/word';

const STORAGE_KEY = 'impostor_game_used_words_v1';

export class WordManager {
  private static getStoredUsedIds(): string[] {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return [];
      }
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string');
      }
      return [];
    } catch (err) {
      console.warn('Erro ao ler palavras usadas do localStorage:', err);
      return [];
    }
  }

  private static saveUsedIds(ids: string[]): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (err) {
      console.warn('Erro ao salvar palavras usadas no localStorage:', err);
    }
  }

  /**
   * Retorna um Set com os IDs de todas as palavras já sorteadas.
   */
  public static getUsedWordIds(): Set<string> {
    return new Set(this.getStoredUsedIds());
  }

  /**
   * Adiciona o ID de uma palavra à lista de usadas no localStorage.
   */
  public static markWordAsUsed(wordId: string): void {
    const current = this.getStoredUsedIds();
    if (!current.includes(wordId)) {
      current.push(wordId);
      this.saveUsedIds(current);
    }
  }

  /**
   * Remove uma palavra da lista de usadas (opcional, para ajustes manuais).
   */
  public static unmarkWord(wordId: string): void {
    const current = this.getStoredUsedIds().filter((id) => id !== wordId);
    this.saveUsedIds(current);
  }

  /**
   * Retorna a lista de palavras elegíveis para sorteio,
   * filtradas pelas categorias selecionadas e excluindo as já sorteadas.
   */
  public static getAvailableWords(categoryIds?: string[]): WordItem[] {
    const usedIds = this.getUsedWordIds();

    const pool = ALL_WORDS.filter((item) => {
      if (categoryIds && categoryIds.length > 0 && !categoryIds.includes(item.categoryId)) {
        return false;
      }
      return !usedIds.has(item.id);
    });

    return pool.map((item) => ({
      id: item.id,
      word: item.word,
      hint: item.hint,
      category: item.category,
    }));
  }

  /**
   * Sorteia uma palavra aleatória que NUNCA foi sorteada antes.
   * Se todas as palavras das categorias selecionadas já tiverem sido usadas,
   * pode resetar o histórico automaticamente se autoResetIfEmpty for true.
   */
  public static drawRandomWord(
    categoryIds?: string[],
    autoMarkUsed = true,
    autoResetIfEmpty = false
  ): {
    word: WordItem | null;
    remainingCount: number;
    totalEligible: number;
    wasReset: boolean;
  } {
    let available = this.getAvailableWords(categoryIds);
    let wasReset = false;

    // Se acabaram as palavras disponíveis para essas categorias
    if (available.length === 0) {
      if (autoResetIfEmpty) {
        this.resetHistory();
        wasReset = true;
        available = this.getAvailableWords(categoryIds);
      } else {
        return {
          word: null,
          remainingCount: 0,
          totalEligible: this.getTotalCountForCategories(categoryIds),
          wasReset: false,
        };
      }
    }

    if (available.length === 0) {
      return {
        word: null,
        remainingCount: 0,
        totalEligible: 0,
        wasReset,
      };
    }

    // Sorteio aleatório justo
    const randomIndex = Math.floor(Math.random() * available.length);
    const selected = available[randomIndex];

    if (autoMarkUsed) {
      this.markWordAsUsed(selected.id);
    }

    const remainingCount = available.length - 1;
    const totalEligible = this.getTotalCountForCategories(categoryIds);

    return {
      word: selected,
      remainingCount,
      totalEligible,
      wasReset,
    };
  }

  /**
   * Limpa todo o histórico de palavras usadas no localStorage.
   * Todas as palavras voltam a ficar disponíveis para sorteio.
   */
  public static resetHistory(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.warn('Erro ao resetar histórico:', err);
    }
  }

  /**
   * Retorna estatísticas detalhadas do banco de palavras.
   */
  public static getStats(categoryIds?: string[]): WordManagerStats {
    const usedIds = this.getUsedWordIds();

    const targetCategories = categoryIds && categoryIds.length > 0
      ? WORD_CATEGORIES.filter((c) => categoryIds.includes(c.id))
      : WORD_CATEGORIES;

    let total = 0;
    let used = 0;
    const byCategory: WordManagerStats['byCategory'] = {};

    targetCategories.forEach((cat) => {
      const catTotal = cat.words.length;
      const catUsed = cat.words.filter((w) => usedIds.has(w.id)).length;
      const catAvailable = catTotal - catUsed;

      byCategory[cat.name] = {
        total: catTotal,
        used: catUsed,
        available: catAvailable,
      };

      total += catTotal;
      used += catUsed;
    });

    return {
      total,
      used,
      available: total - used,
      byCategory,
    };
  }

  private static getTotalCountForCategories(categoryIds?: string[]): number {
    if (!categoryIds || categoryIds.length === 0) {
      return ALL_WORDS.length;
    }
    return ALL_WORDS.filter((w) => categoryIds.includes(w.categoryId)).length;
  }
}
