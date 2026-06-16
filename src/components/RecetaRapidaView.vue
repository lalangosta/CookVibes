<template>
  <div class="receta-rapida">
    <header class="header-principal">
      <h1>Receta rápida</h1>
    </header>

    <div class="seccion">
      
      <div class="tiempo-seccion">
        <h2 class="sub-header">¿Cuánto tiempo tienes disponible?</h2>
        
        <div class="categoria-wrapper" :class="{ 'is-open': abierta === 'tiempo' }">
          <div class="icono-principal icono-tiempo" 
               :class="{ 'seleccionado': selecciones.tiempo }" 
               @click="toggle('tiempo')">
            <img src="../assets/icon_tiempo.png" alt="Tiempo">
            <span>{{ selecciones.tiempo ? selecciones.tiempo : 'Tiempo' }}</span>
          </div>
          
          <div class="sub-burbujas">
            <div class="burbuja" :class="{ activo: selecciones.tiempo === '15m' }" @click="seleccionar('tiempo', '15m')"><span>15m</span></div>
            <div class="burbuja" :class="{ activo: selecciones.tiempo === '30m' }" @click="seleccionar('tiempo', '30m')"><span>30m</span></div>
            <div class="burbuja" :class="{ activo: selecciones.tiempo === '1h' }" @click="seleccionar('tiempo', '1h')"><span>1h</span></div>
            <div class="burbuja" :class="{ activo: selecciones.tiempo === '2h+' }" @click="seleccionar('tiempo', '2h+')"><span>2h+</span></div>
          </div>
        </div>
      </div>

      <div class="ingredientes-container">
        <h2 class="sub-header">¿Qué ingredientes tienes?</h2>
        
        <div class="categorias-flex">
          
          <div class="categoria-wrapper" :class="{ 'is-open': abierta === 'verdura' }">
            <div class="icono-principal" 
                 :class="{ 'seleccionado': selecciones.verdura }" 
                 @click="toggle('verdura')">
              <img src="../assets/icon_verdura.png" alt="Verdura">
              <span>{{ selecciones.verdura ? selecciones.verdura : 'Verdura' }}</span>
            </div>
            <div class="sub-burbujas">
              <div class="burbuja" :class="{ activo: selecciones.verdura === 'Zanahoria' }" @click="seleccionar('verdura', 'Zanahoria')"><img src="../assets/zanahoria.png"title="Zanahoria" /></div>
              <div class="burbuja" :class="{ activo: selecciones.verdura === 'Pimiento' }" @click="seleccionar('verdura', 'Pimiento')"><img src="../assets/pimiento.png" title="Pimiento" /></div>
              <div class="burbuja" :class="{ activo: selecciones.verdura === 'Tomate' }" @click="seleccionar('verdura', 'Tomate')"><img src="../assets/tomate.png" title="Tomate" /></div>
              <div class="burbuja" :class="{ activo: selecciones.verdura === 'Otros' }" @click="seleccionar('verdura', 'Otros')"><img src="../assets/otros.png" title="Otros" /></div>
            </div>
          </div>

          <div class="categoria-wrapper" :class="{ 'is-open': abierta === 'carne' }">
            <div class="icono-principal" 
                 :class="{ 'seleccionado': selecciones.carne }" 
                 @click="toggle('carne')">
              <img src="../assets/icon_carne.png" alt="Carne">
              <span>{{ selecciones.carne ? selecciones.carne : 'Carne' }}</span>
            </div>
            <div class="sub-burbujas">
              <div class="burbuja" :class="{ activo: selecciones.carne === 'Vaca' }" @click="seleccionar('carne', 'Vaca')"><img src="../assets/vaca.png" title="Vaca" /></div>
              <div class="burbuja" :class="{ activo: selecciones.carne === 'Pollo' }" @click="seleccionar('carne', 'Pollo')"><img src="../assets/pollo.png" title="Pollo" /></div>
              <div class="burbuja" :class="{ activo: selecciones.carne === 'Pavo' }" @click="seleccionar('carne', 'Pavo')"><img src="../assets/pavo.png" title="Pavo" /></div>
              <div class="burbuja" :class="{ activo: selecciones.carne === 'Otros' }" @click="seleccionar('carne', 'Otros')"><img src="../assets/otros.png" title="Otros" /></div>
            </div>
          </div>

          <div class="categoria-wrapper" :class="{ 'is-open': abierta === 'lacteos' }">
            <div class="icono-principal" 
                 :class="{ 'seleccionado': selecciones.lacteos }" 
                 @click="toggle('lacteos')">
              <img src="../assets/icon_lacteos.png" alt="Lácteos">
              <span>{{ selecciones.lacteos ? selecciones.lacteos : 'Lácteos' }}</span>
            </div>
            <div class="sub-burbujas">
              <div class="burbuja" :class="{ activo: selecciones.lacteos === 'Queso' }" @click="seleccionar('lacteos', 'Queso')"><img src="../assets/queso.png" title="Queso" /></div>
              <div class="burbuja" :class="{ activo: selecciones.lacteos === 'Leche' }" @click="seleccionar('lacteos', 'Leche')"><img src="../assets/leche.png" title="Leche" /></div>
              <div class="burbuja" :class="{ activo: selecciones.lacteos === 'Yogur' }" @click="seleccionar('lacteos', 'Yogur')"><img src="../assets/yogur.png" title="Yogur" /></div>
              <div class="burbuja" :class="{ activo: selecciones.lacteos === 'Otros' }" @click="seleccionar('lacteos', 'Otros')"><img src="../assets/otros.png" title="Otros" /></div>
            </div>
          </div>
        </div>
      </div>

      <div class="ingredientes-container extras-container">
        <h2 class="sub-header">¿Te falta algo más?</h2>
        
        <div class="categorias-flex">
          
          <div class="categoria-wrapper" :class="{ 'is-open': abierta === 'trastos' }">
            <div class="icono-principal" 
                 :class="{ 'seleccionado': selecciones.trastos }" 
                 @click="toggle('trastos')">
              <img src="../assets/icon_trastos.png" alt="Trastos" class="img-trastos">
              <span>{{ selecciones.trastos ? selecciones.trastos : 'Trastos' }}</span>
            </div>
            <div class="sub-burbujas">
              <div class="burbuja" :class="{ activo: selecciones.trastos === '1' }" @click="seleccionar('trastos', '1')"><span>1</span></div>
              <div class="burbuja" :class="{ activo: selecciones.trastos === '2' }" @click="seleccionar('trastos', '2')"><span>2</span></div>
              <div class="burbuja" :class="{ activo: selecciones.trastos === '3' }" @click="seleccionar('trastos', '3')"><span>3</span></div>
              <div class="burbuja" :class="{ activo: selecciones.trastos === '3+' }" @click="seleccionar('trastos', '3+')"><span>3+</span></div>
            </div>
          </div>

          <div class="categoria-wrapper" :class="{ 'is-open': abierta === 'despensa' }">
            <div class="icono-principal" 
                 :class="{ 'seleccionado': selecciones.despensa }" 
                 @click="toggle('despensa')">
              <img src="../assets/icon_raros.png" alt="Despensa">
              <span>{{ selecciones.despensa ? selecciones.despensa : 'Despensa' }}</span>
            </div>
            <div class="sub-burbujas">
              <div class="burbuja" :class="{ activo: selecciones.despensa === 'Especias' }" @click="seleccionar('despensa', 'Especias')"><span style="font-size: 0.6rem">Especias</span></div>
              <div class="burbuja" :class="{ activo: selecciones.despensa === 'Salsas' }" @click="seleccionar('despensa', 'Salsas')"><span style="font-size: 0.65rem">Salsas</span></div>
              <div class="burbuja" :class="{ activo: selecciones.despensa === 'Conservas' }" @click="seleccionar('despensa', 'Conservas')"><span style="font-size: 0.6rem">Conservas</span></div>
              <div class="burbuja" :class="{ activo: selecciones.despensa === 'Secos' }" @click="seleccionar('despensa', 'Secos')"><span style="font-size: 0.7rem">Secos</span></div>
            </div>
          </div>

          <div class="categoria-wrapper" :class="{ 'is-open': abierta === 'otros_cat' }">
            <div class="icono-principal" 
                 :class="{ 'seleccionado': selecciones.otros_cat }" 
                 @click="toggle('otros_cat')">
              <img src="../assets/icon_otros.png" alt="Otros">
              <span>{{ selecciones.otros_cat ? selecciones.otros_cat : 'Otros' }}</span>
            </div>
            <div class="sub-burbujas">
              <div class="burbuja" :class="{ activo: selecciones.otros_cat === 'Huevos' }" @click="seleccionar('otros_cat', 'Huevos')"><img src="../assets/huevos.png" title="Huevos"></div>
              <div class="burbuja" :class="{ activo: selecciones.otros_cat === 'Pan' }" @click="seleccionar('otros_cat', 'Pan')"><img src="../assets/pan.png" title="Pan"></div>
              <div class="burbuja" :class="{ activo: selecciones.otros_cat === 'Aceite' }" @click="seleccionar('otros_cat', 'Aceite')"><img src="../assets/aceite.png" title="Aceite"></div>
              <div class="burbuja" :class="{ activo: selecciones.otros_cat === 'Pasta' }" @click="seleccionar('otros_cat', 'Pasta')"><img src="../assets/pasta.png" title="Pasta"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-acciones">
          <button 
            @click="irAReceta" 
            class="btn-ver-receta" 
            :disabled="!tieneIngredientes"
          >
            Ver receta
          </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';

