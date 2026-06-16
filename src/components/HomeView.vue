<script setup>
// Declaramos los eventos que vamos a disparar para avisarle al padre (App.vue) que cambie de vista
const emit = defineEmits(['irRecetaRapida', 'irPlanificarMenu'])
</script>

<template>
  <div class="home-view">
    <h1>Hola de nuevo, Marina</h1>
    <p>¿Qué quieres hacer hoy?</p>
    
    <div class="buttons-container">
      <button
        @click="emit('irRecetaRapida')"
        class="btn btn-black btn-principal"
        title="Genera una receta con tus ingredientes disponibles"
      >
        Receta rápida
      </button>

      <button
        @click="emit('irPlanificarMenu')"
        class="btn btn-white btn-principal"
        title="Organiza tus comidas para varios días"
      >
        Planificar menú
      </button>
    </div>

    <div class="carousel-window">
      <div class="carousel-track">
        
        <div class="carousel-group">
          <img src="../assets/plato1.jpg" alt="Plato">
          <img src="../assets/plato2.jpg" alt="Plato">
          <img src="../assets/plato3.jpg" alt="Plato">
          <img src="../assets/plato4.jpg" alt="Plato">
          <img src="../assets/plato5.jpg" alt="Plato">
          <img src="../assets/plato6.jpg" alt="Plato">
          <img src="../assets/plato7.jpg" alt="Plato">
        </div>

        <div class="carousel-group">
          <img src="../assets/plato1.jpg" alt="Plato">
          <img src="../assets/plato2.jpg" alt="Plato">
          <img src="../assets/plato3.jpg" alt="Plato">
          <img src="../assets/plato4.jpg" alt="Plato">
          <img src="../assets/plato5.jpg" alt="Plato">
          <img src="../assets/plato6.jpg" alt="Plato">
          <img src="../assets/plato7.jpg" alt="Plato">
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 20px 0;
}

h1 {
  font-size: 3.5rem;
  margin-bottom: 0;
  font-weight: 800;
}

p {
  color: #555555;
  font-size: 1.2rem;
  margin-top: 5px;
}

.buttons-container {
  display: flex;
  flex-direction: row;
  gap: 15px;
  margin-top: 20px;
}

.btn-principal {
  padding: 10px 20px;
  cursor: pointer;
}

.carousel-window {
  width: 100%;
  max-width: 100vw;
  /* Escondemos lo que desborda para que no salga la barra de scroll horizontal en la web */
  overflow: hidden;
  margin-top: 50px;
  background-color: transparent;
}

.carousel-track {
  display: flex;
  /* Evitamos que los elementos se amontonen y forzamos a que ocupen el ancho total de las fotos */
  width: max-content;
  animation: scroll-infinito 50s linear infinite;  /* Velocidad de desplazamiento */
}

.carousel-group {
  display: flex;
  gap: 20px; 
  /* Ponemos este padding para dejar el mismo espacio entre el final de la copia y el inicio del original */
  padding-right: 20px; 
}

.carousel-group img {
  width: 250px;
  height: 350px;
  object-fit: cover;
  border-radius: 20px;
  flex-shrink: 0; 
}

/* Movemos el track justo hasta la mitad (-50%). Al ser las dos listas idénticas, vuelve al inicio sin que se note el salto */
@keyframes scroll-infinito {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>