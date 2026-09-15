<script setup>
import DefaultTheme from "vitepress/theme";
import DiagramModal from "./DiagramModal.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #layout-bottom>
      <DiagramModal />
    </template>
  </Layout>
</template>
