import { ref, onMounted } from 'vue';

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';
const initialPokemonIds = [1, 4, 7];

export function usePokemon() {
  const pokemons = ref([]);
  const evolutionChain = ref([]);
  const selectedPokemon = ref(null);
  const loading = ref(true);
  const evolutionLoading = ref(false);

  const fetchPokemonData = async (id) => {
    const response = await fetch(`${BASE_URL}${id}`);
    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      image: data.sprites.other['official-artwork'].front_default,
      types: data.types.map((t) => t.type.name),
    };
  };

  const fetchPokemons = async () => {
    loading.value = true;
    pokemons.value = await Promise.all(initialPokemonIds.map(fetchPokemonData));
    loading.value = false;
  };

  const fetchEvolutions = async (pokemon) => {
    if (selectedPokemon.value?.id === pokemon.id || evolutionLoading.value) return;
    selectedPokemon.value = pokemon;
    evolutionLoading.value = true;
    evolutionChain.value = [];

    try {
      const evolutionIds = [pokemon.id + 1, pokemon.id + 2];
      evolutionChain.value = await Promise.all(evolutionIds.map(fetchPokemonData));
    } catch (error) {
      console.error('Error fetching evolution data:', error);
    } finally {
      evolutionLoading.value = false;
    }
  };

  onMounted(fetchPokemons);

  return {
    pokemons,
    evolutionChain,
    selectedPokemon,
    loading,
    evolutionLoading,
    fetchEvolutions,
  };
}
