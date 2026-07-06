<template>
  <div class="modal-overlay" v-if="show" @click.self="close">
    <div class="modal-content modal-lg">
      <div class="modal-header">
        <h3 class="modal-title">Detalles de Factura: {{ factura?.numero }}</h3>
        <button class="btn-close" @click="close">&times;</button>
      </div>
      
      <div class="modal-body">
        <div class="header-grid">
          <!-- Tarjeta 1: Proveedor -->
          <div class="header-card">
            <h5 class="card-title">Datos del Proveedor</h5>
            <div class="card-grid">
              <span class="label">RUC:</span> <span class="value">{{ facturaInfo.ruc }}</span>
              <span class="label">Nombre:</span> <span class="value">{{ facturaInfo.proveedor }}</span>
              <span class="label">Contacto:</span> <span class="value">{{ facturaInfo.contacto }}</span>
              <span class="label">F. Documento:</span> <span class="value">{{ facturaInfo.fechaDoc }}</span>
              <span class="label">F. Vencimiento:</span> <span class="value">{{ facturaInfo.fechaVenc }}</span>
              <span class="label">Estado:</span> <span class="value"><span class="badge badge-green">{{ factura?.estado }}</span></span>
            </div>
          </div>

          <!-- Tarjeta 2: Tributaria -->
          <div class="header-card">
            <h5 class="card-title">Información Tributaria y Comprobante</h5>
            <div class="card-grid">
              <span class="label">Localización:</span> <span class="value">{{ facturaInfo.localizacion }}</span>
              <span class="label">Sustento Trib.:</span> <span class="value">{{ facturaInfo.sustento }}</span>
              <span class="label">Tipo Comp.:</span> <span class="value">{{ facturaInfo.tipoComp }}</span>
              <span class="label">Establecimiento:</span> <span class="value">{{ facturaInfo.establecimiento }}</span>
              <span class="label">Punto Emisión:</span> <span class="value">{{ facturaInfo.ptoEmision }}</span>
              <span class="label">Autorización:</span> <span class="value break-all">{{ facturaInfo.autorizacion }}</span>
              <span class="label">Forma Pago:</span> 
              <span class="value">
                <select v-model="facturaInfo.formaPago" class="form-control select-sm">
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="TRANSFERENCIA">Transferencia</option>
                  <option value="CHEQUE">Cheque</option>
                </select>
              </span>
            </div>
          </div>
        </div>

        <h4 class="section-title">Líneas de Pago (Vista Contable)</h4>
        <div class="table-responsive">
          <table class="data-table small-table">
            <thead>
              <tr>
                <th>Número de Cuenta Contable</th>
                <th>Descripción de Cuenta contable</th>
                <th>Rubro</th>
                <th>Nombre del Rubro</th>
                <th>Labor SAP</th>
                <th>ID LABOR SAP</th>
                <th>Labor finca</th>
                <th>Cod. Finca</th>
                <th>Proyecto</th>
                <th class="text-center">IVA?</th>
                <th class="text-center">Ind. Imp.</th>
                <th class="text-center">Suj. Imp.</th>
                <th class="text-center">Suj. Ret.</th>
                <th class="text-right">CANT</th>
                <th class="text-right">V.UNIT</th>
                <th class="text-right">SUBT</th>
                <th class="text-right">V.IVA</th>
                <th class="text-right">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(linea, idx) in dummyLines" :key="idx">
                <td>{{ linea.cuenta }}</td>
                <td>{{ linea.descCuenta }}</td>
                <td>{{ linea.rubroCod }}</td>
                <td>{{ linea.rubroNombre }}</td>
                <td>{{ linea.laborSap }}</td>
                <td>{{ linea.idLaborSap }}</td>
                <td>{{ linea.laborFinca }}</td>
                <td class="text-center">{{ linea.codigoFinca }}</td>
                <td class="text-center">{{ linea.proyecto }}</td>
                <td class="text-center">
                  <input type="checkbox" v-model="linea.aplicaIva" class="iva-check" />
                </td>
                <td class="text-center">
                  <span class="badge badge-gray">{{ getIndicadorImpuesto(linea) }}</span>
                </td>
                <td class="text-center">
                  <span :class="linea.aplicaIva ? 'text-green bold' : 'text-gray'">{{ linea.aplicaIva ? 'SI' : 'NO' }}</span>
                </td>
                <td class="text-center">
                  <span :class="linea.aplicaIva ? 'text-green bold' : 'text-gray'">{{ linea.aplicaIva ? 'SI' : 'NO' }}</span>
                </td>
                <td class="text-right">{{ linea.cantidad }}</td>
                <td class="text-right">${{ linea.vUnit.toFixed(2) }}</td>
                <td class="text-right">${{ (linea.cantidad * linea.vUnit).toFixed(2) }}</td>
                <td class="text-right">
                  <span :class="{'text-red': linea.aplicaIva}">${{ (linea.aplicaIva ? (linea.cantidad * linea.vUnit * 0.15) : 0).toFixed(2) }}</span>
                </td>
                <td class="text-right bold">${{ (linea.cantidad * linea.vUnit * (linea.aplicaIva ? 1.15 : 1)).toFixed(2) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="17" class="text-right"><strong>GRAN TOTAL</strong></td>
                <td class="text-right"><strong>${{ granTotal.toFixed(2) }}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-outline" @click="close">Cerrar</button>
        <button class="btn btn-blue">⎙ Imprimir Detalles</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { maestroRubros, cuentasContables } from '../../data/mockData'

const props = defineProps({
  show: Boolean,
  factura: Object
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

const dummyLines = ref([])
const facturaInfo = ref({})

watch(() => props.show, (newVal) => {
  if (newVal && props.factura) {
    facturaInfo.value = {
      ruc: '0991234567001',
      proveedor: props.factura.proveedor,
      contacto: 'Ing. Carlos Mendoza',
      fechaDoc: '01/07/2026',
      fechaVenc: '15/07/2026',
      referencia: 'REF-' + Math.floor(Math.random() * 10000),
      localizacion: 'Guayaquil, Ecuador',
      sustento: 'Crédito Tributario para Declaración de IVA',
      tipoComp: 'Factura',
      establecimiento: '001',
      ptoEmision: '002',
      autorizacion: '1234567890123456789012345678901234567890123456789',
      formaPago: 'TRANSFERENCIA'
    }

    const maq = maestroRubros.find(r => r.codigo === 'MAQ')
    const moc = maestroRubros.find(r => r.codigo === 'MOC')
    
    const maqCuenta = cuentasContables['MAQ'] || { cuenta: '-', descripcion: '-' }
    const mocCuenta = cuentasContables['MOC'] || { cuenta: '-', descripcion: '-' }
    
    dummyLines.value = [
      {
        cuenta: maqCuenta.cuenta,
        descCuenta: maqCuenta.descripcion,
        rubroCod: maq.codigo,
        rubroNombre: maq.nombre,
        laborSap: maq.labores[0].nombre,
        idLaborSap: maq.labores[0].id,
        laborFinca: maq.labores[0].detalles[0].nombre,
        codigoFinca: 'F001',
        proyecto: '-',
        cantidad: 8.5,
        vUnit: 15.00,
        total: 8.5 * 15.00,
        aplicaIva: false
      },
      {
        cuenta: maqCuenta.cuenta,
        descCuenta: maqCuenta.descripcion,
        rubroCod: maq.codigo,
        rubroNombre: maq.nombre,
        laborSap: maq.labores[1].nombre,
        idLaborSap: maq.labores[1].id,
        laborFinca: maq.labores[1].detalles[1].nombre,
        codigoFinca: 'F001',
        proyecto: 'PRJ-ALFA',
        cantidad: 4,
        vUnit: 20.00,
        total: 4 * 20.00,
        aplicaIva: false
      },
      {
        cuenta: mocCuenta.cuenta,
        descCuenta: mocCuenta.descripcion,
        rubroCod: moc.codigo,
        rubroNombre: moc.nombre,
        laborSap: moc.labores[0].nombre,
        idLaborSap: moc.labores[0].id,
        laborFinca: moc.labores[0].detalles[0].nombre,
        codigoFinca: 'F002',
        proyecto: '-',
        cantidad: 10,
        vUnit: 25.00,
        total: 10 * 25.00,
        aplicaIva: false
      }
    ]
  }
})

const getIndicadorImpuesto = (linea) => {
  const isService = ['SER', 'MAQ', 'MOC'].includes(linea.rubroCod)
  if (linea.aplicaIva) {
    return isService ? 'IVACS15' : 'IVACB15'
  } else {
    return isService ? 'IVACS00' : 'IVACB00'
  }
}

const granTotal = computed(() => {
  return dummyLines.value.reduce((acc, linea) => {
    const sub = linea.cantidad * linea.vUnit;
    const iva = linea.aplicaIva ? (sub * 0.15) : 0;
    return acc + sub + iva;
  }, 0)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}
.modal-lg {
  max-width: 1000px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  background-color: #f8f9fa;
  border-radius: 8px 8px 0 0;
}
.modal-title {
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: bold;
}
.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #888;
}
.btn-close:hover {
  color: #333;
}
.modal-body {
  padding: 20px;
  overflow-y: auto;
}
.header-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}
.header-card {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
}
.card-title {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #495057;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 8px;
  text-transform: uppercase;
  font-weight: bold;
}
.card-grid {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 8px 10px;
  font-size: 11px;
  align-items: center;
}
.label {
  color: #6c757d;
  font-weight: bold;
}
.value {
  color: #212529;
}
.break-all {
  word-break: break-all;
}
.form-control {
  width: 100%;
  border: 1px solid #ced4da;
  border-radius: 4px;
}
.select-sm {
  height: 24px;
  padding: 2px 5px;
  font-size: 11px;
}
.section-title {
  font-size: 14px;
  color: #495057;
  border-bottom: 2px solid #0056b3;
  padding-bottom: 5px;
  margin-bottom: 15px;
}
.table-responsive {
  overflow-x: auto;
}
.small-table th, .small-table td {
  font-size: 11px;
  padding: 8px 6px;
  white-space: nowrap;
}
.text-right {
  text-align: right;
}
.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.btn-outline {
  background: white;
  border: 1px solid #ccc;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-outline:hover {
  background: #f8f9fa;
}
.btn-blue {
  background-color: #0d6efd;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-blue:hover {
  background-color: #0b5ed7;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table th, .data-table td {
  border: 1px solid #e0e0e0;
}
.data-table th {
  background-color: #f8f9fa;
  color: #495057;
}
.badge-green {
  background-color: #d1e7dd;
  color: #0f5132;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}
.badge-gray {
  background-color: #e9ecef;
  color: #495057;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
}
.text-center {
  text-align: center;
}
.text-green {
  color: #198754;
}
.text-gray {
  color: #6c757d;
}
.text-red {
  color: #dc3545;
}
.bold {
  font-weight: bold;
}
.iva-check {
  width: 14px;
  height: 14px;
  cursor: pointer;
}
</style>
