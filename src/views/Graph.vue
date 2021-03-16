<template>
  <div>
    <div class="wordNet">
      <WordNetComp :dark-theme="darkTheme"/>
    </div>
  </div>
</template>

<script>
import WordNetComp from '@/components/WordNetComp.vue'

export default {
  name: 'Graph',
  props: {
    darkTheme: {
      type: Boolean,
      required: true
    }
  },
  components: {
    WordNetComp
  }
}
</script>
