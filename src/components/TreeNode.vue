<template>
  <div class="tree-node" :style="{ border: collapsed ? '2px solid grey' : '' }" >
    <span>
      <span>Goal: {{data.nodeData.goal}}</span><br/>
      <span>Facts: {{data.nodeData.facts}}</span><br/>
      <span>Is true: {{data.nodeData.isTrue}}</span>
    </span>
  </div>
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
  },
  created() {
    console.log({data: this.data});
  }
}
</script>

<style scoped>
.tree-node {
  display: inline-block;
  width: 300px;
  height: 200px;
  background-color: antiquewhite;
  color: black;
  text-align: center;
  line-height: 28px;
}
</style>
