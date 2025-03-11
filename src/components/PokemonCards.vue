<template>
  <div class="pokemon-list">
    <Card v-for="pokemon in pokemons" :key="pokemon.id" :isSelected="selectedPokemon?.id === pokemon.id"
      @click="$emit('select', pokemon)">
      <template #title>
        <div class="pokemon-name">
          {{ pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) }}
          <span class="pokemon-id">#{{ pokemon.id }}</span>
        </div>
      </template>
      <template #content>
        <img :src="pokemon.image" :alt="pokemon.name" class="pokemon-image" />
      </template>
      <template #footer>
        <div class="pokemon-types">
          <span v-for="type in pokemon.types" :key="type" class="type">{{ type }}</span>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from "./Card.vue";

defineProps({
  pokemons: Array,
  selectedPokemon: Object
});
</script>

<style scoped>
.pokemon-list {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.pokemon-name {
  font-weight: bold;
  font-size: 1.2rem;
  text-transform: capitalize;
}

.pokemon-id {
  font-size: 0.9rem;
  color: gray;
}

.pokemon-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin: 10px 0;
}

.pokemon-types {
  font-size: 1rem;
  font-weight: bold;
  text-transform: capitalize;
  display: flex;
  flex-direction: column;
}

.type {
  background: #e8f6a2;
  padding: 5px;
  margin: 2px;
  border-radius: 5px;
  width: 80px;
}
</style>