// Definimos lo que mandamos para arriba al componente padre (App.vue)
const emit = defineEmits(['volver', 'ver-receta']);

// Guardamos cuál está desplegada. Si es null significa que están todas cerradas
const abierta = ref(null);

// Propiedad computada para verificar si hay al menos un ingrediente seleccionado
const tieneIngredientes = computed(() => {
  return !!(selecciones.verdura || selecciones.carne || selecciones.lacteos || selecciones.otros_cat);
});

// Variable para controlar si se ha intentado enviar el formulario sin éxito
const errorIngredientes = ref(false);

// Agrupamos los datos seleccionados en un único objeto reactive para tenerlo todo ordenado
const selecciones = reactive({
  tiempo: null,
  verdura: null,
  carne: null,
  lacteos: null,
  trastos: null,
  despensa: null,
  otros_cat: null
});

// Si volvemos a clicar en la misma que ya está abierta, la cerramos pasando null
const toggle = (categoria) => {
  abierta.value = abierta.value === categoria ? null : categoria;
};

// Guardamos el ingrediente o tiempo seleccionado en el objeto y cerramos el menú
const seleccionar = (categoria, valor) => {
  selecciones[categoria] = valor;
  abierta.value = null; 

  // Si selecciona un ingrediente válido, limpiamos el aviso de error inmediatamente
  if (tieneIngredientes.value) {
    errorIngredientes.value = false;
  }
};

