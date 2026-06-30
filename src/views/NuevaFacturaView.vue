<template>
  <MainLayout>
    <div class="breadcrumb">
      <router-link to="/facturacion">INICIO</router-link> / PROCESOS / <router-link to="/facturacion">FACTURACION</router-link> / NUEVA
    </div>

    <!-- Header con botón flotante -->
    <div class="page-header">
      <div class="d-flex justify-content-between align-items-center">
        <h2>3. Detalle de Líneas de Pago</h2>
        <div class="d-flex align-items-center gap-3">
          <span class="group-count"><i class='bx bx-list-check' style="font-size: 18px; vertical-align: middle;"></i> {{ factura.grupos.length }} grupos</span>
          <button class="btn btn-outline-blue" @click="agregarGrupo('agua')"><i class='bx bx-water'></i> Cargar Consumo Agua</button>
          <button class="btn btn-outline" @click="agregarGrupo('estandar')"><i class='bx bx-plus'></i> Agregar Grupo</button>
        </div>
      </div>
    </div>

    <div class="card p-4">
      <!-- Cabecera Maestro -->
      <div class="cabecera-form mb-4">
        <div class="row">
          <div class="col">
            <label>FINCA:</label>
            <select v-model="factura.fincaId">
              <option value="">Seleccione una finca...</option>
              <option v-for="f in fincas" :key="f.id" :value="f.id">{{ f.nombre }}</option>
            </select>
          </div>
          <div class="col">
            <label>PROVEEDOR:</label>
            <select v-model="factura.proveedorId" @change="onProveedorChange">
              <option value="">Seleccione un proveedor...</option>
              <option v-for="p in proveedores" :key="p.id" :value="p.id">{{ p.nombre }}</option>
            </select>
          </div>
          <div class="col">
            <label>RUC PROVEEDOR:</label>
            <input type="text" readonly v-model="factura.ruc" class="readonly-input">
          </div>
          <div class="col">
            <label>FECHA REGISTRO:</label>
            <input type="date" v-model="factura.fechaRegistro" @change="calcularSemanaAnio">
          </div>
          <div class="col">
            <label>SEMANA/AÑO:</label>
            <input type="text" readonly v-model="factura.semanaAnio" class="readonly-input">
          </div>
        </div>
      </div>

      <!-- Iteración de Grupos -->
      <div class="grupos-container">
        <GrupoFactura 
          v-for="(grupo, index) in factura.grupos" 
          :key="grupo.id"
          v-model="factura.grupos[index]"
          :index="index"
          @eliminar="eliminarGrupo"
        />
        
        <div v-if="factura.grupos.length === 0" class="empty-grupos">
          No hay grupos de pago. Haz clic en <strong>+ Agregar Grupo</strong> en la parte superior derecha.
        </div>
      </div>
      
      <div class="gran-total-container" v-if="factura.grupos.length > 0">
        <div class="validador-global-container">
          <span class="icon"><i class='bx bx-shield-quarter' style="font-size: 18px; vertical-align: middle;"></i></span> Validado por * 
          <select v-model="factura.validadorId" class="validador-select">
            <option value="">-- Seleccione el validador --</option>
            <option value="1">Ing. Agrónomo</option>
            <option value="2">Jefe de Operaciones</option>
          </select>
        </div>
        <div class="gran-total-box">
          <span class="total-label">GRAN TOTAL FACTURA</span>
          <span class="total-amount">${{ granTotalFactura.toFixed(2) }}</span>
        </div>
      </div>

      <div class="d-flex justify-content-end mt-4">
        <button class="btn btn-green btn-lg" @click="guardar">GUARDAR FACTURA</button>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import GrupoFactura from '../components/facturacion/GrupoFactura.vue'
import { proveedores, fincas } from '../data/mockData'

const router = useRouter()

const factura = ref({
  fincaId: '',
  proveedorId: '',
  ruc: '',
  fechaRegistro: '',
  semanaAnio: '',
  validadorId: '',
  grupos: []
})

let grupoIdCounter = 0

const onProveedorChange = () => {
  const prov = proveedores.find(p => p.id === factura.value.proveedorId)
  if (prov) {
    factura.value.ruc = prov.ruc
  } else {
    factura.value.ruc = ''
  }
}

const calcularSemanaAnio = () => {
  if (!factura.value.fechaRegistro) return
  const date = new Date(factura.value.fechaRegistro)
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1))
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7)
  const year = d.getUTCFullYear()
  factura.value.semanaAnio = `Semana ${weekNo} - Año ${year}`
}

const agregarGrupo = (tipo = 'estandar') => {
  factura.value.grupos.push({
    id: ++grupoIdCounter,
    tipo: tipo,
    rubroId: tipo === 'agua' ? 'MAT' : '',
    lineas: []
  })
}

const eliminarGrupo = (index) => {
  factura.value.grupos.splice(index, 1)
}

const granTotalFactura = computed(() => {
  return factura.value.grupos.reduce((totalGlobal, grupo) => {
    const subtotalGrupo = grupo.lineas.reduce((acc, linea) => acc + (linea.total || 0), 0)
    return totalGlobal + subtotalGrupo
  }, 0)
})

const guardar = () => {
  alert('Factura guardada exitosamente con ' + factura.value.grupos.length + ' grupos por un total de $' + granTotalFactura.value.toFixed(2))
  router.push('/facturacion')
}
</script>

<style scoped>
.page-header {
  background-color: white;
  padding: 15px 20px;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #eee;
  margin-bottom: -1px;
  z-index: 10;
  position: relative;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.page-header h2 {
  font-size: 16px;
  color: #333;
  margin: 0;
}
.card {
  background-color: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.p-4 { padding: 20px; }
.mb-4 { margin-bottom: 20px; }
.mt-4 { margin-top: 20px; }
.d-flex { display: flex; }
.justify-content-between { justify-content: space-between; }
.justify-content-end { justify-content: flex-end; }
.align-items-center { align-items: center; }
.gap-3 { gap: 15px; }

.btn-outline {
  background: white;
  border: 1px solid #ced4da;
  padding: 6px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #495057;
  transition: all 0.2s;
}
.btn-outline:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}
.btn-outline-blue {
  background: #e0f2fe;
  border: 1px solid #7dd3fc;
  padding: 6px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #0284c7;
  transition: all 0.2s;
}
.btn-outline-blue:hover {
  background: #bae6fd;
  border-color: #38bdf8;
}
.group-count {
  color: #198754;
  font-size: 13px;
  font-weight: bold;
}
.btn-lg {
  padding: 10px 25px;
  font-size: 14px;
}

.cabecera-form {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}
.row {
  display: flex;
  gap: 15px;
}
.col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.col label {
  font-size: 11px;
  font-weight: bold;
  color: #555;
}
.col input, .col select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.readonly-input {
  background-color: #e9ecef;
  pointer-events: none;
  font-weight: bold;
  color: #495057;
}
.empty-grupos {
  text-align: center;
  padding: 50px;
  color: #6c757d;
  background-color: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  font-size: 14px;
}
.gran-total-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  background-color: #f8f9fa;
  padding: 15px 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}
.validador-global-container {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: bold;
  color: #495057;
}
.validador-select {
  padding: 8px 12px;
  border: 1px solid #dc3545;
  border-radius: 4px;
  color: #495057;
  font-weight: bold;
  min-width: 250px;
}
.gran-total-box {
  background-color: #198754;
  color: white;
  padding: 12px 25px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 6px rgba(40, 167, 69, 0.2);
}
.total-label {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.9;
}
.total-amount {
  font-size: 22px;
  font-weight: bold;
}
</style>
