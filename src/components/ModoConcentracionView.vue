<template>
  <div class="concentracion-container">
    
    <header class="header-titulos">
      <h1>¿Qué te parecen estas recetas?</h1>
      <h2 class="subtitulo-momento">{{ momentoActual.charAt(0).toUpperCase() + momentoActual.slice(1) }}</h2>
    </header>

    <div class="carrusel-wrapper">
      <div class="carrusel-tarjetas">
        
        <div 
          v-for="(tarjeta, index) in tarjetasActuales" 
          :key="tarjeta.dia" 
          class="draggable-wrapper"
          draggable="true"
          @dragstart="iniciarArrastre($event, index)"
          @dragover.prevent
          @dragenter.prevent
          @drop="soltarTarjeta($event, index)"
        >
          <TarjetaReceta 
            :dia="tarjeta.dia"
            :receta="tarjeta.receta"
            :fijada="tarjeta.fijada"
            @fijar="toggleFijarTarjeta(index)"
            @guardar="toggleGuardarReceta" 
            @ver-detalle="$emit('ver-detalle', { receta: $event, tarjetas: tarjetasActuales, momento: momentoActual })"
          />
        </div>

      </div>
    </div>

    <div class="controles-inferiores">
      
      <div class="control-item" @click="refrescarRecetas" title="Mostrar otras recetas adaptadas a tus preferencias">
        <button class="btn-recarga-img">
          <img src="../assets/boton_recarga.png" alt="Recargar">
        </button>
        <span class="txt-control">¿No te han gustado?</span>
      </div>

      <div 
        class="control-item" 
        @click="botonConfirmarDesbloqueado ? confirmarSeleccion() : null" 
        :class="{ 'desactivado': !botonConfirmarDesbloqueado }"
      >
        <button class="btn-circular check-btn" title="Confirmar selección de recetas para este momento del día">
          <span>✔</span>
        </button>
        <span class="txt-control">Confirmar selección</span>
      </div>

      <div class="control-item solo-texto">
        <div class="btn-circular check-btn" title="Número de recetas fijadas">
          <span>{{ totalFijadas }}</span>
        </div>
        <span class="txt-control">Recetas<br>fijadas</span>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import TarjetaReceta from './TarjetaReceta.vue'

const props = defineProps({
  datos: Object
})

const emit = defineEmits(['ver-detalle', 'finalizar-plan'])

