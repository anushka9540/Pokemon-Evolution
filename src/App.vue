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
import { usePokemon } from './composables/usePokemon';
import PokemonCards from './components/PokemonCards.vue';
import loader from './assets/loader.gif';

const {
  pokemons,
  evolutionChain,
  selectedPokemon,
  loading,
  evolutionLoading,
  fetchEvolutions
} = usePokemon();
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
