<template>
  <div class="planificar-menu">
    <header class="header-principal">
      <h1>Planificar Menú</h1>
    </header>

    <div class="seccion-necesidades">
      <h2 class="sub-header">¿Qué necesidades tienes?</h2>
      <div class="categorias-flex">
        <IconoSeleccion 
          v-for="tipo in ['ejercicio', 'concentracion', 'ahorrar']" 
          :key="tipo"
          :valor="tipo"
          :seleccionado="necesidadSeleccionada === tipo"
          @seleccionar="seleccionarNecesidad"
        />
      </div>

      <h2 class="sub-header">¿Qué quieres planificar?</h2>
      <div class="categorias-flex">
        <IconoSeleccion 
          v-for="momento in ['desayuno', 'comida', 'cena']" 
          :key="momento"
          :valor="momento"
          :seleccionado="momentosSeleccionados.has(momento)"
          @seleccionar="toggleMomento"
        />
      </div>

      <h2 class="sub-header">¿Qué recetas quieres priorizar?</h2>
      <div class="prioridad-flex">
        <BotonPrioridad 
          valor="propias"
          texto="Las mías"
          :seleccionado="prioridad === 'propias'"
          @seleccionar="prioridad = $event"
        />
        <BotonPrioridad 
          valor="nuevas"
          texto="Nuevas"
          :seleccionado="prioridad === 'nuevas'"
          @seleccionar="prioridad = $event"
        />
      </div>

      <h2 class="sub-header">¿Para qué días quieres planificar?</h2>
      <div class="calendario-pro-wrapper">
        <VCalendar 
          expanded 
          :attributes="attributes" 
          @dayclick="toggleDia" 
        />
      </div>

      <div class="footer-acciones">
        <button 
          @click="verRecetas" 
          class="btn-ver-recetas"
          :disabled="botonVerDisabled"
          :class="{ 'btn-disabled': botonVerDisabled }"
        >
          Ver recetas
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import IconoSeleccion from './IconoSeleccion.vue';
import BotonPrioridad from './BotonPrioridad.vue';

const emit = defineEmits(['ver-recetas']);

const necesidadSeleccionada = ref('ejercicio'); 
const momentosSeleccionados = ref(new Set());    
const prioridad = ref('propias');
const diasSeleccionados = ref([]); 

const seleccionarNecesidad = (tipo) => {
  necesidadSeleccionada.value = tipo;
};

const toggleMomento = (momento) => {
  if (momentosSeleccionados.value.has(momento)) {
    momentosSeleccionados.value.delete(momento);
  } else {
    momentosSeleccionados.value.add(momento);
  }
};

const toggleDia = (day) => {
  const fechasActuales = [...diasSeleccionados.value];
  const index = fechasActuales.findIndex(d => d.getTime() === day.date.getTime());

  if (index >= 0) {
    fechasActuales.splice(index, 1);
  } else {
    fechasActuales.push(day.date);
  }
  
  diasSeleccionados.value = fechasActuales; 
};

const botonVerDisabled = computed(() => {
  const hayDias = diasSeleccionados.value.length > 0;
  return momentosSeleccionados.value.size === 0 || !hayDias;
});

const attributes = computed(() => [
  {
    highlight: { 
      color: 'gray', 
      contentClass: 'dia-seleccionado-custom' 
    },
    dates: diasSeleccionados.value, 
  },
]);

const verRecetas = () => {
  try {
    const fechasOrdenadas = [...diasSeleccionados.value].sort((a, b) => a - b);
    const fechasFormateadas = fechasOrdenadas.map(date => date.toLocaleDateString('es-ES'));

    emit('ver-recetas', { 
      necesidad: necesidadSeleccionada.value,
      momentos: Array.from(momentosSeleccionados.value),
      prioridad: prioridad.value,
      dias: fechasFormateadas
    });

  } catch (error) {
    console.error("Error al formatear las fechas:", error);
  }
};
</script>

<style scoped>
.planificar-menu {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-principal {
  width: 100%;
  text-align: left;
  margin-bottom: 50px;
  padding-left: 5%;
}

.header-principal h1 {
  font-size: 2.5rem;
  margin: 0;
}

.seccion-necesidades {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.sub-header {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 40px;
  text-align: center;
}

.categorias-flex {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 60px;
  flex-wrap: wrap;
}

.prioridad-flex {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 60px;
}

.calendario-pro-wrapper {
  width: 100%;
  max-width: 450px;
  margin-bottom: 50px;
  border: 2px solid black;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.footer-acciones {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.btn-ver-recetas {
  background-color: #000;
  color: white;
  padding: 15px 45px;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: transform 0.2s, background-color 0.2s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.btn-ver-recetas:hover:not(:disabled) {
  background-color: #333;
  transform: scale(1.05);
}

.btn-ver-recetas:active:not(:disabled) {
  transform: scale(0.95);
}

.btn-ver-recetas:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

@media (max-width: 768px) {
  .categorias-flex {
    gap: 15px; 
  }
  .prioridad-flex {
    gap: 10px;
    flex-wrap: wrap;
  }
}

</style>