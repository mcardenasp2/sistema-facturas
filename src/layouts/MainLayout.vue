<template>
  <div class="app-container">
    <!-- Componente de Sidebar -->
    <Sidebar />

    <div class="main-wrapper">
      <!-- Componente de Navbar -->
      <Navbar />

      <!-- Área de Contenido Principal -->
      <main class="content">
        <!-- El slot permite inyectar cualquier vista (View) aquí dentro -->
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/layout/Sidebar.vue'
import Navbar from '../components/layout/Navbar.vue'
</script>
