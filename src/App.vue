<template>
  <div class="container">
    <h1>Pokémon Evolution</h1>
    <PokemonCards :pokemons="pokemons" @select="fetchEvolutions" :selectedPokemon="selectedPokemon" />
  
    <div v-if="evolutionChain.length" class="evolution-container">
      <h2>Evolution Chain of {{ selectedPokemon?.name }}</h2>
      <PokemonCards :pokemons="evolutionChain" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PokemonCards from './components/PokemonCard.vue';

const pokemons = ref([]);
const evolutionChain = ref([]);
const selectedPokemon = ref(null);

const fetchPokemons = async () => {
  const urls = [
    'https://pokeapi.co/api/v2/pokemon/1',
    'https://pokeapi.co/api/v2/pokemon/4',
    'https://pokeapi.co/api/v2/pokemon/7'
  ];

  const responses = await Promise.all(
    urls.map((url) => fetch(url).then((res) => res.json()))
  );
  pokemons.value = responses.map((res) => ({
    id: res.id,
    name: res.name,
    image: res.sprites.other['official-artwork'].front_default,
    types: res.types.map((t) => t.type.name),
    speciesId: res.species.url.split('/').slice(-2, -1)[0]
  }));
};

const fetchEvolutions = async (pokemon) => {
  evolutionChain.value = [];
  selectedPokemon.value = pokemon;

  try {
    const speciesRes = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`
    );
    const speciesData = await speciesRes.json();

    const evolutionRes = await fetch(speciesData.evolution_chain.url);
    const evolutionData = await evolutionRes.json();

    let chain = evolutionData.chain;
    let evoList = [];

    while (chain) {
      evoList.push(chain.species.url.split('/').slice(-2, -1)[0]);
      chain = chain.evolves_to.length ? chain.evolves_to[0] : null;
    }

    const evoData = await Promise.all(
      evoList.map(async (id) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await res.json();
        return {
          id: data.id,
          name: data.name,
          image: data.sprites.other['official-artwork'].front_default,
          types: data.types.map((t) => t.type.name)
        };
      })
    );

    evolutionChain.value = evoData;
  } catch (error) {
    console.error('Error fetching evolution data:', error);
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
</style>
