import { useState } from 'react';
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
  } = usePokemonList(); //get the pokemon list from the usePokemonList hook

  const handleSelectPokemon = (url: string) => {//instad of calling the API to get the pokemon details, we can just find the pokemon from the already loaded data
    // Find Pokemon from already loaded data - no API call needed
    const pokemon = pokemonList?.find(p => p.url === url) || null;
    setSelectedPokemon(pokemon);
  };

  const handleRefresh = () => {
    refresh();
    setSelectedPokemon(null);
  };

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
          error={null}
          onRetry={() => { }}
        />
      </Dashboard>
    </AppContainer>
  );
}

export default App;
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