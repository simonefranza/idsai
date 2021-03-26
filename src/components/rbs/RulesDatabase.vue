<template>
  <b-card class="dataCard" v-bind:bg-variant="!darkTheme ? 'light' : 'dark'" v-bind:text-variant="!darkTheme ? '' : 'white'">
    <b-card-text>
      <p class="dataTitle">Facts</p>
      <span v-for="(fact, index) in currentFacts" :key="fact"  
            :class="{'highlightRowDark' : index === hoveredFact && darkTheme, 'highlightRowLight' : index  === hoveredFact && !darkTheme}"
            @mouseover="hoveredFact = index" @mouseleave="hoveredFact = -1" class="flexSpan">
        <span>
          <span :class="{'dataTitle' : fact.localeCompare(mapFrom.trim()) ===0}">
            {{fact}}</span>
        </span>
        <span>
          <b-icon :class="['cyclesIconRight', 'iconEnabled', darkTheme ? 'iconDark' : 'iconLight']"
                                                                            icon="x-circle" aria-hidden="true" @click="deleteFact(index)" v-if="index === hoveredFact"></b-icon>
          <br/>
        </span>
      </span>
      <br/>
      <p class="dataTitle">Rules</p>
      <span v-for="(rule, index) in rules" :key ="rule.id" 
            :class="{'boldElement' : index+1 == ruleHovered, 'highlightRowDark' : index  === hoveredRule && darkTheme, 'highlightRowLight' : index === hoveredRule && !darkTheme}"
            @mouseover="hoveredRule = index" @mouseleave="hoveredRule = -1" class="flexSpan">
        <span>
          <span>R{{rule.id}}: </span> 
          <span v-for="(ant,index) in rule.ant" :key="ant"><span :class="{'dataTitle' : ant.localeCompare(mapFrom.trim()) ===0}">{{ant}}</span><span v-if="index !== rule.ant.length - 1"> & </span>
          </span>
          <span> → </span>
          <span :class="{'dataTitle' : rule.cons.localeCompare(mapFrom.trim()) ===0}">{{rule.cons}}</span><br/>
        </span><span>
          <b-icon :class="['cyclesIconRight', 'iconEnabled', darkTheme ? 'iconDark' : 'iconLight']"
                  icon="x-circle" aria-hidden="true" @click="deleteRule(index)" v-if="index === hoveredRule"></b-icon>
        </span>
      </span>
    </b-card-text>
  </b-card>
</template>

<script>
export default {
  data() {
    return {
      hoveredRule : false,
      hoveredFact : false,
    }
  },
  props: {
    currentFacts : {required: true},
    rules : {required: true},
    mapFrom : {required: true},
    mapTo : {required: true},
    ruleHovered : {required: true},
  },
  computed: {
    darkTheme() {
      return this.$store.state.darkTheme;
    }
  },
  methods: {
    deleteFact(index) {
      this.$emit('deleteFact', index);
    },
    deleteRule(index) {
      this.$emit('deleteRule', index);
    }
  }
  
}
</script>

<style lang="scss" scoped>
.flexSpan{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1px 5px 1px 0;
}
.dataCard {
  text-align: left;
}
.dataTitle {
  font-weight: bold;
}
.highlightRowDark {
  background: #1b1b1b;
}
.highlightRowLight{
  background: #eae7e7;
}
</style>
