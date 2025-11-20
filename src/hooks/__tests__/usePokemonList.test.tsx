import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import {
  createMockPokemon,
  createMockPokemonDetails,
  createMockSpeciesData,
  mockFetch,
  mockAllPokemonLoading,
  mockAllPokemonReady,
  mockMultiplePokemonFetch,
  renderUsePokemonList,
  waitForLoadingComplete,
} from './helpers/pokemonTestUtils';

vi.mock('../useAllPokemon', () => ({
  useAllPokemon: vi.fn(),
}));

describe('usePokemonList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Query Dependencies', () => {
    it('should not fetch until allPokemon data is available', async () => {
      mockAllPokemonLoading();

      const { result } = renderUsePokemonList();

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('Parallel Fetching', () => {
    it('should fetch Pokemon details in parallel when allPokemon is available', async () => {
      const pokemonList = [
        createMockPokemon(1, 'bulbasaur'),
        createMockPokemon(4, 'charmander'),
      ];
      mockAllPokemonReady(pokemonList);
      mockMultiplePokemonFetch({
        1: { name: 'bulbasaur', type: 'grass' },
        4: { name: 'charmander', type: 'fire' },
      });

      const { result } = renderUsePokemonList();
      await waitForLoadingComplete(result);

      // 2 Pokemon details + 2 species = 4 total fetches
      expect(mockFetch).toHaveBeenCalledTimes(4);
    });

    it('should fetch all Pokemon in parallel, not sequentially', async () => {
      const pokemonList = [
        createMockPokemon(1, 'bulbasaur'),
        createMockPokemon(4, 'charmander'),
        createMockPokemon(7, 'squirtle'),
        createMockPokemon(25, 'pikachu'),
        createMockPokemon(39, 'jigglypuff'),
      ];
      mockAllPokemonReady(pokemonList);

      const fetchStartTimes: number[] = [];
      const SIMULATED_DELAY = 50;

      mockFetch.mockImplementation((url: string) => {
        fetchStartTimes.push(Date.now());

        return new Promise((resolve) => {
          setTimeout(() => {
            if (url.includes('/pokemon/')) {
              resolve({
                ok: true,
                json: () => Promise.resolve(createMockPokemonDetails(1, 'pokemon', 'normal')),
              });
            } else if (url.includes('/pokemon-species/')) {
              resolve({
                ok: true,
                json: () => Promise.resolve(createMockSpeciesData()),
              });
            }
          }, SIMULATED_DELAY);
        });
      });

      const startTime = Date.now();
      const { result } = renderUsePokemonList();
      await waitForLoadingComplete(result);
      const totalTime = Date.now() - startTime;

      // Parallel execution should complete in ~100ms, not 500ms
      expect(totalTime).toBeLessThan(300);

      // All fetches should start within 50ms of each other
      if (fetchStartTimes.length >= 2) {
        const firstFetch = Math.min(...fetchStartTimes);
        const lastFetchStart = Math.max(...fetchStartTimes.slice(0, 5));
        expect(lastFetchStart - firstFetch).toBeLessThan(50);
      }
    });
  });

  describe('Caching and Refresh', () => {
    it('should provide refresh function that invalidates cache', async () => {
      mockAllPokemonReady([createMockPokemon(25, 'pikachu')]);
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createMockPokemonDetails(25, 'pikachu', 'electric')),
      });

      const { result } = renderUsePokemonList();
      await waitForLoadingComplete(result);

      const initialCallCount = mockFetch.mock.calls.length;
      result.current.refresh();

      await waitFor(() => {
        expect(mockFetch.mock.calls.length).toBeGreaterThan(initialCallCount);
      });
    });
  });

  describe('Loading State', () => {
    it('should return loading state while fetching', async () => {
      mockAllPokemonReady([createMockPokemon(1, 'bulbasaur')]);

      mockFetch.mockImplementation((url: string) =>
        new Promise(resolve =>
          setTimeout(() => {
            if (url.includes('/pokemon/1')) {
              resolve({
                ok: true,
                json: () => Promise.resolve(createMockPokemonDetails(1, 'bulbasaur', 'grass')),
              });
            } else if (url.includes('/pokemon-species/')) {
              resolve({
                ok: true,
                json: () => Promise.resolve(createMockSpeciesData()),
              });
            }
          }, 100)
        )
      );

      const { result } = renderUsePokemonList();

      expect(result.current.isLoading).toBe(true);
      await waitForLoadingComplete(result);
    });
  });
});