const baseDeDatosRecetas = ref([
  // --- DESAYUNOS ---
  { 
    id: 1, nombre: 'Pancakes de Avena', imagen: 'pancakes.jpg', descripcion: 'Desayuno alto en proteínas ideal para antes o después de entrenar.', momento: 'desayuno', guardada: true, necesidad: 'ejercicio', trastos: 'pocos',
    ingredientes: ['50g de avena triturada', '2 huevos (o claras)', '1 plátano maduro', 'Canela'],
    pasos: ['Machaca el plátano y mézclalo con los huevos.', 'Añade la avena y la canela.', 'Cocina en una sartén a fuego medio vuelta y vuelta.']
  },
  { 
    id: 2, nombre: 'Huevos Revueltos con Pavo', imagen: 'huevos_pavo.jpg', descripcion: 'Mucha proteína y energía rápida para empezar el día con fuerza.', momento: 'desayuno', guardada: false, necesidad: 'ejercicio', trastos: 'pocos',
    ingredientes: ['3 huevos', '50g de pechuga de pavo', 'Aceite de oliva', 'Sal y pimienta'],
    pasos: ['Bate los huevos en un bol.', 'Corta el pavo en taquitos.', 'Cuaja los huevos en la sartén junto al pavo sin dejar de remover.']
  },
  { 
    id: 3, nombre: 'Tortilla de Claras', imagen: 'tortillas.jpg', descripcion: 'Opción ultraligera y proteica para definir musculatura.', momento: 'desayuno', guardada: true, necesidad: 'ejercicio', trastos: 'pocos',
    ingredientes: ['200ml de claras de huevo pasteurizadas', '1 pizca de sal', 'Especias al gusto'],
    pasos: ['Calienta bien la sartén.', 'Vierte las claras y baja el fuego.', 'Dobla cuando empiece a cuajar.']
  },
  { 
    id: 4, nombre: 'Tostadas con Aguacate', imagen: 'tostadas_aguacate.jpg', descripcion: 'Grasas saludables perfectas para mantener el foco mental toda la mañana.', momento: 'desayuno', guardada: false, necesidad: 'concentracion', trastos: 'pocos',
    ingredientes: ['2 rebanadas de pan integral', '1/2 aguacate maduro', 'Semillas de sésamo', 'Aceite de oliva y sal'],
    pasos: ['Tuesta el pan.', 'Unta el aguacate por encima.', 'Añade un chorrito de aceite, sal y semillas.']
  },
  { id: 5, nombre: 'Batido de Matcha y Plátano', imagen: 'batido_matcha.jpg', descripcion: 'Antioxidantes y energía sostenida sin el bajón del café tradicional.', momento: 'desayuno', guardada: true, necesidad: 'concentracion', trastos: 'pocos', ingredientes: ['Leche', 'Matcha', 'Plátano'], pasos: ['Batir todo.'] },
  { id: 6, nombre: 'Tostadas con Crema de Cacahuete', imagen: 'tostadas_cacahuete.jpg', descripcion: 'Rico en fósforo y grasas buenas para el cerebro.', momento: 'desayuno', guardada: false, necesidad: 'concentracion', trastos: 'pocos', ingredientes: ['Pan', 'Crema de cacahuete'], pasos: ['Tostar y untar.'] },
  { id: 7, nombre: 'Yogur con Granola', imagen: 'yogur_granola.jpg', descripcion: 'Un clásico económico, rápido de preparar y muy saciante.', momento: 'desayuno', guardada: true, necesidad: 'ahorrar', trastos: 'pocos', ingredientes: ['Yogur natural', 'Granola', 'Miel'], pasos: ['Mezclar en un bol.'] },
  { id: 8, nombre: 'Porridge de Avena y Manzana', imagen: 'porridge.jpg', descripcion: 'Ingredientes de despensa muy baratos que rinden para muchos días.', momento: 'desayuno', guardada: false, necesidad: 'ahorrar', trastos: 'pocos', ingredientes: ['Avena', 'Leche', 'Manzana'], pasos: ['Calentar la leche y avena.', 'Añadir manzana troceada.'] },
  { id: 9, nombre: 'Pan con Tomate y Aceite', imagen: 'pan_tomate.jpg', descripcion: 'El desayuno mediterráneo por excelencia, rico y muy asequible.', momento: 'desayuno', guardada: true, necesidad: 'ahorrar', trastos: 'pocos', ingredientes: ['Pan', 'Tomate rallado', 'Aceite de oliva'], pasos: ['Tostar pan.', 'Poner tomate y aceite.'] },

  // --- COMIDAS ---
  { 
    id: 10, nombre: 'Arroz con Pollo y Brócoli', imagen: 'arroz_pollo.jpg', descripcion: 'El plato definitivo para recuperación muscular. Carbohidratos y proteína limpia.', momento: 'comida', guardada: true, necesidad: 'ejercicio', trastos: 'medios',
    ingredientes: ['80g de arroz basmati', '150g de pechuga de pollo', '100g de brócoli', 'Salsa de soja'],
    pasos: ['Cuece el arroz y el brócoli por separado.', 'Haz el pollo a la plancha.', 'Mezcla todo con un poco de salsa de soja.']
  },
  { id: 11, nombre: 'Pasta Integral con Atún', imagen: 'pasta_atun.jpg', descripcion: 'Recarga de glucógeno y proteínas. Perfecto para los días de entrenamiento pesado.', momento: 'comida', guardada: false, necesidad: 'ejercicio', trastos: 'pocos', ingredientes: ['Macarrones integrales', '2 latas de atún', 'Tomate frito'], pasos: ['Cocer pasta.', 'Mezclar con atún y tomate.'] },
  { id: 12, nombre: 'Ternera con Boniato', imagen: 'ternera_boniato.jpg', descripcion: 'Hierro y carbohidratos de absorción lenta para máxima fuerza.', momento: 'comida', guardada: true, necesidad: 'ejercicio', trastos: 'muchos', ingredientes: ['Filete de ternera', '1 boniato', 'Especias'], pasos: ['Asar boniato.', 'Hacer ternera a la plancha.'] },
  { id: 13, nombre: 'Salmón al Horno', imagen: 'salmon_horno.jpg', descripcion: 'Dosis masiva de Omega-3, el mejor aliado para largas sesiones de estudio o trabajo.', momento: 'comida', guardada: false, necesidad: 'concentracion', trastos: 'medios', ingredientes: ['Lomo de salmón', 'Limón', 'Eneldo'], pasos: ['Hornear salmón a 200ºC por 15 min.'] },
  { id: 14, nombre: 'Ensalada de Quinoa y Nueces', imagen: 'ensalada_quinoa.jpg', descripcion: 'Superalimentos combinados para evitar la pesadez y el sueño después de comer.', momento: 'comida', guardada: true, necesidad: 'concentracion', trastos: 'pocos', ingredientes: ['Quinoa cocida', 'Nueces', 'Tomates cherry'], pasos: ['Mezclar todo y aliñar.'] },
  { id: 15, nombre: 'Poke Bowl de Atún', imagen: 'poke_atun.jpg', descripcion: 'Comida fresca, ligera y rica en ácidos grasos para la memoria.', momento: 'comida', guardada: false, necesidad: 'concentracion', trastos: 'pocos', ingredientes: ['Arroz sushi', 'Atún crudo', 'Aguacate', 'Edamame'], pasos: ['Montar el bowl y aliñar con soja.'] },
  { id: 16, nombre: 'Lentejas Estofadas', imagen: 'lentejas.jpg', descripcion: 'Nutrición espectacular a un precio ridículo. Rinde para varios tuppers.', momento: 'comida', guardada: true, necesidad: 'ahorrar', trastos: 'medios', ingredientes: ['Lentejas', 'Zanahoria', 'Patata', 'Cebolla'], pasos: ['Sofreír verduras.', 'Añadir lentejas y agua, cocer 40 min.'] },
  { id: 17, nombre: 'Macarrones con Tomate', imagen: 'macarrones.jpg', descripcion: 'Un salvavidas de fin de mes. Fácil, rapidísimo y gusta a todo el mundo.', momento: 'comida', guardada: false, necesidad: 'ahorrar', trastos: 'muchos', ingredientes: ['Pasta', 'Tomate frito', 'Queso rallado'], pasos: ['Hervir pasta.', 'Mezclar con tomate y queso.'] },
  { id: 18, nombre: 'Garbanzos con Espinacas', imagen: 'garbanzos_espinacas.jpg', descripcion: 'Legumbres de bote salteadas. Nutritivo y cuida tu bolsillo.', momento: 'comida', guardada: true, necesidad: 'ahorrar', trastos: 'pocos', ingredientes: ['Bote de garbanzos', 'Espinacas frescas', 'Ajo'], pasos: ['Dorar el ajo.', 'Saltear las espinacas y garbanzos.'] },

  // --- CENAS ---
  { id: 19, nombre: 'Ensalada de Pollo Asado', imagen: 'ensalada_pollo.jpg', descripcion: 'Cena ligera alta en proteína para alimentar el músculo mientras duermes.', momento: 'cena', guardada: true, necesidad: 'ejercicio', trastos: 'pocos', ingredientes: ['Lechuga', 'Restos de pollo asado', 'Tomate'], pasos: ['Mezclar ingredientes.'] },
  { id: 20, nombre: 'Merluza al Vapor', imagen: 'merluza.jpg', descripcion: 'Cero grasas pesadas, digestión rápida y proteína de alta calidad.', momento: 'cena', guardada: false, necesidad: 'ejercicio', trastos: 'medios', ingredientes: ['Lomo de merluza', 'Patata cocida'], pasos: ['Cocinar merluza al vapor 10 min.'] },
  { id: 21, nombre: 'Pechuga de Pavo a la Plancha', imagen: 'pavo_plancha.jpg', descripcion: 'Acompañada de espárragos. Simple y directo para tu dieta.', momento: 'cena', guardada: true, necesidad: 'ejercicio', trastos: 'medios', ingredientes: ['Pechuga de pavo', 'Espárragos trigueros'], pasos: ['Hacer todo a la plancha con poco aceite.'] },
  { id: 22, nombre: 'Crema de Calabaza', imagen: 'crema_calabaza.jpg', descripcion: 'Cena muy suave que facilita el descanso nocturno y asienta las ideas del día.', momento: 'cena', guardada: true, necesidad: 'concentracion', trastos: 'muchos', ingredientes: ['Calabaza', 'Puerro', 'Caldo de verduras'], pasos: ['Hervir verduras.', 'Triturar hasta hacer puré.'] },
  { id: 23, nombre: 'Pescado Azul al Horno', imagen: 'pescado_azul.jpg', descripcion: 'Sardinas o caballa. Un último empujón de grasas saludables antes de dormir.', momento: 'cena', guardada: false, necesidad: 'concentracion', trastos: 'medios', ingredientes: ['Caballa o sardinas', 'Ajo y perejil'], pasos: ['Hornear con majado de ajo y perejil.'] },
  { id: 24, nombre: 'Ensalada de Espinacas', imagen: 'ensalada_espinacas.jpg', descripcion: 'Rica en magnesio para calmar el sistema nervioso tras un día de máxima atención.', momento: 'cena', guardada: true, necesidad: 'concentracion', trastos: 'pocos', ingredientes: ['Espinacas frescas', 'Queso fresco', 'Nueces'], pasos: ['Mezclar y aliñar suave.'] },
  { id: 25, nombre: 'Tortilla Francesa', imagen: 'tortilla_francesa.jpg', descripcion: 'Dos huevos y listo. La cena más socorrida, barata y rápida que existe.', momento: 'cena', guardada: false, necesidad: 'ahorrar', trastos: 'pocos', ingredientes: ['2 huevos', 'Sal', 'Aceite'], pasos: ['Batir huevos.', 'Cuajar en la sartén.'] },
  { id: 26, nombre: 'Sopa de Fideos', imagen: 'sopa_fideos.jpg', descripcion: 'Reconfortante, caliente e ideal para aprovechar caldo casero.', momento: 'cena', guardada: true, necesidad: 'ahorrar', trastos: 'pocos', ingredientes: ['Caldo de pollo', 'Fideos finos'], pasos: ['Hervir caldo.', 'Cocer fideos 3 min.'] },
  { id: 27, nombre: 'Salteado de Verduras', imagen: 'salteado_verduras.jpg', descripcion: 'Aprovecha las verduras de temporada que estén en oferta en el súper.', momento: 'cena', guardada: false, necesidad: 'ahorrar', trastos: 'medios', ingredientes: ['Verduras variadas', 'Salsa de soja'], pasos: ['Saltear verduras a fuego fuerte con soja.'] },
])

