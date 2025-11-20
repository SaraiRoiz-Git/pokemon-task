import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useAllPokemon } from '../../useAllPokemon';

// =============================================================================
// Constants
// =============================================================================
export const API_BASE_URL = 'https://pokeapi.co/api/v2';
export const POKEMON_URL = (id: number) => `${API_BASE_URL}/pokemon/${id}/`;
export const SPECIES_URL = (id: number) => `${API_BASE_URL}/pokemon-species/${id}/`;

// =============================================================================
// Mock Data Factories
// =============================================================================
export const createMockPokemon = (id: number, name: string) => ({
  name,
  url: POKEMON_URL(id),
});

export const createMockPokemonDetails = (id: number, name: string, type: string) => ({
  id,
  name,
  sprites: { front_default: `${name}.png` },
  types: [{ type: { name: type } }],
  stats: [{ base_stat: 45, stat: { name: 'hp' } }],
  abilities: [{ ability: { name: 'ability' } }],
  height: 7,
  weight: 69,
  species: { url: SPECIES_URL(id) },
});

export const createMockSpeciesData = (description: string = 'A Pokemon') => ({
  flavor_text_entries: [
    { flavor_text: description, language: { name: 'en' } },
  ],
});

// =============================================================================
// Test Setup
// =============================================================================
export const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

export const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// =============================================================================
// Mock Helpers
// =============================================================================
type MockPokemon = { name: string; url: string };

export const mockAllPokemonLoading = () => {
  vi.mocked(useAllPokemon).mockReturnValue({
    data: undefined,
    isLoading: true,
    error: null,
  } as ReturnType<typeof useAllPokemon>);
};

export const mockAllPokemonReady = (pokemonList: MockPokemon[]) => {
  vi.mocked(useAllPokemon).mockReturnValue({
    data: pokemonList,
    isLoading: false,
    error: null,
  } as ReturnType<typeof useAllPokemon>);
};

export const mockMultiplePokemonFetch = (pokemonMap: Record<number, { name: string; type: string }>) => {
  mockFetch.mockImplementation((url: string) => {
    for (const [id, { name, type }] of Object.entries(pokemonMap)) {
      if (url.includes(`/pokemon/${id}`)) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(createMockPokemonDetails(Number(id), name, type)),
        });
      }
    }
    if (url.includes('/pokemon-species/')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(createMockSpeciesData()),
      });
    }
    return Promise.reject(new Error('Unknown URL'));
  });
};

// =============================================================================
// Render Helpers
// =============================================================================
import { renderHook } from '@testing-library/react';
import { usePokemonList } from '../../usePokemonList';

export const renderUsePokemonList = () => {
  return renderHook(() => usePokemonList(), {
    wrapper: createWrapper(),
  });
};

// =============================================================================
// Wait Helpers
// =============================================================================
import { waitFor } from '@testing-library/react';
import { expect } from 'vitest';

export const waitForLoadingComplete = async (result: { current: { isLoading: boolean } }) => {
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });
};

export const waitForError = async (result: { current: { isError: boolean } }) => {
  await waitFor(() => {
    expect(result.current.isError).toBe(true);
  });
};
