<template>
  <div class="libro-view-container">
    
    <header class="header-contexto" v-if="listaActiva.length > 0">
      <div class="navegacion-flechas">
        <button @click="anteriorReceta" :disabled="indiceActual === 0" class="btn-flecha">⬅</button>
        
        <div class="info-meta">
          <!-- Si venimos de la vista detalle no tenemos el día guardado, así que lo ocultamos para que no quede raro -->
          <span class="txt-dia" v-if="itemActual.dia">{{ itemActual.dia }}</span>
          <span class="txt-separador" v-if="itemActual.dia && itemActual.momento">|</span>
          <span class="txt-momento" v-if="itemActual.momento">{{ itemActual.momento.toUpperCase() }}</span>
        </div>

        <button @click="siguienteReceta" :disabled="indiceActual === listaActiva.length - 1" class="btn-flecha">➡</button>
      </div>
    </header>

    <header class="receta-header" v-if="itemActual.receta">
      <div class="header-content">
        <h1>{{ itemActual.receta.nombre }}</h1>
        <div class="iconos-header">
          <img 
            :src="obtenerIconoOlla(itemActual.receta.trastos)" 
            alt="Icono Trastos" 
            title="Trastos necesarios para la receta"
          >
          <img 
            src="../assets/ingredientes_verde.png" 
            alt="Icono Ingredientes" 
            title="Complejidad de los ingredientes"
          >
        </div>
      </div>
    </header>

    <div class="papel-wrapper" v-if="itemActual.receta">
      <img src="../assets/libro.png" alt="Papel" class="papel-img">
      
      <img 
        :src="itemActual.receta.guardada ? iconMarcapaginaNegro : iconMarcapagina" 
        alt="Guardar receta" 
        class="marcapagina-icono"
        @click="toggleGuardar"
        :title="itemActual.receta.guardada ? 'Eliminar de mis recetas' : 'Guardar en mis recetas'"
      >
      
      <div class="papel-contenido">
        
        <div class="columna izquierda">
          <h2 class="subtitulo-seccion">Ingredientes</h2>
          <ul class="lista-ingredientes">
            <template v-if="itemActual.receta.ingredientes">
              <li v-for="(ingrediente, index) in itemActual.receta.ingredientes" :key="index">{{ ingrediente }}</li>
            </template>
            <template v-else>
              <li>350g de tomate frito</li>
              <li>300g de calabacín</li>
              <li>550g de berenjena</li>
              <li>600g de tomate</li>
              <li>2 cebollas y 5 ajos</li>
              <li>Aceite, sal y especias</li>
            </template>
          </ul>
        </div>

        <div class="columna derecha">
          <h2 class="subtitulo-seccion">Pasos</h2>
          <ol class="lista-pasos">
            <template v-if="itemActual.receta.pasos">
              <li v-for="(paso, index) in itemActual.receta.pasos" :key="index">{{ paso }}</li>
            </template>
            <template v-else>
              <li>Lavar y cortar las verduras en rodajas finas del mismo grosor.</li>
              <li>Preparar el sofrito con ajo, cebolla y el tomate frito en la base.</li>
              <li>Colocar las verduras intercaladas formando una espiral.</li>
              <li>Sazonar con sal, pimienta, romero y un chorro de aceite.</li>
              <li>Hornear a 180ºC durante 40-50 minutos hasta que estén tiernas.</li>
            </template>
          </ol>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

import iconOllasVerde from '../assets/ollas_verde.png';
import iconOllasAmarillo from '../assets/ollas_amarillo.png';
import iconMarcapagina from '../assets/marcapagina.png';
import iconMarcapaginaNegro from '../assets/marcapagina_negro.png';

const props = defineProps({
  receta: Object,        
  modo: String,          
  planCompleto: Array,    
  datosConfig: Object,
  contextoDetalle: {
    type: Array,
    default: () => []
  },
  momentoDetalle: {
    type: String,
    default: ''
  }
});

const indiceActual = ref(0);

const obtenerIconoOlla = (trastos) => {
  if (trastos === 'pocos') return iconOllasVerde;
  if (trastos === 'medios') return iconOllasAmarillo;
  return new URL('../assets/ollas_rojo.png', import.meta.url).href; 
};

// Controlamos el orden cuando termina la planificación y pasamos a modo revisión
const listaCronologica = computed(() => {
  if (props.modo !== 'revision') return [];

  const ordenMomentos = { desayuno: 1, comida: 2, cena: 3 };
  let lista = [];

  const diasUnicos = props.datosConfig?.dias || [];

  diasUnicos.forEach(dia => {
    const momentosOrdenados = [...props.planCompleto].sort((a, b) => ordenMomentos[a.momento] - ordenMomentos[b.momento]);
    
    momentosOrdenados.forEach(bloque => {
      const seleccion = bloque.recetasElegidas.find(r => r.dia === dia);
      if (seleccion && seleccion.receta) {
        lista.push({
          dia: dia,
          momento: bloque.momento,
          receta: seleccion.receta
        });
      }
    });
  });

  return lista;
});

