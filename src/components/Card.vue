<template>
    <div class="card" :class="{ selected: isSelected }">
      <slot name="title"></slot>
      <slot name="content"></slot>
      <slot name="footer"></slot>
    </div>
</template>

<script setup>
defineProps({
    isSelected: Boolean
});
</script>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 200px;
    padding: 15px;
    border-radius: 10px;
    background: white;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
    border: 1px solid #ddd;
    text-align: center;
    font-family: Arial, sans-serif;
    transition: 0.3s;
    cursor: pointer;
}

.card.selected {
    background: #f8d030; 
    transform: scale(1.05);
}
</style>