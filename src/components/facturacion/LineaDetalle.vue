<template>
  <div class="linea-row">
    <div class="col-xs index-col">{{ index + 1 }}</div>
    <div class="col-md">
      <select v-model="linea.laborId" class="form-control" @change="onLaborChange">
        <option value="">-- Labor --</option>
        <option v-for="l in laboresFiltradas" :key="l.laborId" :value="l.laborId">{{ l.laborNombre }}</option>
      </select>
    </div>
    <div class="col-md">
      <select v-model="linea.laborDetalle" class="form-control" :disabled="!linea.laborId">
        <option value="">-- Detalle --</option>
        <option value="DET1">Detalle Específico 1</option>
        <option value="DET2">Detalle Específico 2</option>
      </select>
    </div>
    <div class="col-sm">
      <input type="date" v-model="linea.fecha" class="form-control" @change="calcularSemana" />
    </div>
    <div class="col-xs text-center">
      <span class="read-text">{{ linea.semana }}</span>
    </div>
    <div class="col-sm">
      <select v-model="linea.lote" class="form-control">
        <option value="">Lote...</option>
        <option value="LOTE-1A">Lote 1-A</option>
        <option value="LOTE-1B">Lote 1-B</option>
      </select>
    </div>
    <div class="col-sm">
      <div class="input-spinner">
        <input type="number" v-model.number="linea.cantidad" class="form-control text-right" @input="calcularTotal" min="0" />
      </div>
    </div>
    <div class="col-sm text-center">
      <span class="badge-blue">{{ linea.metrica || '-' }}</span>
    </div>
    <div class="col-sm">
      <input type="number" step="0.01" v-model.number="linea.valorUnitario" class="form-control text-right" @input="calcularTotal" min="0" />
    </div>
    <div class="col-sm">
      <input type="text" readonly :value="'$' + linea.total.toFixed(2)" class="form-control readonly-input text-right total-text" />
    </div>
    <div class="col-sm acciones-col">
      <button class="icon-btn btn-gray" @click="simularArchivo" title="Adjuntar Archivo"><i class='bx bx-paperclip' style="font-size: 16px;"></i></button>
      <button class="icon-btn btn-gray-outline" @click="intentarEliminar" title="Eliminar Línea"><i class='bx bx-trash' style="font-size: 16px;"></i></button>
    </div>
  </div>
  <div class="archivo-simulado" v-if="linea.archivoAdjutando">
    <small><i class='bx bx-check-double'></i> Comprobante_adjunto.pdf</small>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { labores } from '../../data/mockData'

const props = defineProps({
  modelValue: Object,
  index: Number,
  rubroId: String
})

const emit = defineEmits(['update:modelValue', 'eliminar'])

const linea = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const laboresFiltradas = computed(() => {
  if (!props.rubroId) return []
  return labores.filter(l => l.rubroId === props.rubroId)
})

const onLaborChange = () => {
  const labor = labores.find(l => l.laborId === linea.value.laborId && l.rubroId === props.rubroId)
  if (labor) {
    linea.value.metrica = labor.metrica
  } else {
    linea.value.metrica = ''
  }
}

const calcularSemana = () => {
  if (!linea.value.fecha) {
    linea.value.semana = '-'
    return
  }
  const date = new Date(linea.value.fecha)
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1))
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7)
  linea.value.semana = weekNo
}

const calcularTotal = () => {
  const cant = linea.value.cantidad || 0
  const vu = linea.value.valorUnitario || 0
  linea.value.total = cant * vu
}

const simularArchivo = () => {
  linea.value.archivoAdjutando = !linea.value.archivoAdjutando
}

const intentarEliminar = () => {
  emit('eliminar', props.index)
}
</script>

<style scoped>
.linea-row {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f3f5;
}
.linea-row:last-child {
  border-bottom: none;
}
.form-control {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 11px;
  color: #495057;
  height: 28px;
}
.form-control:focus {
  border-color: #10b981;
  outline: none;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}
.readonly-input {
  background-color: transparent;
  pointer-events: none;
  border: none;
}
.read-text {
  font-size: 11px;
  color: #adb5bd;
  font-weight: bold;
}
.total-text {
  font-weight: 700;
  color: #495057;
}
.text-center { text-align: center; }
.text-right { text-align: right; }

.index-col {
  color: #adb5bd;
  font-size: 11px;
  text-align: center;
}
.badge-blue {
  background-color: #e7f1ff;
  color: #0d6efd;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}
.acciones-col {
  display: flex;
  gap: 5px;
  justify-content: center;
}
.icon-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 3px;
  font-size: 12px;
}
.btn-gray { color: #6c757d; }
.btn-gray:hover { background-color: #e9ecef; }
.btn-gray-outline { color: #dc3545; }
.btn-gray-outline:hover { background-color: #ffe6e6; }

.archivo-simulado {
  padding-left: 30px;
  color: #198754;
  margin-top: -5px;
  margin-bottom: 10px;
}

/* Grid columns for alignment with Group header */
.col-xs { width: 3%; }
.col-sm { width: 9%; }
.col-md { width: 17%; }
</style>
