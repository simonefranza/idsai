<template>
  <b-table striped 
           hover 
           :items="cycles[cycleNum]" 
           :dark="darkTheme" 
           @row-hovered="rowHovered" 
           @row-unhovered="rowUnhovered"
           v-if="isWideDevice && cycleNum >= 0">
    <template #cell(added_facts)="row">
      <span :class="{'dataTitle' : row.value.localeCompare(mapFrom.trim()) === 0}">
        {{row.value}}
      </span>
    </template>
  </b-table>
   <div style="height:100%"  v-else-if="!isWideDevice">
     <h4>Forward Chaining</h4>
    <div class="table-header">
      <p class="dataTitle">Cycle<span v-if="cycles.length != 1">s</span> ({{cycles.length}})</p>
      <p class="dataTitle">Rules</p>
      <p class="dataTitle">Facts</p>
    </div>
    <hr :class="['solid', darkTheme ? 'hr-dark' : 'hr-light']" />
    <div class="table-rows">
      <div v-for="(el, index) in cycles[cycleNum]" :key="index">
        <br v-if="index && el.cycle"/>
        <div class="fwd-chain-row">
          <div class="fwd-chain-row-entry">{{el.cycle || ' '}}</div>
          <div class="fwd-chain-row-entry">{{el.fired_rules || ' '}}</div>
          <div class="fwd-chain-row-entry">{{el.added_facts || ' '}}</div>
        </div>
      </div>
    </div>
    <span class="button-container">
      <div :class="['mobile-btn', 
        darkTheme ? 'mobile-btn-dark' : 'mobile-btn-light', 
        decreaseButtonDisabled ? 'iconDisabled' : 'iconEnabled']" 
        @click="showLessCycles" >
        Remove Cycle
      </div>

      <div :class="['mobile-btn', 
        darkTheme ? 'mobile-btn-dark' : 'mobile-btn-light',
        increaseCycleDisabled ? 'iconDisabled' : 'iconEnabled']"
        @click="showMoreCycles">
        Add Cycle
      </div>

    </span>
    </div>
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
    },
    isWideDevice() {
      return this.$store.state.isWideDevice;
    },
    isWiderThanHigher() {
      return this.$store.state.isWiderThanHigher;
    },
    decreaseButtonDisabled: function() {
      return this.cycleNum === -1;
    },
    increaseCycleDisabled: function() {
      return this.cycleNum === this.cycles.length - 1;
    },
  },
  methods: {
    rowUnhovered() {
      this.$emit('rowUnhovered');
    },
    rowHovered(item) {
      this.$emit('rowHovered', item);
    },
    showMoreCycles() {
      if(this.cycleNum === this.cycles.length - 1)
        return;
      this.$emit('increaseCyclesNum');
    },
    showLessCycles() {
      if(this.cycleNum === -1)
        return;
      this.$emit('decreaseCyclesNum');
    },
  }
  
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_rbs_db_shared.scss';
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.fwd-chain-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  text-align: center;
  &-entry {
    width: 100%;
  }
}
.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: .7em;
}
.mobile-btn {
  border-radius: 2em;
  width: calc(50% - .5em);
  height: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  &-dark {
    border: 1px solid $secondary-dark;
    color: $secondary-dark;
  }
  &-light {
    border: 1px solid $vue-primary;
    color: $vue-primary;
  }
}
.table-rows {
  height: calc(100% - 8.4em);
  overflow-y: auto;
  position: relative;
}
</style>
