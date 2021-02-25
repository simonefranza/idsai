<template>
  <b-card 
       :class="['tree-node', data.nodeData.isTrue ? 'greenNode' : 'redNode']" 
     v-bind:bg-variant="!darkTheme ? 'light' : 'dark'" v-bind:text-variant="!darkTheme ? '' : 'white'">
    <b-card-text>
      <span><span v-if="data.nodeData.isRoot">Goal:</span>
        <span v-else>Subgoal:</span> {{mappings.get(data.nodeData.goal)}}</span><br/>
      <span>Database: 
        <span v-for="(fact, index) in data.nodeData.facts" :key="fact">
          <span :class="{newFact : !facts.includes(fact)}">{{mappings.get(fact)}}</span><span v-if="index !== data.nodeData.facts.length - 1">, </span>
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
    mappings : {required: true},
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
  border: 1px solid #a0e7a0;
}

.redNode {
  border: 1px solid  #dd7777;
}
.newFact {
  font-weight: bold;
}
</style>