const indiceMomentoActual = ref(0) 
const tarjetasActuales = ref([])     
const historialSeleccionado = ref([]) 
const indiceRotacion = ref(0)

const ordenCronologico = { desayuno: 1, comida: 2, cena: 3 }

const momentosOrdenados = computed(() => {
  if (!props.datos?.momentos) return []
  return [...props.datos.momentos].sort((a, b) => ordenCronologico[a] - ordenCronologico[b])
})

const momentoActual = computed(() => {
  return momentosOrdenados.value[indiceMomentoActual.value] || 'comida'
})

const recetasFiltradas = computed(() => {
  return baseDeDatosRecetas.value.filter(receta => receta.momento === momentoActual.value)
})

const botonConfirmarDesbloqueado = computed(() => {
  if (!tarjetasActuales.value || tarjetasActuales.value.length === 0) return false
  return tarjetasActuales.value.every(tarjeta => tarjeta.fijada === true)
})

const totalFijadas = computed(() => {
  return tarjetasActuales.value.filter(t => t.fijada).length
})

const toggleGuardarReceta = (recetaAguardar) => {
  const recetaEnBD = baseDeDatosRecetas.value.find(r => r.id === recetaAguardar.id);
  if (recetaEnBD) {
    recetaEnBD.guardada = !recetaEnBD.guardada;
  }
}

