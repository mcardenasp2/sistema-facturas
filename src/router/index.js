import { createRouter, createWebHistory } from 'vue-router'
import FacturacionView from '../views/FacturacionView.vue'
import NuevaFacturaView from '../views/NuevaFacturaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/facturacion'
    },
    {
      path: '/facturacion',
      name: 'facturacion',
      component: FacturacionView
    },
    {
      path: '/facturacion/nueva',
      name: 'nueva-factura',
      component: NuevaFacturaView
    }
  ]
})

export default router
