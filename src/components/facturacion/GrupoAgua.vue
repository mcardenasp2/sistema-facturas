<template>
  <div class="agua-container">
    <div class="agua-info-banner">
      <i class='bx bx-info-circle' style="font-size: 16px; vertical-align: middle;"></i> 
      <strong>Vista Especial:</strong> Al seleccionar Materiales, la información precargada del sistema (Agua) se agrupa por <strong>Fincas</strong> automáticamente.
    </div>
    
    <div v-for="(finca, fIndex) in fincasProcesadas" :key="finca.id" class="finca-section">
      <div class="finca-header" @click="toggleExpand(finca.id)">
        <div class="header-title-container">
          <div class="header-title">
            <i class='bx bx-map-alt' style="color: #10b981;"></i> {{ finca.nombre }}
          </div>
        </div>
        <div class="header-actions">
          <i :class="finca.expandido ? 'bx bx-chevron-up' : 'bx bx-chevron-down'"></i>
        </div>
      </div>
      
      <!-- Resumen Agrupado por Producto (Vista Colapsada) -->
      <div class="finca-resumen-agrupado" v-show="!finca.expandido">
        <div class="resumen-agrupado-headers">
          <div class="col-detalle"></div>
          <div class="col-cant">CANTIDAD</div>
          <div class="col-vunit">V. UNIT</div>
          <div class="col-total">TOTAL</div>
        </div>
        <div v-for="(grupo, gIndex) in finca.lineasGrouped" :key="gIndex" class="resumen-agrupado-row">
          <div class="col-detalle">
            <span class="read-text text-dark">{{ grupo.detalle }}</span>
          </div>
          <div class="col-cant">
            <span class="read-text">{{ grupo.cantidad }} unds</span>
          </div>
          <div class="col-vunit">
            <span class="read-text">${{ grupo.valorUnitario.toFixed(2) }}</span>
          </div>
          <div class="col-total">
            <span class="total-text">${{ (grupo.cantidad * grupo.valorUnitario).toFixed(2) }}</span>
          </div>
        </div>
        
        <div class="resumen-agrupado-row resumen-total-row">
          <div class="col-detalle text-right" style="font-weight: bold; color: #475569; padding-right: 15px;">TOTALES:</div>
          <div class="col-cant" style="font-weight: bold; color: #0ea5e9;">{{ calcularTotalCantidadFinca(finca) }} unds</div>
          <div class="col-vunit"></div>
          <div class="col-total" style="font-weight: bold; color: #10b981;">${{ calcularSubtotalFinca(finca).toFixed(2) }}</div>
        </div>
      </div>

      <div class="finca-collapsible" v-show="finca.expandido">
        <div class="column-headers">
          <div class="col-xs">#</div>
          <div class="col-lg">DETALLE DE MATERIAL</div>
          <div class="col-sm">FECHA</div>
          <div class="col-xs text-center">SEM</div>
          <div class="col-sm text-right">CANTIDAD</div>
          <div class="col-sm text-center">MÉTRICA</div>
          <div class="col-sm text-right">V. UNIT</div>
          <div class="col-sm text-right">TOTAL</div>
          <div class="col-sm text-center">ACCIONES</div>
        </div>
        
        <div class="finca-body">
          <div v-for="(linea, lIndex) in finca.lineas" :key="linea.id" class="linea-row">
            <div class="col-xs index-col">{{ lIndex + 1 }}</div>
            <div class="col-lg">
              <span class="read-text text-dark">{{ linea.detalle }}</span>
            </div>
            <div class="col-sm">
              <span class="read-text">{{ linea.fecha }}</span>
            </div>
            <div class="col-xs text-center">
              <span class="read-text">{{ linea.semana }}</span>
            </div>
            <div class="col-sm text-right">
              <span class="read-text">{{ linea.cantidad }}</span>
            </div>
            <div class="col-sm text-center">
              <span class="badge-blue">{{ linea.metrica }}</span>
            </div>
            <div class="col-sm text-right">
              <span class="read-text">${{ linea.valorUnitario.toFixed(2) }}</span>
            </div>
            <div class="col-sm text-right">
              <span class="total-text">${{ (linea.cantidad * linea.valorUnitario).toFixed(2) }}</span>
            </div>
            <div class="col-sm acciones-col">
              <button class="btn btn-warning btn-sm" @click="corregir(finca.nombre, linea.fecha)">
                <i class='bx bx-edit-alt'></i> Corregir
              </button>
            </div>
          </div>
        </div>

        <!-- Subtotal por Finca -->
        <div class="finca-footer">
          <div class="finca-subtotal-box">
            <div class="finca-subtotal-label">Subtotal {{ finca.nombre }}</div>
            <div class="finca-subtotal-value">${{ calcularSubtotalFinca(finca).toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['updateTotal'])

const fincasMock = ref([
  {
    id: 1,
    nombre: 'FINCA A - SECTOR NORTE',
    expandido: false,
    lineas: [
      { id: 101, detalle: 'BOTELLÓN 20L - AQUA PREMIUM (LIQUÍDO)', fecha: '2026-06-25', semana: '26', cantidad: 80, metrica: 'Unidad', valorUnitario: 1.217 },
      { id: 102, detalle: 'PACK x24 500ML - AQUA PREMIUM', fecha: '2026-06-26', semana: '26', cantidad: 25, metrica: 'Unidad', valorUnitario: 4.00 }
    ]
  },
  {
    id: 2,
    nombre: 'FINCA B - SECTOR SUR',
    expandido: false,
    lineas: [
      { id: 201, detalle: 'BOTELLÓN 20L - AQUA PREMIUM (LIQUÍDO)', fecha: '2026-06-25', semana: '26', cantidad: 100, metrica: 'Unidad', valorUnitario: 1.217 },
      { id: 202, detalle: 'BOTELLÓN 20L - AQUA PREMIUM (LIQUÍDO)', fecha: '2026-06-27', semana: '26', cantidad: 160, metrica: 'Unidad', valorUnitario: 1.217 },
      { id: 203, detalle: 'PACK x24 500ML - AQUA PREMIUM', fecha: '2026-06-28', semana: '26', cantidad: 10, metrica: 'Unidad', valorUnitario: 4.00 }
    ]
  },
  {
    id: 3,
    nombre: 'FINCA C - SECTOR ESTE',
    expandido: false,
    lineas: [
      { id: 301, detalle: 'BOTELLÓN 20L - AQUA PREMIUM (LIQUÍDO)', fecha: '2026-06-21', semana: '25', cantidad: 10, metrica: 'Unidad', valorUnitario: 1.217 },
      { id: 302, detalle: 'BOTELLÓN 20L - AQUA PREMIUM (LIQUÍDO)', fecha: '2026-06-23', semana: '25', cantidad: 15, metrica: 'Unidad', valorUnitario: 1.217 },
      { id: 303, detalle: 'BOTELLÓN 20L - AQUA PREMIUM (LIQUÍDO)', fecha: '2026-06-25', semana: '26', cantidad: 20, metrica: 'Unidad', valorUnitario: 1.217 },
      { id: 304, detalle: 'BOTELLÓN 20L - AQUA PREMIUM (LIQUÍDO)', fecha: '2026-06-28', semana: '26', cantidad: 25, metrica: 'Unidad', valorUnitario: 1.217 },
      { id: 305, detalle: 'BOTELLÓN 20L - AQUA PREMIUM (LIQUÍDO)', fecha: '2026-06-30', semana: '27', cantidad: 30, metrica: 'Unidad', valorUnitario: 1.217 }
    ]
  }
])

const corregir = (fincaNombre, fecha) => {
  alert(`Simulando redirección... Preparando pantalla de CORRECCIÓN para la ${fincaNombre} con fecha ${fecha}.`);
}

const fincasProcesadas = computed(() => {
  return fincasMock.value.map(finca => {
    const resumen = {}
    finca.lineas.forEach(linea => {
      if (!resumen[linea.detalle]) {
        resumen[linea.detalle] = { 
          id: linea.detalle, 
          detalle: linea.detalle, 
          cantidad: 0, 
          valorUnitario: linea.valorUnitario, 
          total: 0 
        }
      }
      resumen[linea.detalle].cantidad += linea.cantidad
      resumen[linea.detalle].total += (linea.cantidad * linea.valorUnitario)
    })
    return {
      ...finca,
      lineasGrouped: Object.values(resumen)
    }
  })
})

const toggleExpand = (fincaId) => {
  const f = fincasMock.value.find(x => x.id === fincaId)
  if (f) {
    f.expandido = !f.expandido
  }
}

const calcularSubtotalFinca = (finca) => {
  if (finca.lineasGrouped) {
    return finca.lineasGrouped.reduce((acc, l) => acc + l.total, 0)
  }
  return finca.lineas.reduce((acc, linea) => acc + (linea.cantidad * linea.valorUnitario), 0)
}

const calcularTotalCantidadFinca = (finca) => {
  if (finca.lineasGrouped) {
    return finca.lineasGrouped.reduce((acc, l) => acc + l.cantidad, 0)
  }
  return finca.lineas.reduce((acc, linea) => acc + linea.cantidad, 0)
}

onMounted(() => {
  let totalAgua = 0;
  fincasMock.value.forEach(f => {
    f.lineas.forEach(l => {
      totalAgua += (l.cantidad * l.valorUnitario);
    })
  })
  emit('updateTotal', totalAgua);
})
</script>

<style scoped>
.agua-container {
  padding: 0 0 15px 0;
}
.agua-info-banner {
  background-color: #e7f1ff;
  color: #052c65;
  padding: 12px 20px;
  font-size: 13px;
  border-bottom: 1px solid #b8daff;
}
.finca-section {
  margin-top: 0;
}
.finca-header {
  background-color: #f8f9fa;
  padding: 10px 20px;
  font-weight: 700;
  color: #1e293b;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
}
.finca-header:hover {
  background-color: #f1f5f9;
}
.header-title-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}
.header-actions i {
  font-size: 18px;
  color: #64748b;
}
.column-headers {
  display: flex;
  padding: 8px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #e9ecef;
  font-size: 10px;
  font-weight: 700;
  color: #868e96;
  gap: 10px;
}
.finca-body {
  padding: 0 20px;
}
.linea-row {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f1f3f5;
}
.linea-row:last-child {
  border-bottom: none;
}
.read-text {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}
.text-dark {
  color: #334155 !important;
  font-weight: 700 !important;
}
.total-text {
  font-weight: 700;
  color: #10b981;
}
.text-center { text-align: center; }
.text-right { text-align: right; }