const inicializarTarjetas = () => {
  if (!props.datos?.dias) return
  
  tarjetasActuales.value = props.datos.dias.map(dia => ({
    dia: dia,
    receta: null,
    fijada: false
  }))

  indiceRotacion.value = 0
  refrescarRecetas()
}

const refrescarRecetas = () => {
  const disponibles = recetasFiltradas.value;
  if (disponibles.length === 0) return;

  // Registramos qué recetas NO podemos usar porque ya están fijadas por el usuario
  const idsFijados = tarjetasActuales.value
    .filter(t => t.fijada && t.receta)
    .map(t => t.receta.id);

  // Llevamos un registro de lo que vamos asignando en este mismo clic para no repetir entre tarjetas
  const idsOcupados = [...idsFijados];

  tarjetasActuales.value = tarjetasActuales.value.map(tarjeta => {
    // Si la tarjeta está fijada, no la tocamos
    if (tarjeta.fijada && tarjeta.receta !== null) {
      return tarjeta;
    }

    const idActual = tarjeta.receta ? tarjeta.receta.id : null;

    // Buscamos recetas que NO estén ni fijadas ni asignadas a otra tarjeta en este bucle
    let libres = disponibles.filter(r => !idsOcupados.includes(r.id));

    if (libres.length === 0) {
      libres = disponibles.filter(r => !idsFijados.includes(r.id));
      if (libres.length === 0) libres = [...disponibles];
    }

    // Buscamos candidatos filtrando por prioridad y obligando a que NO SEA LA MISMA de ahora
    let candidatos = libres.filter(r => {
      const matchNec = !props.datos?.necesidad || r.necesidad === props.datos.necesidad;
      const matchPri = !props.datos?.prioridad || 
        (props.datos.prioridad === 'propias' && r.guardada) || 
        (props.datos.prioridad === 'nuevas' && !r.guardada);
      return matchNec && matchPri && r.id !== idActual; // Forzamos que sea distinta
    });

    // Si somos muy estrictos y no quedan, relajamos la prioridad (solo necesidad)
    if (candidatos.length === 0) {
      candidatos = libres.filter(r => {
        const matchNec = !props.datos?.necesidad || r.necesidad === props.datos.necesidad;
        return matchNec && r.id !== idActual;
      });
    }

    // Si aún así no quedan, agarramos cualquiera que sea diferente a la actual
    if (candidatos.length === 0) {
      candidatos = libres.filter(r => r.id !== idActual);
    }

    // Si la única opción real es la misma que ya tiene, la repetimos
    if (candidatos.length === 0) {
      candidatos = libres;
    }

    // Asignamos una receta al azar usando nuestro índice rotatorio
    const elegida = candidatos[indiceRotacion.value % candidatos.length];
    indiceRotacion.value++;
    
    // Marcamos esta elegida como "ocupada" para la siguiente tarjeta
    idsOcupados.push(elegida.id);

    return {
      ...tarjeta,
      receta: elegida
    };
  });
};

