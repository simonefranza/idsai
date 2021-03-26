<template>
  <span>
    <p class="dataTitle">Facts</p>
    <span v-for="(fact, index) in currentFacts" :key="fact"  
          :class="{'highlightRowDark' : index === hoveredFact && darkTheme,
                    'highlightRowLight' : index  === hoveredFact && !darkTheme}"
          @mouseover="hoveredFact = index" 
          @mouseleave="hoveredFact = -1"
          class="flexSpan">
      <span>
        <span :class="{'dataTitle' : fact.localeCompare(mapFrom.trim()) ===0}">
          {{fact}}
        </span>
      </span>
      <span>
        <b-icon :class="['cyclesIconRight', 
                          'iconEnabled', 
                          darkTheme ? 'iconDark' : 'iconLight']"
          icon="x-circle" 
          aria-hidden="true"
          @click="deleteFact(index)"
          v-if="index === hoveredFact">
        </b-icon>
        <br/>
      </span>
    </span>
  </span>
</template>

<script>
export default {
  data() {
    return {
      hoveredFact : false,
    }
  },
  props: {
    currentFacts : { required: true },
    mapFrom : { required: true },
  },
  computed: {
    darkTheme() {
      return this.$store.state.darkTheme;
    },
  },
  methods: {
    deleteFact(index) {
      this.$emit('deleteFact', index);
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_rbs_db_shared.scss';
</style>
