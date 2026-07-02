<template>
  <div class="linea-row">
    <div class="col-id index-col">{{ index + 1 }}</div>
    <div class="col-labor">
      <select v-model="linea.laborId" class="form-control" @change="onLaborChange">
        <option value="">-- Labor --</option>
        <option v-for="l in laboresFiltradas" :key="l.id" :value="l.nombre">{{ l.nombre }}</option>
      </select>
    </div>
    <div class="col-detalle">
      <select v-model="linea.laborDetalle" class="form-control" :disabled="!linea.laborId" @change="onDetalleChange">
        <option value="">-- Detalle --</option>
        <option v-for="(d, idx) in detallesFiltrados" :key="idx" :value="d.nombre">{{ d.nombre }}</option>
      </select>
    </div>
    <div class="col-fecha">
      <input type="date" v-model="linea.fecha" class="form-control" @change="calcularSemana" />
    </div>
    <div class="col-semana text-center">
      <span class="read-text">{{ linea.semana }}</span>
    </div>
    <div class="col-lote">
      <select v-model="linea.lote" class="form-control">
        <option value="">Lote...</option>
        <option value="LOTE-1A">Lote 1-A</option>
        <option value="LOTE-1B">Lote 1-B</option>
      </select>
    </div>
    <div class="col-cant">
      <div class="input-spinner" v-if="rubroId !== 'MAQ'">
        <input type="number" v-model.number="linea.cantidad" class="form-control text-right" @input="calcularTotal" min="0" />
      </div>
      <div class="input-spinner" v-else>
        <input type="number" readonly :value="linea.cantidad" class="form-control text-right readonly-input" title="Calculado automáticamente por intervalos" />
      </div>
    </div>
    <div class="col-metrica text-center">
      <span class="badge-blue">{{ linea.metrica || '-' }}</span>
    </div>
    <div class="col-vunit">
      <input type="number" step="0.01" v-model.number="linea.valorUnitario" class="form-control text-right" @input="calcularTotal" min="0" />
    </div>
    <div class="col-total text-right">
      <input type="text" readonly :value="'$' + (linea.total || 0).toFixed(2)" class="form-control readonly-input text-right total-text" />
    </div>
    <div class="col-acciones acciones-col">
      <button class="icon-btn btn-gray" @click="simularArchivo" title="Adjuntar Archivo"><i class='bx bx-paperclip' style="font-size: 16px;"></i></button>
      <button class="icon-btn btn-gray-outline" @click="intentarEliminar" title="Eliminar Línea"><i class='bx bx-trash' style="font-size: 16px;"></i></button>
    </div>
  </div>

  <!-- SUB-FILA ESPECIAL PARA MAQUINARIA (INTERVALOS DE TIEMPO) -->
  <div class="maquinaria-horarios" v-if="rubroId === 'MAQ'">
    <div class="horarios-header"><i class='bx bx-time'></i> Intervalos de Trabajo (Calcula Cantidad de Horas Automáticamente)</div>
    <div class="horarios-list">
      <div class="horario-item" v-for="(h, idx) in (linea.intervalos || [])" :key="idx">
        <input type="time" v-model="h.inicio" class="form-control time-input" @change="calcularHorasMaquinaria" />
        <span class="horario-sep">a</span>
        <input type="time" v-model="h.fin" class="form-control time-input" @change="calcularHorasMaquinaria" />
        <button class="icon-btn btn-gray-outline ml-2" @click="removerIntervalo(idx)" title="Remover intervalo"><i class='bx bx-x'></i></button>
      </div>
    </div>
    <button class="btn-text add-time-btn" @click="agregarIntervalo">+ Añadir Intervalo</button>
  </div>
  <div class="archivo-simulado" v-if="linea.archivoAdjutando">
    <small><i class='bx bx-check-double'></i> Comprobante_adjunto.pdf</small>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { maestroRubros } from '../../data/mockData'

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
  const rubro = maestroRubros.find(r => r.codigo === props.rubroId)
  return rubro ? rubro.labores : []
})

const detallesFiltrados = computed(() => {
  if (!linea.value.laborId) return []
  const labor = laboresFiltradas.value.find(l => l.nombre === linea.value.laborId)
  return labor ? labor.detalles : []
})

const onLaborChange = () => {
  linea.value.laborDetalle = ''
  linea.value.metrica = ''
}

const onDetalleChange = () => {
  const detalle = detallesFiltrados.value.find(d => d.nombre === linea.value.laborDetalle)
  if (detalle) {
    linea.value.metrica = detalle.metrica
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

// LOGICA ESPECIAL DE MAQUINARIA
const agregarIntervalo = () => {
  if (!linea.value.intervalos) linea.value.intervalos = []
  linea.value.intervalos.push({ inicio: '', fin: '' })
}

const removerIntervalo = (idx) => {
  if (linea.value.intervalos && linea.value.intervalos.length > 0) {
    linea.value.intervalos.splice(idx, 1)
    calcularHorasMaquinaria()
  }
}

const calcularHorasMaquinaria = () => {
  if (props.rubroId !== 'MAQ') return
  let totalHoras = 0
  if (linea.value.intervalos) {
    linea.value.intervalos.forEach(h => {
      if (h.inicio && h.fin) {
        const [h1, m1] = h.inicio.split(':').map(Number)
        const [h2, m2] = h.fin.split(':').map(Number)
        let diff = (h2 * 60 + m2) - (h1 * 60 + m1)
        if (diff > 0) {
          totalHoras += diff / 60
        }
      }
    })
  }
  linea.value.cantidad = parseFloat(totalHoras.toFixed(2))
  calcularTotal()
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

/* Estilos de Maquinaria (Intervalos) */
.maquinaria-horarios {
  margin: 0 15px 15px 15px;
  padding: 12px;
  background-color: #f8f9fa;
  border-left: 3px solid #f59f00;
  border-radius: 4px;
}
.horarios-header {
  font-size: 11px;
  font-weight: bold;
  color: #495057;
  margin-bottom: 10px;
}
.horarios-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.horario-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.time-input {
  width: 110px;
}
.horario-sep {
  font-size: 12px;
  color: #6c757d;
}
.add-time-btn {
  margin-top: 10px;
  color: #f59f00;
  font-size: 12px;
  font-weight: bold;
  background: none;
  border: none;
  cursor: pointer;
}
.add-time-btn:hover {
  text-decoration: underline;
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
</style>