.index-col {
  color: #adb5bd;
  font-size: 11px;
  text-align: center;
}
.badge-blue {
  background-color: #e0f2fe;
  color: #0284c7;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
}
.acciones-col {
  display: flex;
  gap: 5px;
  justify-content: center;
}
.btn-warning {
  background-color: #f59e0b;
  color: #ffffff;
  border: none;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-warning:hover {
  background-color: #d97706;
}
.btn-sm {
  padding: 5px 10px;
  font-size: 11px;
}

.finca-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8fafc;
  border-top: 1px dashed #cbd5e1;
  gap: 15px;
}
.finca-subtotal-box {
  display: flex;
  align-items: center;
  gap: 15px;
}
.finca-subtotal-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}
.finca-subtotal-value {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

/* Grid columns for alignment */
.col-xs { width: 4%; }
.col-sm { width: 10%; }
.col-lg { width: 24%; }

/* Grid columns for resumen agrupado */
.col-detalle { width: 55%; }
.col-cant { width: 15%; text-align: right; }
.col-vunit { width: 15%; text-align: right; }
.col-total { width: 15%; text-align: right; }

.finca-resumen-agrupado {
  margin: 15px 20px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 10px 15px;
}
.resumen-agrupado-headers {
  display: flex;
  padding: 8px 10px;
  background-color: #e2e8f0;
  font-size: 10px;
  font-weight: 700;
  color: #64748b;
  border-radius: 4px;
}
.resumen-agrupado-row {
  display: flex;
  padding: 10px 10px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
}
.resumen-agrupado-row:last-child {
  border-bottom: none;
}
.resumen-total-row {
  background-color: #f8fafc;
  border-top: 1px dashed #cbd5e1;
  border-bottom: none;
}

</style>