const irAReceta = () => {
  if (!tieneIngredientes.value) {
    errorIngredientes.value = true;
    return;
  }
  emit('ver-receta', selecciones);
};
</script>

<style scoped>
.receta-rapida {
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

.seccion {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.tiempo-seccion {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
}

.ingredientes-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 800px;
  margin-bottom: 40px; 
}

.sub-header {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
}

.categorias-flex {
  display: flex;
  justify-content: center;
  flex-wrap: wrap; 
  gap: 50px; 
}

.categoria-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 110px;
}

.categoria-wrapper.is-open {
  z-index: 20;
}

.icono-principal {
  width: 100px;
  height: 100px;
  border: 2px solid black;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: white;
  z-index: 10;
  transition: transform 0.2s;
}

.icono-tiempo {
  border-color: #333;
}

.icono-principal:active { transform: scale(0.95); }
.icono-principal img { width: 45px; }
.icono-principal span { font-size: 0.9rem; font-weight: bold; }

.sub-burbujas {
  position: absolute;
  top: 110px;
  left: 50%;
  transform: translateX(-50%) translateY(-20px);
  display: flex;
  gap: 12px;
  padding: 10px;
  opacity: 0;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  white-space: nowrap;
}

.is-open .sub-burbujas {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}

.burbuja {
  width: 55px;
  height: 55px;
  background: white;
  border: 2px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s ease;
}

.burbuja span {
  font-size: 0.8rem;
  font-weight: bold;
}

.burbuja span,
.burbuja img {
  margin-top: 4px;
}

.burbuja:hover {
  border-color: #000000;
  background-color: #f0f8ff;
}

.burbuja img { width: 30px; }

.footer-acciones {
  margin: 40px 0 60px 0;
  display: flex;
  justify-content: center;
}

.btn-ver-receta {
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

.btn-ver-receta:hover {
  background-color: #333;
  transform: scale(1.05);
}

.btn-ver-receta:active {
  transform: scale(0.95);
}

.btn-ver-receta:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.icono-principal.seleccionado {
  border: 3px solid black;
  background-color: #f9f9f9;
}

.burbuja.activo {
  background-color: #000;
  border-color: #000;
}

.burbuja.activo span {
  color: #fff;
}

.img-trastos {
  width: 55px !important; 
}

@media (max-width: 768px) {
  .header-principal h1 {
    font-size: 2rem;
  }
  .categorias-flex {
    gap: 30px;
    row-gap: 80px; 
  }
}

@media (max-width: 480px) {
  .receta-rapida {
    padding: 10px;
  }
  .header-principal {
    text-align: center;
    padding-left: 0;
    margin-bottom: 30px;
  }
  .header-principal h1 {
    font-size: 1.8rem;
  }
  .sub-header {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }
  .ingredientes-container {
    padding: 10px;
    margin-bottom: 20px;
  }
  
  .categorias-flex {
    gap: 15px;
    row-gap: 80px; 
  }
  .categoria-wrapper {
    width: 80px;
  }

  .icono-principal {
    width: 80px;
    height: 80px;
  }
  .icono-principal img {
    width: 35px;
  }
  .img-trastos {
    width: 40px !important; 
  }
  .icono-principal span {
    font-size: 0.75rem;
  }

  .sub-burbujas {
    top: 85px; 
    gap: 8px;
    padding: 5px;
  }
  .burbuja {
    width: 45px;
    height: 45px;
  }
  .burbuja img {
    width: 25px;
  }
  .burbuja span {
    font-size: 0.7rem;
  }
}
</style>