<template>
  <header class="navbar">
    <div class="navbar-left">
      <button class="menu-toggle"><i class='bx bx-menu'></i></button>
      <span class="page-title">INICIO</span>
    </div>
    <div class="navbar-right">
      <!-- Selector de ROL (Demo interactiva) -->
      <div class="role-selector" title="Prueba cambiar el rol para ver cómo se adapta la UI">
        <label><i class='bx bx-user-circle'></i> ROL ACTIVO:</label>
        <select v-model="currentRole">
          <option value="admin">Administrador</option>
          <option value="approver">Aprobador</option>
          <option value="viewer">Solo Lectura</option>
        </select>
      </div>
      
      <button class="support-btn"><i class='bx bx-headphone'></i> SOPORTE</button>
      <button class="bell-btn" style="font-size: 16px;"><i class='bx bx-bell'></i></button>
      <div class="user-profile">
        <span class="avatar">M</span> MARCO CARDENAS <i class='bx bx-chevron-down'></i>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRole } from '../../composables/useRole'

const { currentRole } = useRole()
</script>
