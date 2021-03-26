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

<style scoped lang="scss">
#footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 2.5rem;
  z-index: 1000;
}

.light-theme {
  color: $vue-primary;
  background-color: $bg-footer-light;
}
.dark-theme {
  background-color: $bg-footer-dark;
  color: $text-primary-dark;
}

.footContent {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-weight: bold;
}
</style>
