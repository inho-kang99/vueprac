<script setup>
import TheWelcome from '../components/TheWelcome.vue'

const click = () => {
  console.log('click')
}

const msg = 'ddsaw'
</script>

<template>
  <main>
    <TheWelcome />
    <span @click="click()">{{ msg }}</span>
  </main>
</template>
