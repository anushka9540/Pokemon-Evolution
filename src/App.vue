<template>
  <div class="container">
    <h1>Pokémon Evolution</h1>
  
    <div v-if="loading" class="loader">
      <img :src="loader" alt="Loading..." />
    </div>
  
    <PokemonCards v-else :pokemons="pokemons" @select="fetchEvolutions" :selectedPokemon="selectedPokemon" />
  
    <div class="evolution-container">
      <h2 v-if="selectedPokemon">
        Evolution Chain of {{ selectedPokemon.name }}
      </h2>
  
      <div v-if="evolutionLoading" class="loader">
        <img :src="loader" alt="Loading..." />
      </div>
  
      <PokemonCards v-else :pokemons="evolutionChain" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PokemonCards from './components/PokemonCards.vue';
import loader from './assets/loader.gif';

const pokemons = ref([]);
const evolutionChain = ref([]);
const selectedPokemon = ref(null);
const loading = ref(true);
const evolutionLoading = ref(false);
const initialPokemonIds = [1, 4, 7];

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

const fetchPokemonData = async (id) => {
  const response = await fetch(`${BASE_URL}${id}`);
  const data = await response.json();
  return {
    id: data.id,
    name: data.name,
    image: data.sprites.other['official-artwork'].front_default,
    types: data.types.map((t) => t.type.name)
  };
};

const fetchPokemons = async () => {
  loading.value = true;
  pokemons.value = await Promise.all(initialPokemonIds.map(fetchPokemonData));
  loading.value = false;
};

const fetchEvolutions = async (pokemon) => {
  if (selectedPokemon.value?.id === pokemon.id || evolutionLoading.value)
    return;
  selectedPokemon.value = pokemon;
  evolutionLoading.value = true;
  evolutionChain.value = [];

  try {
    const evolutionIds = [pokemon.id + 1, pokemon.id + 2];
    evolutionChain.value = await Promise.all(
      evolutionIds.map(fetchPokemonData)
    );
  } catch (error) {
    console.error('Error fetching evolution data:', error);
  } finally {
    evolutionLoading.value = false;
  }
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
  margin: 20px 0;
}

.loader img {
  width: 50px;
  height: 50px;
}
</style>
