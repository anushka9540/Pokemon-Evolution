<template>
  <div class="container">
    <h1>Pokémon Evolution</h1>
    <div v-if="loading" class="loader">Loading Pokémon...</div>
    <PokemonCards v-else :pokemons="pokemons" @select="fetchEvolutions" :selectedPokemon="selectedPokemon" />

    <div v-if="evolutionChain.length" class="evolution-container">
      <h2>Evolution Chain of {{ selectedPokemon?.name }}</h2>
      <div v-if="evolutionLoading" class="loader">Loading Evolution...</div>
      <PokemonCards v-else :pokemons="evolutionChain" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PokemonCards from './components/PokemonCard.vue';

const pokemons = ref([]);
const evolutionChain = ref([]);
const selectedPokemon = ref(null);
const loading = ref(false);
const evolutionLoading = ref(false);
const apiCache = new Map();
const initialPokemonIds = [1, 4, 7];

const fetchCachedData = async (url) => {
  if (apiCache.has(url)) return apiCache.get(url);
  const response = await fetch(url);
  const data = await response.json();
  apiCache.set(url, data);
  return data;
};

const fetchPokemons = async () => {
  if (loading.value) return;
  loading.value = true;

  pokemons.value = await Promise.all(
    initialPokemonIds.map(async (id) => {
      const data = await fetchCachedData(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return {
        id: data.id,
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        types: data.types.map((t) => t.type.name)
      };
    })
  );

  loading.value = false;
};

const fetchEvolutions = async (pokemon) => {
  if (selectedPokemon.value?.id === pokemon.id || evolutionLoading.value) return;
  selectedPokemon.value = pokemon;
  evolutionLoading.value = true;

  try {
    
    const evolutionIds = [pokemon.id, pokemon.id + 1, pokemon.id + 2];

    evolutionChain.value = await Promise.all(
      evolutionIds.map(fetchCachedPokemonData)
    );
  } catch (error) {
    console.error('Error fetching evolution data:', error);
  } finally {
    evolutionLoading.value = false;
  }
};

const fetchCachedPokemonData = async (id) => {
  const data = await fetchCachedData(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return {
    id: data.id,
    name: data.name,
    image: data.sprites.other['official-artwork'].front_default,
    types: data.types.map((t) => t.type.name)
  };
};

onMounted(fetchPokemons);
</script>

<style scoped>
.container {
  text-align: center;
  font-family: Arial, sans-serif;
  padding: 10px;
}

.evolution-container {
  margin-top: 40px;
}

.loader {
  font-size: 1.2rem;
  font-weight: bold;
  color: #f8d030;
  margin: 20px 0;
}
</style>