// Revisamos en qué modo estamos para asignarle una lista u otra a los botones de mover receta
const listaActiva = computed(() => {
  if (props.modo === 'revision') {
    return listaCronologica.value;
  } else if (props.modo === 'detalle' && props.contextoDetalle.length > 0) {
    // Si entramos desde el carrusel, montamos la estructura mapeando los datos que nos llegan
    return props.contextoDetalle.map(tarjeta => ({
      dia: tarjeta.dia, 
      momento: props.momentoDetalle,
      receta: tarjeta.receta
    }));
  }
  return [];
});

const itemActual = computed(() => {
  if (listaActiva.value.length > 0) {
    return listaActiva.value[indiceActual.value];
  }
  // Si no tenemos lista activa tiramos de la receta de los props por defecto
  return { receta: props.receta, dia: '', momento: '' };
});

const inicializarIndice = () => {
  if (props.modo === 'detalle' && listaActiva.value.length > 0 && props.receta) {
    const index = listaActiva.value.findIndex(item => item.receta && item.receta.id === props.receta.id);
    indiceActual.value = index !== -1 ? index : 0;
  } else {
    indiceActual.value = 0;
  }
};

onMounted(inicializarIndice);
watch(() => props.receta, inicializarIndice);
watch(() => props.modo, inicializarIndice);

const siguienteReceta = () => {
  if (indiceActual.value < listaActiva.value.length - 1) indiceActual.value++;
};

const anteriorReceta = () => {
  if (indiceActual.value > 0) indiceActual.value--;
};

const toggleGuardar = () => {
  if(itemActual.value.receta) {
    itemActual.value.receta.guardada = !itemActual.value.receta.guardada;
  }
};
</script>

<style scoped>
.libro-view-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.header-contexto {
  margin-bottom: 20px;
  width: 100%;
  max-width: 900px;
}

.navegacion-flechas {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 10px 25px;
  border-radius: 30px;
  border: 2px solid black;
}

.info-meta {
  font-weight: bold;
  font-size: 1.2rem;
  text-align: center;
}

.txt-separador {
  margin: 0 10px;
}

.btn-flecha {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

.btn-flecha:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.receta-header {
  width: 100%;
  max-width: 1300px; 
  text-align: left;
  margin-bottom: 30px;
  padding-left: 5%;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.receta-header h1 {
  font-size: 2.5rem;
  margin: 0;
  line-height: 1;
}

.iconos-header {
  display: flex;
  gap: 10px;
  align-items: center;
}

.iconos-header img {
  height: 4em; 
  width: auto;
  object-fit: contain;
}

.papel-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  width: 90%; 
  max-width: 1300px; 
  margin: 0 auto;
}

.papel-img {
  width: 100%;
  height: auto;
  display: block;
}

.marcapagina-icono {
  position: absolute;
  top: 2%; 
  right: 4%; 
  width: 50px; 
  height: auto;
  cursor: pointer;
  z-index: 10; 
  transition: transform 0.2s;
}

.marcapagina-icono:hover {
  transform: scale(1.1);
}

.papel-contenido {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  padding: 0; 
  box-sizing: border-box;
}

.columna {
  width: 50%; 
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8% 8% 8% 10%; 
  box-sizing: border-box;
  overflow-y: auto; 
  scrollbar-width: none; 
}

.columna::-webkit-scrollbar {
  display: none;
}

.subtitulo-seccion {
  font-size: 1.8rem;
  border-bottom: none !important;
  padding-bottom: 5px;
  margin-bottom: 15px;
  text-align: left;
  width: 100%;
}

.lista-ingredientes, .lista-pasos {
  line-height: 1.6;
  font-size: 1.1rem;
  width: 100%;
  padding-left: 20px;
}

li {
  margin-bottom: 12px;
}

@media (max-width: 950px) {
  .papel-img {
    display: none;
  }

  .papel-wrapper {
    background-color: #fff9ef;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    border: 2px solid #e0d4c3;
    padding-bottom: 20px;
    margin-top: 15px;
    width: 100%;
  }

  .papel-contenido {
    position: relative; 
    flex-direction: column;
    padding: 25px 20px;
    gap: 30px;
  }

  .columna {
    width: 100%;
    overflow-y: visible;
    padding: 0;
  }

  .receta-header {
    padding-left: 0;
  }

  .receta-header h1 {
    font-size: 1.8rem;
  }

  .marcapagina-icono {
    top: -15px;
    right: 15px;
    width: 40px; 
  }

  .info-meta {
    font-size: 0.95rem; 
  }
}
</style>