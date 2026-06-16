<template>
  <button 
    @click="$emit('seleccionar', valor)" 
    class="btn" 
    :class="seleccionado ? 'btn-black' : 'btn-white'"
  >
    {{ texto }}
  </button>
</template>

<script setup>
defineProps({
  valor: {
    type: String,
    required: true
  },
  texto: {
    type: String,
    required: true
  },
  seleccionado: {
    type: Boolean,
    required: true
  }
});

defineEmits(['seleccionar']);
</script>

<style scoped>
.btn {
  padding: 10px 30px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  border: 2px solid black;
  transition: all 0.2s;
}

.btn-black {
  background-color: black;
  color: white;
}

.btn-white {
  background-color: white;
  color: black;
}

.btn:hover {
  transform: scale(1.05);
}
</style>