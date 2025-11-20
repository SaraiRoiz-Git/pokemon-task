import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createMockPokemon,
  createMockPokemonDetails,
  createMockSpeciesData,
  mockFetch,
  mockAllPokemonReady,
  renderUsePokemonList,
  waitForError,
} from './helpers/pokemonTestUtils';

vi.mock('../useAllPokemon', () => ({
  useAllPokemon: vi.fn(),
}));

describe('usePokemonList - Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should handle fetch errors gracefully', async () => {
    mockAllPokemonReady([createMockPokemon(1, 'bulbasaur')]);
    mockFetch.mockResolvedValue({ ok: false, status: 500 });

    const { result } = renderUsePokemonList();
    await waitForError(result);

    expect(result.current.error).toBeDefined();
  });

  it('should handle network errors', async () => {
    mockAllPokemonReady([createMockPokemon(1, 'bulbasaur')]);
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderUsePokemonList();
    await waitForError(result);

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('should handle species fetch errors', async () => {
    mockAllPokemonReady([createMockPokemon(1, 'bulbasaur')]);

    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/pokemon/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(createMockPokemonDetails(1, 'bulbasaur', 'grass')),
        });
      }
      if (url.includes('/pokemon-species/')) {
        return Promise.resolve({ ok: false, status: 404 });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    const { result } = renderUsePokemonList();
    await waitForError(result);

    expect(result.current.error).toBeDefined();
  });

  it('should handle partial failure in batch (one Pokemon fails)', async () => {
    mockAllPokemonReady([
      createMockPokemon(1, 'bulbasaur'),
      createMockPokemon(2, 'ivysaur'),
    ]);

    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/pokemon/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(createMockPokemonDetails(1, 'bulbasaur', 'grass')),
        });
      }
      if (url.includes('/pokemon/2')) {
        return Promise.resolve({ ok: false, status: 404 });
      }
      if (url.includes('/pokemon-species/')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(createMockSpeciesData()) });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    const { result } = renderUsePokemonList();
    await waitForError(result);

    // Promise.all fails if any request fails
    expect(result.current.error).toBeDefined();
  });
});
