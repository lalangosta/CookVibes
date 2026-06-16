<script setup>
import { ref } from 'vue'
import HomeView from './components/HomeView.vue'
import RecetaRapidaView from './components/RecetaRapidaView.vue'
import LowEffortView from './components/LowEffortView.vue'
import PlanificarMenuView from './components/PlanificarMenuView.vue'
import ModoConcentracionView from './components/ModoConcentracionView.vue'
import LibroRecetasView from './components/LibroRecetasView.vue'

// Usamos un String reactivo para saber qué componente pintar
const pantallaActual = ref('home')
// Usamos un array como pila para guardar el orden de las pantallas y poder volver atrás
const historial = ref(['home'])

const datosPlanificacion = ref(null)

const recetaSeleccionada = ref(null)
const modoLibro = ref('detalle') 
const planCompletoFinal = ref([])

const contextoParaLibro = ref([])
const momentoParaLibro = ref('')

// Para cambiar de pantalla, metemos el nuevo nombre en el String y lo sumamos al historial
const irAPantalla = (nombre) => {
  pantallaActual.value = nombre
  historial.value.push(nombre)
}

// Sacamos el último elemento del array para regresar a la pantalla inmediatamente anterior
const volverAtras = () => {
  if (historial.value.length > 1) {
    historial.value.pop() 
    pantallaActual.value = historial.value[historial.value.length - 1] 
  }
}

// Vaciamos el historial y lo reiniciamos para evitar acumulaciones raras al ir a inicio
const irAHome = () => {
  pantallaActual.value = 'home'
  historial.value = ['home']
}

const irAConcentracionConDatos = (datosRecibidos) => {
  datosPlanificacion.value = datosRecibidos 
  irAPantalla('modo-concentracion')         
}

// Función para recibir las tarjetas y el momento del dia
const abrirLibroDetalle = (datosEmitidos) => {
  if (datosEmitidos && datosEmitidos.tarjetas) {
    // Si el evento viene con el formato de ModoConcentracion
    recetaSeleccionada.value = datosEmitidos.receta;
    contextoParaLibro.value = datosEmitidos.tarjetas;
    momentoParaLibro.value = datosEmitidos.momento;
  } else {
    // Si viene solo la receta pelada de otro sitio
    recetaSeleccionada.value = datosEmitidos;
    contextoParaLibro.value = [];
    momentoParaLibro.value = '';
  }
  
  modoLibro.value = 'detalle';
  irAPantalla('libro-recetas');
};

const abrirLibroRevision = (planCompleto) => {
  planCompletoFinal.value = planCompleto;
  modoLibro.value = 'revision';
  irAPantalla('libro-recetas');
};
</script>

<template>
  <div id="app-container">
    <nav v-if="pantallaActual !== 'home'" class="navbar-global">
      <div class="nav-left">
        <button @click="volverAtras" class="nav-btn">
          <i class="fas fa-arrow-left"></i> 
          <span>←</span>
        </button>
        <button @click="irAHome" class="nav-btn">
          <img src="./assets/home.png" alt="Home" class="nav-icon">
        </button>
      </div>
      <div class="nav-right">
        <button class="nav-btn profile-btn">
          <img src="./assets/user.png" alt="Usuario" class="nav-icon">
        </button>
      </div>
    </nav>

    <HomeView 
      v-if="pantallaActual === 'home'" 
      @irRecetaRapida="irAPantalla('receta-rapida')" 
      @irPlanificarMenu="irAPantalla('planificar-menu')" 
    />
    
    <RecetaRapidaView 
      v-if="pantallaActual === 'receta-rapida'" 
      @volver="volverAtras"
      @ver-receta="irAPantalla('low-effort')" 
    />

    <LowEffortView v-if="pantallaActual === 'low-effort'" />

    <PlanificarMenuView 
      v-if="pantallaActual === 'planificar-menu'" 
      @volver="volverAtras" 
      @ver-recetas="irAConcentracionConDatos" 
    />

    <ModoConcentracionView 
      v-show="pantallaActual === 'modo-concentracion'" 
      :datos="datosPlanificacion"
      @ver-detalle="abrirLibroDetalle"
      @finalizar-plan="abrirLibroRevision"
    />

    <LibroRecetasView 
      v-if="pantallaActual === 'libro-recetas'" 
      :receta="recetaSeleccionada"
      :modo="modoLibro" 
      :plan-completo="planCompletoFinal"
      :datos-config="datosPlanificacion"
      :contexto-detalle="contextoParaLibro"
      :momento-detalle="momentoParaLibro"
    />

  </div>
</template>

<style>
body {
  margin: 0;
  font-family: sans-serif;
  background-color: #fdf6e9; 
}

.navbar-global {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #fdf6e9;
}

.nav-left {
  display: flex;
  gap: 15px;
}

.nav-btn {
  background: black;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
}

.nav-icon {
  width: 24px;  
  height: 24px;
  object-fit: contain;
  display: block;
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>