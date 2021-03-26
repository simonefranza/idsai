<template>
  <b-table striped 
           hover 
           :items="cycles[cycleNum]" 
           :dark="darkTheme" 
           @row-hovered="rowHovered" 
           @row-unhovered="rowUnhovered">
    <template #cell(added_facts)="row">
      <span :class="{'dataTitle' : row.value.localeCompare(mapFrom.trim()) === 0}">
        {{row.value}}
      </span>
    </template>
  </b-table>
</template>

<script>
export default {
  props: {
    cycles : {required: true},
    cycleNum : {required: true},
    mapFrom : {required: true},
  },
  computed: {
    darkTheme() {
      return this.$store.state.darkTheme;
    }
  },
  methods: {
    rowUnhovered() {
      this.$emit('rowUnhovered');
    },
    rowHovered(item) {
      this.$emit('rowHovered', item);
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>
