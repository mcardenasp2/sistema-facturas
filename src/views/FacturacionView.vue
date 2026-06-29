<template>
  <div>
    <div class="breadcrumb">
      INICIO / PROCESOS / FACTURACION
    </div>

    <div class="card">
      <div class="card-header">
        <h2>LISTADO DE FACTURAS</h2>
        <div class="actions">
          <!-- Los botones de la cabecera aparecen según el ROL global -->
          <button class="btn btn-green" v-if="currentRole === 'admin' || currentRole === 'approver'" @click="$router.push('/facturacion/nueva')">+ NUEVA FACTURA</button>
          <button class="btn btn-red" v-if="currentRole === 'admin'">∅ ELIMINAR FACTURA</button>
          <button class="btn btn-blue">⎙ GENERAR REPORTE</button>
        </div>
      </div>
      
      <div class="filters">
         <div class="filter-group">
            <label>ESTADO:</label>
            <select><option>Sin filtro</option></select>
         </div>
         <div class="filter-group">
            <label>PROVEEDOR:</label>
            <select><option>Sin filtro</option></select>
         </div>
         <div class="search-box">
            <input type="text" placeholder="Buscar...">
            <button class="btn-search">🔍</button>
         </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Nº FACTURA PROVEEDOR</th>
            <th>VERIFICADO</th>
            <th>PROVEEDOR</th>
            <th>ESTADO</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="factura in facturas" :key="factura.id">
            <td>{{ factura.numero }}</td>
            <td>
               <span v-if="factura.verificado" class="badge badge-green">SI</span>
               <span v-else class="badge badge-red">NO</span>
            </td>
            <td>{{ factura.proveedor }}</td>
            <td>
              <span :class="'status-badge status-' + factura.estadoId">{{ factura.estado }}</span>
            </td>
            <td>
               <!-- Las acciones de cada fila cambian según el ROL -->
               <button class="btn-icon btn-blue" title="Editar" v-if="currentRole === 'admin' || currentRole === 'approver'">📝</button>
               <button class="btn-icon btn-red" title="Eliminar" v-if="currentRole === 'admin'">✖</button>
               <button class="btn-icon btn-gray" title="Ver detalles" v-if="currentRole === 'viewer'">👁</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="pagination">
         <span>TOTAL DE REGISTROS: {{ facturas.length }}</span>
         <div class="page-controls">
            PÁGINA: <select><option>1</option></select>
            <button>«</button>
            <button class="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <button>»</button>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRole } from '../composables/useRole'

// Obtenemos el ROL global desde el composable
const { currentRole } = useRole()

// Datos dinámicos de las facturas (simulados)
const facturas = ref([
  { id: 1, numero: 'FAC-001-0941151789', verificado: false, proveedor: 'ALVARADO CATUTE BRYAM JAHIR', estado: 'Borrador', estadoId: 'borrador' },
  { id: 2, numero: 'FAC-002-0923604391', verificado: true, proveedor: 'ALVARADO CHILA EMMA KARINA', estado: 'APROBADO', estadoId: 'aprobado' },
  { id: 3, numero: 'FAC-003-0954286787', verificado: false, proveedor: 'ALVARADO HIGUERA DANIEL ALEJANDRO', estado: 'ANULADO', estadoId: 'anulado' },
  { id: 4, numero: 'FAC-004-0921233235', verificado: true, proveedor: 'ALVARADO PIN DANNY MISAEL', estado: 'APROBADO', estadoId: 'aprobado' },
  { id: 5, numero: 'FAC-005-0916767791', verificado: false, proveedor: 'ALVARADO PONCE ELIAS MISAEL', estado: 'ESPERA DE APROBACION', estadoId: 'espera' },
  { id: 6, numero: 'FAC-006-0922443908', verificado: true, proveedor: 'ALVARADO PONCE OMAR FRANCISCO', estado: 'NO APROBADO', estadoId: 'no_aprobado' },
])
</script>