const toggleFijarTarjeta = (index) => {
  if (!tarjetasActuales.value[index].receta) return 
  tarjetasActuales.value[index].fijada = !tarjetasActuales.value[index].fijada
}

const confirmarSeleccion = () => {
  if (!botonConfirmarDesbloqueado.value) return

  historialSeleccionado.value.push({
    momento: momentoActual.value,
    recetasElegidas: [...tarjetasActuales.value]
  })

  if (indiceMomentoActual.value < momentosOrdenados.value.length - 1) {
    indiceMomentoActual.value++ 
    inicializarTarjetas() 
  } else {
    emit('finalizar-plan', historialSeleccionado.value)
  }
}

const arrastrandoIndex = ref(null);

const iniciarArrastre = (event, index) => {
  arrastrandoIndex.value = index;
  event.dataTransfer.effectAllowed = 'move';
};

const soltarTarjeta = (event, indexDestino) => {
  const indexOrigen = arrastrandoIndex.value;
  
  if (indexOrigen !== null && indexOrigen !== indexDestino) {
    const recetaOrigen = tarjetasActuales.value[indexOrigen].receta;
    const fijadaOrigen = tarjetasActuales.value[indexOrigen].fijada;

    tarjetasActuales.value[indexOrigen].receta = tarjetasActuales.value[indexDestino].receta;
    tarjetasActuales.value[indexOrigen].fijada = tarjetasActuales.value[indexDestino].fijada;

    tarjetasActuales.value[indexDestino].receta = recetaOrigen;
    tarjetasActuales.value[indexDestino].fijada = fijadaOrigen;
  }
  
  arrastrandoIndex.value = null; 
};

