<template>
  <div class="rules">
    <InfoRetComp v-bind:dark-theme='darkTheme'/>
  </div>
</template>

<script>
import InfoRetComp from '@/components/InfoRetComp.vue'

export default {
  name: 'InfoRet',
  props: {
    darkTheme: {
      required: true,
      type:Boolean
    }
  },
  components: {
    InfoRetComp
  }
}
</script>
