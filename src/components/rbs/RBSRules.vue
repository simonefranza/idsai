<template>
  <span :class="{'db-block' : !isWideDevice ,
                'db-block-dark' : darkTheme,
                'db-block-light' : !darkTheme,
                   'db-block-wider' : !isWideDevice && isWiderThanHigher,
                   'db-block-higher' : !isWideDevice && !isWiderThanHigher}">
    <p class="dataTitle">Rules</p>
    <div :class="[!isWideDevice ? 'db-list' : '',
                   isWiderThanHigher ? 'db-list-wider' : 'db-list-higher']">
      <span v-for="(rule, index) in rules" 
            :key ="rule.id" 
            :class="{'boldElement' : index+1 == ruleHovered,
                    'highlightRowDark' : index  === hoveredRule && darkTheme,
                    'highlightRowLight' : index === hoveredRule && !darkTheme}"
            @mouseover="hoveredRule = index"
            @mouseleave="hoveredRule = -1"
            class="flexSpan">
        <span>
          <span>R{{rule.id}}: </span> 
          <span v-for="(ant,index) in rule.ant"
                :key="ant">
            <span :class="{'dataTitle' : ant.localeCompare(mapFrom.trim()) ===0}">
              {{ant}}
            </span>
            <span v-if="index !== rule.ant.length - 1">&</span>
          </span>
          <span> → </span>
          <span :class="{'dataTitle' : rule.cons.localeCompare(mapFrom.trim()) ===0}">{{rule.cons}}</span>
          <br/>
        </span>
        <span>
          <b-icon :class="['cyclesIconRight', 
                           'iconEnabled', 
                           darkTheme ? 'iconDark' : 'iconLight']"
                  icon="x-circle"
                  aria-hidden="true"
                  @click="deleteRule(index)"
                  v-if="index === hoveredRule">
          </b-icon>
        </span>
      </span>
    </div>
  </span>
</template>

<script>
export default {
  data() {
    return {
      hoveredRule : false,
    }
  },
  props: {
    rules : {required: true },
    ruleHovered : {required: true },
    mapFrom : {required: true },
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
    }
  },
  methods: {
    deleteRule(index) {
      this.$emit('deleteRule', index);
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_rbs_db_shared.scss';
</style>
