import { ref } from 'vue'

// Estado global reactivo para simular la sesión/rol del usuario
const currentRole = ref('admin')

export function useRole() {
  return {
    currentRole
  }
}
