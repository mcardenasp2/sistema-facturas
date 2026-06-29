<template>
  <div class="agua-container">
    <div class="agua-info-banner">
      <i class='bx bx-info-circle' style="font-size: 16px; vertical-align: middle;"></i> 
      <strong>Vista Especial:</strong> Al seleccionar Materiales, la información precargada del sistema (Agua) se agrupa por <strong>Fincas</strong> automáticamente.
    </div>
    
    <div v-for="(finca, fIndex) in fincasAgrupadas" :key="finca.id" class="finca-section">
      <div class="finca-header">
        <i class='bx bx-map-alt' style="color: #10b981;"></i> {{ finca.nombre }}
      </div>
      
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
        <template v-for="semana in finca.semanas" :key="semana.numero">
          <div v-for="(linea, lIndex) in semana.lineas" :key="linea.id" class="linea-row">
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
          
          <!-- Subtotal por Semana -->
          <div class="semana-footer">
            <div class="semana-label"><i class='bx bx-calendar-week'></i> Subtotal Semana {{ semana.numero }}</div>
            <div class="semana-stats">
              <span class="semana-cant">Total Cantidad: <strong>{{ semana.totalCantidad }}</strong></span>
              <span class="semana-total">${{ semana.totalValor.toFixed(2) }}</span>
            </div>
          </div>
        </template>
      </div>
      
      <!-- Subtotal por Finca -->
      <div class="finca-footer">
        <div class="finca-subtotal-label">Subtotal {{ finca.nombre }}</div>
        <div class="finca-subtotal-value">${{ calcularSubtotalFinca(finca).toFixed(2) }}</div>
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
    lineas: [
      { id: 101, detalle: 'Consumo de Agua de Riego', fecha: '2026-06-25', semana: '26', cantidad: 1500, metrica: 'm³', valorUnitario: 0.15 },
      { id: 102, detalle: 'Consumo de Agua Potable', fecha: '2026-06-26', semana: '26', cantidad: 300, metrica: 'm³', valorUnitario: 0.50 }
    ]
  },
  {
    id: 2,
    nombre: 'FINCA B - SECTOR SUR',
    lineas: [
      { id: 201, detalle: 'Consumo de Agua de Riego', fecha: '2026-06-25', semana: '26', cantidad: 800, metrica: 'm³', valorUnitario: 0.15 },
      { id: 202, detalle: 'Consumo de Agua de Riego', fecha: '2026-06-27', semana: '26', cantidad: 1200, metrica: 'm³', valorUnitario: 0.15 },
      { id: 203, detalle: 'Mantenimiento Red de Agua', fecha: '2026-06-28', semana: '26', cantidad: 1, metrica: 'Servicio', valorUnitario: 150.00 },
      { id: 204, detalle: 'Consumo de Agua Potable', fecha: '2026-07-02', semana: '27', cantidad: 450, metrica: 'm³', valorUnitario: 0.50 }
    ]
  }
])

const fincasAgrupadas = computed(() => {
  return fincasMock.value.map(finca => {
    const semanasMap = {}
    finca.lineas.forEach(linea => {
      if (!semanasMap[linea.semana]) {
        semanasMap[linea.semana] = { numero: linea.semana, lineas: [], totalCantidad: 0, totalValor: 0 }
      }
      semanasMap[linea.semana].lineas.push(linea)
      semanasMap[linea.semana].totalCantidad += linea.cantidad
      semanasMap[linea.semana].totalValor += (linea.cantidad * linea.valorUnitario)
    })
    return {
      ...finca,
      semanas: Object.values(semanasMap).sort((a,b) => a.numero - b.numero)
    }
  })
})

const corregir = (fincaNombre, fecha) => {
  alert(`Simulando redirección... Preparando pantalla de CORRECCIÓN para la ${fincaNombre} con fecha ${fecha}.`);
}

const calcularSubtotalFinca = (finca) => {
  return finca.lineas.reduce((acc, linea) => acc + (linea.cantidad * linea.valorUnitario), 0)
}

onMounted(() => {
  // Calcular total simulado y emitirlo al padre para que cuadre el Gran Total
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
  align-items: center;
  gap: 8px;
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
  padding: 10px 20px;
  background-color: #f8fafc;
  border-top: 1px dashed #cbd5e1;
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

.semana-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px;
  background-color: #f1f5f9;
  border-top: 1px solid #e2e8f0;
  border-radius: 4px;
  margin: 5px 0 15px 0;
}
.semana-label {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 5px;
}
.semana-stats {
  display: flex;
  align-items: center;
  gap: 20px;
}
.semana-cant {
  font-size: 11px;
  color: #64748b;
}
.semana-cant strong {
  color: #0ea5e9;
  font-size: 12px;
}
.semana-total {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  background: white;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
}

/* Grid columns for alignment */
.col-xs { width: 4%; }
.col-sm { width: 10%; }
.col-lg { width: 24%; }
</style>
