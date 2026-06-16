<template>
  <div class="tarjeta">
    <p class="dia-texto">{{ dia }}</p>
    
    <div 
      class="tarjeta-box" 
      v-if="receta"
      :class="{
        'trastos-pocos': receta.trastos === 'pocos',
        'trastos-medios': receta.trastos === 'medios',
        'trastos-muchos': receta.trastos === 'muchos'
      }"
    >
      
      <div class="btn-guardar" @click="$emit('fijar')">
        <img 
          :src="fijada ? imgChinchetaNegra : imgChincheta" 
          alt="Pin" 
          class="icono-accion"
          title= "Fijar receta para este día"
        >
      </div>

      <div class="btn-marcapagina" @click="$emit('guardar', receta)">
        <img 
          :src="receta.guardada ? imgMarcapaginaNegro : imgMarcapagina" 
          alt="Marcapáginas" 
          class="icono-accion"
          :title= "receta.guardada ? 'Quitar de mis recetas' : 'Guardar en mis recetas'"
        >
      </div>
      
      <div class="img-receta-container">
        <img :src="obtenerRutaImagen(receta.imagen)" :alt="receta.nombre" class="img-comida">
      </div>

      <div class="info-receta">
        <h3>{{ receta.nombre }}</h3>
        <p>{{ receta.descripcion }}</p>
        <div class="ver-mas-container">
          <span class="btn-ver-mas" @click="$emit('ver-detalle', receta)">Ver más ➔</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import imgChincheta from '../assets/chincheta.png';
import imgChinchetaNegra from '../assets/chincheta_negra.png';
import imgMarcapagina from '../assets/marcapagina.png';
import imgMarcapaginaNegro from '../assets/marcapagina_negro.png';

defineProps({
  dia: { type: String, required: true },
  receta: { type: Object, required: false, default: null },
  fijada: { type: Boolean, required: true, default: false }
});

defineEmits(['fijar', 'ver-detalle', 'guardar']);

const obtenerRutaImagen = (nombreArchivo) => {
  return new URL(`../assets/${nombreArchivo}`, import.meta.url).href;
};
</script>

<style scoped>
.tarjeta {
  flex: 0 0 280px; 
  display: flex;
  flex-direction: column;
}

.dia-texto {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #1a1a1a;
}

.tarjeta-box {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: background-color 0.3s ease;
}

.trastos-pocos { background-color: #e2f0d9 !important; }
.trastos-medios { background-color: #fff3cd !important; }
.trastos-muchos { background-color: #fce4e4 !important; }

/* Contenedor base para los botones superiores */
.btn-guardar,
.btn-marcapagina {
  position: absolute;
  top: 0;
  background: white;
  padding: 8px 10px 12px 10px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;

  transition: transform 0.2s;
}

.btn-guardar:hover,
.btn-marcapagina:hover {
  transform: scale(1.1);
}

.btn-guardar {
  left: 15px;
}

.btn-marcapagina {
  right: 15px; 
}

.icono-accion {
  width: 25px; 
  height: auto;
}

.img-receta-container {
  background-color: rgba(0, 0, 0, 0.05); 
  height: 180px;
  width: 100%;
  overflow: hidden;
}

.img-comida {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.info-receta {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1; 
}

.info-receta h3 {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  color: #1a1a1a;
}

.info-receta p {
  color: #444; 
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 20px;
}

.ver-mas-container { margin-top: auto; }
.btn-ver-mas {
  font-weight: bold;
  font-size: 0.9rem;
  text-decoration: underline;
  cursor: pointer;
  color: #1a1a1a;
}
</style>