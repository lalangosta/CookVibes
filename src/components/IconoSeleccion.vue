<template>
  <div class="categoria-wrapper">
    <div 
      class="icono-principal" 
      :class="{ 'is-selected': seleccionado }"
      @click="$emit('seleccionar', valor)"
    >
      <img :src="obtenerRutaImagen(valor)" :alt="valor">
      <span>{{ valor }}</span>
    </div>
  </div>
</template>

<script setup>
// Registramos las variables que este componente hijo va a recibir desde el padre para poder pintar los datos
defineProps({
  valor: {
    type: String,
    required: true
  },
  seleccionado: {
    type: Boolean,
    required: true,
    default: false
  }
});

defineEmits(['seleccionar']);

const obtenerRutaImagen = (nombre) => {
  return new URL(`../assets/${nombre}.png`, import.meta.url).href;
};
</script>

<style scoped>
.categoria-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
}

.icono-principal {
  width: 110px;
  height: 110px;
  border: 2px solid black;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: white;
  transition: all 0.2s ease;
  padding: 10px; 
  box-sizing: border-box;
}

.icono-principal:active {
  transform: scale(0.95);
}

.icono-principal:hover {
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.icono-principal img {
  width: 40px;
  margin-bottom: 5px;
}

.icono-principal span {
  font-size: 0.85rem;
  font-weight: bold;
  text-align: center;
  word-wrap: break-word; 
  width: 100%;
  line-height: 1.1;
}

.icono-principal.is-selected {
  background-color: black !important;
  color: white !important;
}

/* Con este filtro invertimos los colores del icono (de negro a blanco) cuando la burbuja pasa a estar activa */
.icono-principal.is-selected img {
  filter: brightness(0) invert(1);
}

@media (max-width: 768px) {
  .categoria-wrapper {
    width: 90px;
  }
  .icono-principal {
    width: 95px;  
    height: 95px;
    padding: 8px;
  }
  .icono-principal img {
    width: 30px; 
  }
  .icono-principal span {
    font-size: 0.7rem; 
  }
}
</style>