watch(() => props.datos, () => {
  inicializarTarjetas()
}, { deep: true })

onMounted(() => {
  inicializarTarjetas()
})
</script>

<style scoped>
.concentracion-container {
  padding: 0 0 20px 0;
  display: flex;
  flex-direction: column;
}

.header-titulos {
  padding: 0 5%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.header-titulos h1 {
  font-size: 2rem;
  margin-bottom: 5px;
  color: #1a1a1a;
  text-align: left;
}
.subtitulo-momento {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1a1a1a;
  margin: 15px 0 0 0;
  text-align: left;
}

.carrusel-wrapper {
  width: 100%;
  max-width: 100vw;
  overflow: hidden; 
}

.carrusel-tarjetas {
  display: flex;
  flex-wrap: nowrap; 
  gap: 20px;
  overflow-x: auto; 
  padding-bottom: 15px; 
  padding-left: 5%; 
  padding-right: 5%;
  -webkit-overflow-scrolling: touch; 
}

.carrusel-tarjetas::-webkit-scrollbar {
  height: 8px; 
}

.carrusel-tarjetas::-webkit-scrollbar-track {
  background: #f1f1f1; 
  border-radius: 10px;
  margin: 0 5%; 
}

.carrusel-tarjetas::-webkit-scrollbar-thumb {
  background: #c1c1c1; 
  border-radius: 10px;
}

.carrusel-tarjetas::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8; 
}

.controles-inferiores {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-top: 30px;
  padding: 0 20px;
}

.control-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  cursor: pointer;
  width: 120px;
}

.control-item.solo-texto {
  cursor: default;
}

.control-item.desactivado {
  cursor: not-allowed;
  pointer-events: none; 
}

.control-item.desactivado .check-btn {
  background-color: #ccc !important; 
  color: #888 !important;            
  box-shadow: none !important;
}

.control-item.desactivado .txt-control {
  color: #888; 
}

.btn-circular {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: inherit;
  transition: all 0.2s ease;
}

.btn-circular.check-btn {
  background: black;
  border: none;
  color: white;
}

.btn-circular span {
  font-size: 2rem;
}

.btn-recarga-img {
  background: none;
  border: none;
  padding: 0;
  cursor: inherit;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.btn-recarga-img img {
  width: 100%; 
  height: auto;
}

.control-item:hover .btn-recarga-img {
  transform: rotate(15deg) scale(1.1);
}

.txt-control {
  font-weight: bold;
  font-size: 0.9rem;
  color: #1a1a1a;
  line-height: 1.2;
}

.draggable-wrapper {
  flex: 0 0 280px; 
  cursor: grab;
  display: flex;   
}

.draggable-wrapper:active {
  cursor: grabbing;
}

@media (max-width: 768px) {
  .header-titulos h1 {
    font-size: 1.5rem;
  }
  .subtitulo-momento {
    font-size: 1.2rem;
  }

  .controles-inferiores {
    gap: 15px; 
    flex-wrap: wrap; 
    padding: 0 10px;
  }

  .control-item {
    width: 90px; 
  }

  .btn-circular,
  .btn-recarga-img {
    width: 55px; 
    height: 55px;
  }

  .btn-circular span {
    font-size: 1.5rem;
  }

  .txt-control {
    font-size: 0.8rem; 
  }

  .draggable-wrapper {
    flex: 0 0 240px !important;
  }
  
  .carrusel-wrapper {
    padding-left: 15px;
  }
  .carrusel-tarjetas {
    padding-right: 15px;
  }
}
</style>