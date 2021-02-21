<template>
  <div class="wordNet">
    <WordNetComp :dark-theme="darkTheme"/>
  </div>
</template>

<script>
import WordNetComp from '@/components/WordNetComp.vue'

export default {
  name: 'WordNet',
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
