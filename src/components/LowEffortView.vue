<template>
  <div class="low-effort-container">
    <header class="receta-header">
      <div class="header-content">
        <h1>{{ recetaMostrada.nombre }}</h1>
        <div class="iconos-header">
          <img 
            :src="recetaMostrada.iconoOlla" 
            alt="Icono Trastos" 
            title="Trastos necesarios para la receta:
🟢 1 trasto
🟡 2 trastos
🔴 3 o más trastos"
          >
          <img 
            src="../assets/ingredientes_verde.png" 
            alt="Icono Ingredientes" 
            title="Complejidad de los ingredientes:
🟢 Ingredientes básicos y fáciles de encontrar
🟡 Cantidad o variedad moderada
🔴 Muchos ingredientes o ingredientes más especiales"
          >
        </div>
      </div>
    </header>

    <div class="papel-wrapper">
      <img src="../assets/hoja_papel.png" alt="Papel" class="papel-img">
      
      <img 
        :src="recetaMostrada.guardada ? iconMarcapaginaNegro : iconMarcapagina" 
        alt="Guardar receta" 
        class="marcapagina-icono"
        @click="toggleGuardarReceta"
        :title="recetaMostrada.guardada ? 'Eliminar de mis recetas' : 'Guardar en mis recetas'"
      >
      
      <div class="papel-contenido">
        
        <div class="columna">
          <h3>Ingredientes</h3>
          <p>
            <template v-for="(ingrediente, index) in recetaMostrada.ingredientes" :key="index">
              {{ ingrediente }}<br>
            </template>
          </p>

          <div class="recarga-container">
            <span class="txt-recarga">¿No te ha gustado?</span>
            <button class="btn-recarga" @click="recargarReceta">
              <img 
                src="../assets/boton_recarga.png" 
                alt="Recargar" 
                title="Mostrar otra receta adaptada a tus preferencias"
              >
            </button>
          </div>
        </div>
        
        <div class="columna">
          <h3>Pasos</h3>
          <p>
            <template v-for="(paso, index) in recetaMostrada.pasos" :key="index">
              {{ paso }}<br>
            </template>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

import iconOllasVerde from '../assets/ollas_verde.png';
import iconOllasAmarillo from '../assets/ollas_amarillo.png';
import iconMarcapagina from '../assets/marcapagina.png';
import iconMarcapaginaNegro from '../assets/marcapagina_negro.png';

// Creamos un estado reactivo con ref(). Para acceder o modificar el array dentro del script necesitamos usar '.value'
const recetas = ref([
  {
    nombre: 'Pollo al Tomate y Queso',
    iconoOlla: iconOllasVerde,
    guardada: false,
    ingredientes: [
      "- 2 pechugas de pollo cortadas en dados",
      "- 200 ml de salsa de tomate (o tomate triturado)",
      "- 100 g de queso mozzarella rallado o en lonchas",
      "- 1 cucharada de aceite de oliva",
      "- Sal y pimienta al gusto"
    ],
    pasos: [
      "1. Calienta el aceite en una sartén grande a fuego medio-alto y dora los dados de pollo con sal y pimienta durante 6 minutos.",
      "2. Vierte la salsa de tomate sobre el pollo y cocina todo junto durante 5 minutos más hasta que la carne esté bien hecha.",
      "3. Esparce el queso por encima, tapa la sartén y deja fundir durante 2 minutos a fuego bajo."
    ]
  },
  {
    nombre: 'Filetes de Pollo al Provolone',
    iconoOlla: iconOllasAmarillo,
    guardada: false,
    ingredientes: [
      "- 2 pechugas de pollo enteras (en filetes finos).",
      "- 250 g de tomate natural troceado.",
      "- 100 g de queso tipo provolone o mozzarella.",
      "- 1 cucharada de aceite de oliva.",
      "- Sal y pimienta."
    ],
    pasos: [
      "1. Salpimenta los filetes de pollo y dóralos en la sartén con el aceite a fuego medio durante 3 minutos por cada lado.",
      "2. Añade el tomate troceado alrededor del pollo, tapa la sartén y cocina durante 7 minutos a fuego medio-bajo.",
      "3. Coloca una porción de queso sobre cada filete de pollo, vuelve a tapar y cocina otros 3 minutos hasta que el queso se derrita y la salsa espese."
    ]
  }
]);

// Llevamos el control de la receta activa mediante un índice numérico reactivo
const indiceActual = ref(0);

// Usamos computed() para obtener de manera limpia la receta actual. Se recalcula automáticamente cada vez que cambia 'indiceActual'
const recetaMostrada = computed(() => recetas.value[indiceActual.value]);

// Cambiamos el índice para alternar entre las dos recetas disponibles (0 y 1)
const recargarReceta = () => {
  indiceActual.value = indiceActual.value === 0 ? 1 : 0;
};

// Accedemos a la propiedad interna del objeto reactivo usando '.value' para invertir el booleano de guardado
const toggleGuardarReceta = () => {
  recetaMostrada.value.guardada = !recetaMostrada.value.guardada;
};
</script>

<style scoped>
.low-effort-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.receta-header {
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

/* Contenedor del libro */
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
  top: -2%; 
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
  align-items: center; 
  padding: 5% 10% 8% 10%; 
  box-sizing: border-box;
}

.columna h3 {
  font-size: 1.8rem;
  margin-bottom: 15px;
  text-align: center;
}

.columna p {
  line-height: 1.6;
  font-size: 1.1rem;
  color: #333;
  text-align: left; 
  width: 100%;
}

.recarga-container {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center; 
  gap: 10px;
  width: 100%;
}

.txt-recarga {
  font-size: 1.2rem;
  font-weight: bold;
  color: #555;
  font-style: italic;
  text-align: center; 
}

.btn-recarga {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: fit-content;
  transition: transform 0.2s;
}

.btn-recarga:hover {
  transform: rotate(15deg) scale(1.1);
}

.btn-recarga img {
  width: 100px;
  height: auto;
}

@media (max-width: 900px) {
  .columna h3 {
    font-size: 1.4rem;
    margin-bottom: 8px;
  }
  .columna p {
    font-size: 0.9rem;
    line-height: 1.4;
  }
  .txt-recarga {
    font-size: 0.9rem;
  }
  .btn-recarga img {
    width: 60px; 
  }
  .marcapagina-icono {
    width: 40px; 
  }
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