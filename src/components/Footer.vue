<template>
  <footer id="footer" v-bind:class="!darkTheme ? 'light-theme' : 'dark-theme'">
    <div class="footContent">
      &#169; 2021 Simone Franza
    </div>
  </footer>
</template>

<script>
export default {
  props: {
    darkTheme: {
      required: true,
      type: Boolean
    }
  }
}
</script>

<style scoped>
#footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 2.5rem;            /* Footer height */
}

.light-theme {
  color: #2c3e50;
  background-color: #d0d0d0;
}
.dark-theme {
  background-color: #1a1a1a;
  color: #f8f1f1;
}

.footContent {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-weight: bold;
}
</style>
