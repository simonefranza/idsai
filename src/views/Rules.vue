<template>
  <div class="rules">
    <RulesComp :darkTheme="darkTheme"/>
  </div>
</template>

<script>
import RulesComp from '@/components/RulesComp.vue'

export default {
  name: 'Rules',
  props: {
    darkTheme: {
      required: true,
      type:Boolean
    }
  },
  components: {
    RulesComp
  }
}
</script>
