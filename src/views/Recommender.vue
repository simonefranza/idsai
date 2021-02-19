<template>
  <div class="RecSys">

    <ReccSys v-bind:dark-theme="darkTheme"/>
  </div>
</template>

<script>
// @ is an alias to /src
import ReccSys from '@/components/ReccSys.vue'

export default {
  name: 'RecSys',
  props: {
    darkTheme: {
      type: Boolean,
      required: true
    }
  },
  components: {
    ReccSys
  }
}
</script>
