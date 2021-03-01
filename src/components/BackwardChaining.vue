<template>
  <div>
  <vue-tree
    style="width: 2000px; height: 2000px;"
    :dataset="backwardChain"
    :config="treeConfig"
    :key="updateVar"
    v-if="Object.keys(backwardChain).length !== 0"
    >
    <template v-slot:node="{ node, collapsed }">
      <TreeNode :darkTheme="darkTheme" :data="node" :collapsed="collapsed" :facts="facts" :variables="variables" :highlight="highlight"/>
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
    variables: {required: true},
    goal: {required: true },
    darkTheme: {
      type: Boolean,
      required: true,
    },
    highlight : {required: true},
  },
  components: {
    VueTree,
    TreeNode,
  },
  data() {
    return {
    treeConfig: { nodeWidth: 325, nodeHeight: 200, levelHeight: 200},
    treeNodes : 0,
    updateVar: false,
    }
  },
  computed: {
    //TODO check A->B B->A
    backwardChain: function() {
      if(!this.goal)
        return {};
      let res = this.checkGoal(this.goal, [...this.facts], [this.goal]);
//      console.log(res);
      if(res === true || res === false)
      {
        return {value: this.goal, nodeData: {goal: this.goal, 
          facts: [...this.facts], isRoot: true, isTrue: res}};
      }
      res.nodeData.isRoot = true;
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
      return JSON.parse(JSON.stringify(data));
    }
  },
  methods: {
    checkGoal(goal, facts, path)
    {
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
        let counter = 0;
        let antGroup = ants[j];
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
            newObj.children = 0;
            newObj.isRoot = false;
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
          if(counter++ > 10)
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
      let areAllNeededTrue = true;
      data.children.forEach(childrenFact => {
//        console.log({child: childrenFact});

        if(!childrenFact.nodeData.isTrue)
          areAllNeededTrue = false;

        childrenFact.nodeData.facts.forEach(fact => {
          if(!tempFacts.includes(fact))
            tempFacts.push(fact);
        });
      });

      if(areAllNeededTrue)
      {
//        console.log(`added ${goal} to local facts`);
        tempFacts.push(goal);
      }
      data.nodeData.facts = [...tempFacts];
      data.nodeData.children = data.children.length;
      data.nodeData.isRoot = false;
      data.nodeData.isTrue = areAllNeededTrue;
      data.value = goal; 
//      console.log({returningData: data});
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
  },
  watch: {
    backwardChain: function() {
      this.updateVar = Math.random();
    },
  }
}
</script>

<style scoped>
</style>
