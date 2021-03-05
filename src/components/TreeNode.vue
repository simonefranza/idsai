<template>
  <b-card 
       :class="['tree-node', data.nodeData.isTrue ? 'greenNode' : 'redNode', darkTheme ? '' : 'lightNode']" 
     v-bind:bg-variant="!darkTheme ? 'light' : 'dark'" v-bind:text-variant="!darkTheme ? '' : 'white'">
    <b-card-text>
      <span><span v-if="data.nodeData.isRoot">Goal:</span>
        <span v-else>Subgoal:</span> <span :class="{'newFact' : highlight.localeCompare(data.nodeData.goal) === 0}">{{data.nodeData.goal}}</span></span><br/>
      <span>Database: 
        <span v-for="(fact, index) in data.nodeData.facts" :key="fact">
          <span :class="{newFact : !facts.includes(fact) || highlight.localeCompare(fact) === 0}">{{fact}}</span><span v-if="index !== data.nodeData.facts.length - 1">, </span>
        </span>
      </span><br/>
      <span v-if="collapsed">[{{data.nodeData.children}} 
        <span v-if="data.nodeData.children === 1">child</span>
        <span v-else>children</span> collapsed]</span>
    </b-card-text>
  </b-card>
</template>

<script>
export default {
  props:
  {
    data: { required: true },
    darkTheme: {
      type: Boolean,
      required: true,
    },
    collapsed: {required: false},
    facts: {required: true},
    variables: {required: true},
    highlight: { required : true},
  },
}
</script>

<style scoped>
.tree-node {
  display: inline-block;
  text-align: left;
  line-height: 28px;
  width: 300px;
}
.greenNode {
  border: 3px solid #a0e7a0;
}

.redNode {
  border: 3px solid  #dd7777;
}
.newFact {
  font-weight: bold;
}

.lightNode {
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.2);
}
</style>
