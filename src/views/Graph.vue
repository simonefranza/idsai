<template>
  <div>
    <div class="wordNet">
      <WordNetComp />
    </div>
  </div>
</template>

<script>
import WordNetComp from '@/components/WordNetComp.vue'

export default {
  name: 'Graph',
  components: {
    WordNetComp
  }
}
</script>
