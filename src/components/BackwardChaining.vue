<template>
  <div>
    {{backwardChain}}<br/><br/><br/>


    {{testData}}
  <vue-tree
    style="width: 2000px; height: 2000px;"
    :dataset="backwardChain"
    :config="treeConfig"
    :key="updateVar"
    v-if="Object.keys(backwardChain).length !== 0"
    >
    <template v-slot:node="{ node, collapsed }">
      <TreeNode :darkTheme="darkTheme" :data="node" :collapsed="collapsed" />
    </template>
  </vue-tree>
  </div>
</template>

<script>
import VueTree from '@ssthouse/vue-tree-chart';
import TreeNode from '@/components/TreeNode.vue';

export default {
  props: {
    facts: { required: true, },
    rules: { required: true, },
    mappings: {required: true},
    goal: {required: true },
    darkTheme: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    VueTree,
    TreeNode,
  },
  data() {
    return {
    sampleData: {
      value: '1',
      children: [
        { value: '2', children: [{ value: '4' }, { value: '5' }] },
        { value: '3' }
      ]
    },
    treeConfig: { nodeWidth: 300, nodeHeight: 200, levelHeight: 500 },
    treeNodes : 0,
    updateVar: false,

    }
  },
  computed: {
    backwardChain: function() {
      if(!this.goal)
        return {};
      let res = this.checkGoal(this.goal, [...this.facts], [this.goal]);
//      console.log(res);
      if(res === true || res === false)
      {
        return {value: this.goal, nodeData: {goal: this.goal, 
          facts: [...this.facts], isTrue: res}};
      }
      return res;
    },
    testData: function() {
      if(!this.goal)
        return {};
      let data = {};
//      data.value = '4';
//      data.test = [4,2,5,1,5];
//      data.children = [{value: '5'}, {value: '6', children: [{value: '8'}]}];
      data.value = this.goal;
      console.log(JSON.parse(JSON.stringify(data)));
      return JSON.parse(JSON.stringify(data));
    }
  },
  methods: {
    checkGoal(goal, facts, path)
    {
      this.updateVar = false;
      let data = {};
      if(facts.includes(goal))
      {
//        console.log(`the goal ${goal} is true`);
        return true;
      }
      let ants = this.findAnts(goal);
      if(!ants.length)
      {
//        console.log(`the goal ${goal} is false`);
        return false;
      }
      data.nodeData = {goal: goal};
//      console.log({goal: goal, ants: ants});
      for(let j = 0; j < ants.length; j++)
      {
        let antGroup = ants[j];
        let counter = 0;
        let groupData = [];
        let foundValidGroup = true;
        for(let i = 0; i < antGroup.length; i++)
        {
          let ant = antGroup[i];
          let newObj = {};
          if(path.includes(ant))
          {
            //isDeadlock
            foundValidGroup = false;
            break;
          }
          let res = this.checkGoal(ant, facts, [...path, ant]);
//          console.log({res:res});
          if(res === true || res === false)
          {
            newObj.goal = ant;
            newObj.facts = [];
            facts.forEach(fact => {
              newObj.facts.push(fact);
            });
            newObj.isTrue = res;
            if(!res)
              foundValidGroup = false;
            groupData.push({nodeData: newObj, value: ant});
            continue;
          }
          groupData.push(res);
          //TODO detect infinite loops
          if(counter++ > 20)
            break;
        }
//        console.log({groupD: groupData});
        if(foundValidGroup || j === ants.length - 1)
        {
          data.children = [...groupData];
          break;
        }
      }
      let tempFacts = [...facts];
//      console.log({children: data.children});
      let isOneGroupTrue = false;
      data.children.forEach(childrenFact => {
//        console.log({child: childrenFact});
        let areAllNeededTrue = true;

        if(!childrenFact.nodeData.isTrue)
          areAllNeededTrue = false;

        childrenFact.nodeData.facts.forEach(fact => {
          if(!tempFacts.includes(fact))
            tempFacts.push(fact);
        });
        if(areAllNeededTrue)
          isOneGroupTrue = true;
      });

      if(isOneGroupTrue)
      {
//        console.log(`added ${goal} to local facts`);
        tempFacts.push(goal);
      }
      data.nodeData.facts = [...tempFacts];
      data.nodeData.isTrue = isOneGroupTrue;
      data.value = goal; 
//      console.log({returningData: data});
      this.updateVar = true;
      return data;
    },
    findAnts(goal)
    {
      let ants = [];
      for(let i = 0; i < this.rules.length; i++)
      {
        let rule = this.rules[i];
        if(rule.cons.localeCompare(goal) === 0)
        {
          ants.push([...rule.ant]);
        }
      }
      return ants;
    }
  }
}
</script>

<style scoped>
</style>
