<template>
  <div class="grupo-factura">
    <!-- Cabecera del Grupo -->
    <div class="grupo-header">
      <div class="header-left">
        <span class="grupo-index">{{ index + 1 }}</span>
        
        <select v-if="grupo.tipo !== 'agua'" v-model="grupo.rubroId" class="rubro-select" @change="limpiarLineas">
          <option value="">-- Seleccione un Rubro --</option>
          <option v-for="r in maestroRubros" :key="r.codigo" :value="r.codigo">{{ r.nombre }}</option>
        </select>
        
        <div v-else class="rubro-locked">
           <i class='bx bx-water'></i> MATERIALES - CONSUMO DE AGUA (PRECARGADO)
        </div>
      </div>
      <div class="header-right">
        <button class="btn btn-outline-red btn-sm" @click="intentarEliminarGrupo"><i class='bx bx-trash'></i> Eliminar</button>
      </div>
    </div>

    <!-- Títulos de Columnas (estilo tabla plana) - SOLO MODO ESTÁNDAR -->
    <div class="column-headers" v-if="grupo.rubroId && grupo.tipo !== 'agua'">
      <div class="col-id text-center">#</div>
      <div class="col-labor">LABOR</div>
      <div class="col-detalle">LABOR DETALLE</div>
      <div class="col-fecha">FECHA</div>
      <div class="col-semana text-center">SEM</div>
      <div class="col-lote">LOTE</div>
      <div class="col-cant text-right">CANT</div>
      <div class="col-metrica text-center">MET</div>
      <div class="col-vunit text-right">V.UNIT</div>
      <div class="col-total text-right">TOTAL</div>
      <div class="col-acciones text-center"></div>
    </div>

    <!-- Líneas del Grupo - SOLO MODO ESTÁNDAR -->
    <div class="grupo-body" v-if="grupo.rubroId && grupo.tipo !== 'agua'">
      <LineaDetalle 
        v-for="(linea, idx) in grupo.lineas" 
        :key="linea.id"
        v-model="grupo.lineas[idx]"
        :index="idx"
        :rubroId="grupo.rubroId"
        @eliminar="eliminarLinea"
      />
      <div class="add-line-container">
        <button class="btn btn-text" @click="agregarLinea"><i class='bx bx-plus'></i> Agregar Línea</button>
      </div>
    </div>

    <!-- MODO ESPECIAL MATERIALES (AGUA) -->
    <GrupoAgua v-if="grupo.tipo === 'agua'" @updateTotal="setTotalAgua" />

    <!-- Pie del Grupo (Validación y Subtotales) -->
    <div class="grupo-footer" v-if="grupo.rubroId">
      <div class="subtotal-container">
        <span class="subtotal-label">Subtotal Grupo {{ index + 1 }}</span>
        <span class="subtotal-value">${{ subtotal.toFixed(2) }}</span>
      </div>
    </div>

    <div v-if="!grupo.rubroId" class="empty-state">
      Selecciona un rubro en el selector de arriba para comenzar a añadir líneas.
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { maestroRubros } from '../../data/mockData'
import LineaDetalle from './LineaDetalle.vue'
import GrupoAgua from './GrupoAgua.vue'

const props = defineProps(['modelValue', 'index'])
const emit = defineEmits(['update:modelValue', 'eliminar'])

const grupo = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

let lineIdCounter = 0

const agregarLinea = () => {
  grupo.value.lineas.push({
    id: ++lineIdCounter,
    laborId: '',
    laborDetalle: '',
    fecha: '',
    semana: '-',
    lote: '',
    metrica: '',
    cantidad: 0,
    valorUnitario: 0,
    aplicaIva: false,
    subtotal: 0,
    valorIva: 0,
    total: 0,
    archivoAdjutando: false,
    intervalos: [{ inicio: '', fin: '' }]
  })
}

const limpiarLineas = () => {
  grupo.value.lineas = []
  if (grupo.value.rubroId && grupo.value.tipo !== 'agua') {
     agregarLinea() // Agregar una línea por defecto
  }
}

const eliminarLinea = (idx) => {
  grupo.value.lineas.splice(idx, 1)
}

const totalEspecialAgua = ref(0)
const setTotalAgua = (total) => {
  totalEspecialAgua.value = total
  // Truco para que la vista padre (NuevaFacturaView) calcule el Gran Total correctamente
  if (grupo.value.lineas.length === 0) {
    grupo.value.lineas.push({ total: total })
  } else {
    grupo.value.lineas[0].total = total
  }
}

const subtotal = computed(() => {
  if (grupo.value.tipo === 'agua') return totalEspecialAgua.value
  return grupo.value.lineas.reduce((acc, linea) => acc + (linea.total || 0), 0)
})

const intentarEliminarGrupo = () => {
  if (confirm("¿Estás seguro de que deseas eliminar TODO este grupo?")) {
    emit('eliminar', props.index)
  }
}
</script>

<style scoped>
.grupo-factura {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 25px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}
.grupo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 8px 8px 0 0;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}
.grupo-index {
  background-color: #198754;
  color: white;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-weight: bold;
  font-size: 12px;
}
.rubro-select {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  min-width: 250px;
  background-color: white;
}
.rubro-locked {
  background-color: #e0f2fe;
  color: #0369a1;
  padding: 6px 15px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}
.column-headers {
  display: flex;
  padding: 10px 20px;
  background-color: #f1f3f5;
  border-bottom: 1px solid #e9ecef;
  font-size: 10px;
  font-weight: 700;
  color: #868e96;
  gap: 10px;
}
.grupo-body {
  padding: 0 20px 15px 20px;
}
.add-line-container {
  padding-top: 15px;
}
.btn-text {
  background: none;
  border: none;
  color: #0056b3;
  font-weight: 600;
  cursor: pointer;
  padding: 5px 0;
  font-size: 13px;
}
.btn-text:hover {
  text-decoration: underline;
}
.btn-outline-red {
  background: white;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 11px;
  cursor: pointer;
  font-weight: bold;
}
.btn-outline-red:hover {
  background: #dc3545;
  color: white;
}
.grupo-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 12px 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  border-radius: 0 0 8px 8px;
}
.validador-container {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #495057;
  font-weight: bold;
}
.validador-select {
  padding: 4px 8px;
  border: 1px solid #dc3545;
  border-radius: 4px;
  color: #495057;
}
.subtotal-container {
  display: flex;
  align-items: center;
  gap: 15px;
}
.subtotal-label {
  font-weight: 600;
  color: #6c757d;
  font-size: 12px;
}
.subtotal-value {
  font-size: 16px;
  font-weight: 700;
  color: #495057;
}
.empty-state {
  padding: 30px;
  text-align: center;
  color: #adb5bd;
  font-style: italic;
  font-size: 13px;
}

/* Grid columns for alignment */
.col-id { width: 3%; }
.col-labor { width: 18%; }
.col-detalle { width: 18%; }
.col-fecha { width: 8%; }
.col-semana { width: 4%; }
.col-lote { width: 8%; }
.col-cant { width: 8%; }
.col-metrica { width: 5%; }
.col-vunit { width: 10%; }
.col-total { width: 11%; }
.col-acciones { width: 7%; }

.text-center { text-align: center; }
.text-right { text-align: right; }
</style>
