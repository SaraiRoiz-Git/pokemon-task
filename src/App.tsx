import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { PokemonList } from './components/PokemonList';
import { PokemonDetails } from './components/PokemonDetails';
import { usePokemonList } from './hooks/usePokemonList';
import { PokemonFullData } from './types/pokemon';

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonFullData | null>(null);

  const {
    data: pokemonList,
    isLoading: loading,
    error: listError,
    refresh,
  } = usePokemonList();//get the pokemon list from the usePokemonList hook remove the logic of fetching the pokemon details from the API and just use the already loaded data

  const handleSelectPokemon = useCallback((url: string) => {//useCallback to prevent the function from being recreated on every render
    // Find Pokemon from already loaded data - no API call needed
    const pokemon = pokemonList?.find(p => p.url === url) || null;
    setSelectedPokemon(pokemon);
  }, [pokemonList]);

  const handleRefresh = useCallback(() => {//useCallback to prevent the function from being recreated on every render
    refresh();
    setSelectedPokemon(null);
  }, [refresh]);

  return (
    <AppContainer>
      <Header>🎮 Pokémon Dashboard</Header>
      <Dashboard>
        <PokemonList
          pokemon={pokemonList || []}
          loading={loading}
          error={listError ? listError.message : null}
          onSelect={handleSelectPokemon}
          onRefresh={handleRefresh}
          selectedPokemon={selectedPokemon}
        />
        <PokemonDetails
          pokemon={selectedPokemon}
          loading={false}
        />
      </Dashboard>
    </AppContainer>
  );
}

export default App; //move the export to the bottom of the file
const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const Header = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: 30px;
  font-size: 48px;
`;

const Dashboard = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;