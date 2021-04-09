<template>
  <div 
  @touchstart="startTouch"
  @touchmove="moveTouch"
  @touchend="endTouch">
  <vue-tree
    :style="{width: '2000px', height: '2000px', transform: 'scale(' + scaleFactor + ') ' +
    'translate(' + translateX + 'px,' + translateY + 'px)',
    transformOrigin: origin}"
    :dataset="backwardChain"
    :config="treeConfig"
    :key="updateVar"
    v-if="Object.keys(backwardChain).length !== 0"
    >
    <template v-slot:node="{ node, collapsed }">
      <TreeNode :data="node" :collapsed="collapsed" :facts="facts" :variables="variables" :highlight="highlight"/>
    </template>
  </vue-tree>
  </div>
</template>

<script>
import VueTree from '@ssthouse/vue-tree-chart';
import TreeNode from '@/components/rbs/TreeNode.vue';

export default {
  props: {
    facts: { required: true, },
    rules: { required: true, },
    variables: {required: true},
    goal: {required: true },
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
      touchesNum: null,
      initialX1: null,
      initialY1: null,
      initialX2: null,
      initialY2: null,
      currentDist: null,
      scaleFactor: 1,
      translateX: -800,
      translateY: -120,
      origin: 'top',
      isScale: null,
    }
  },
  computed: {
    darkTheme() {
      return this.$store.state.darkTheme;
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },
    windowHeight() {
      return this.$store.state.windowHeight;
    },
    isWideDevice() {
      return this.$store.state.isWideDevice;
    },
    isWiderThanHigher() {
      return this.$store.state.isWiderThanHigher;
    },
    isRotated() {
      return this.$store.state.isRotated;
    },
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
  },
  methods: {
    startTouch(e) {
      if(this.isWideDevice)
        return;
      this.touchesNum = e.touches.length;
      if(this.touchesNum !== 2)
        return;
      this.initialX1 = e.touches[0].clientX;
      this.initialY1 = e.touches[0].clientY;
      this.initialX2 = e.touches[1].clientX;
      this.initialY2 = e.touches[1].clientY;
      this.initialDist = (this.initialX1 - this.initialX2)**2 + 
        (this.initialY1 - this.initialY2)**2;
    },
    moveTouch(e) {
      if(this.isWideDevice)
        return;

      if(this.initialX1 === null || this.initialY1 === null ||
        this.initialX2 === null || this.initialY2 === null)
        return;

      let currentX1 = e.touches[0].clientX;
      let currentY1 = e.touches[0].clientY;
      let currentX2 = e.touches[1].clientX;
      let currentY2 = e.touches[1].clientY;
      let currentDist = (currentX1 - currentX2)**2 + 
        (currentY1 - currentY2)**2;

      let scale = currentDist / this.initialDist;
      scale = scale > 1 ? (scale - 1) * 0.5 + 1 : 
        1 - ((1 - scale) * 0.5);


      let vec1 = [currentX1 - this.initialX1, currentY1 - this.initialY1];
      let vec2 = [currentX2 - this.initialX2, currentY2 - this.initialY2];
      let dotProduct = vec1[0] * vec2[0] + vec1[1] * vec2[1];
      let vect1Len = Math.sqrt(vec1[0]**2 + vec1[1]**2);
      let vect2Len = Math.sqrt(vec2[0]**2 + vec2[1]**2);
      let cosine = dotProduct / (vect1Len * vect2Len); 
      let resVec = [vec1[0] + vec2[0], vec1[1] + vec2[1]];
      this.initialX1 = e.touches[0].clientX;
      this.initialY1 = e.touches[0].clientY;
      this.initialX2 = e.touches[1].clientX;
      this.initialY2 = e.touches[1].clientY;

      console.log(dotProduct, vect1Len, vect2Len, cosine, cosine > 1/Math.sqrt(2), currentDist - this.initialDist);
      this.initialDist = currentDist;
      this.isScale = !isNaN(cosine) && cosine <= 1 / Math.sqrt(2);

      //translate
      if(!this.isScale)
      {
        //        this.origin = 'center';
        this.translateX += resVec[0]*0.5;
        this.translateY += resVec[1]*0.5;
      }
      //scale
      else
      {
        //        this.origin = `${(e.touches[0].clientX + e.touches[1].clientX)}px ${(e.touches[0].clientY + e.touches[1].clientY)}px`;
        this.scaleFactor = this.scaleFactor * scale;
      }

      e.preventDefault();
    },
    endTouch(e) {
      this.touchesNum = null;
      this.initialX1 = null;
      this.initialY1 = null;
      this.initialX2 = null;
      this.initialY2 = null;
      this.initialDist = null;
      //      this.origin = 'center';
      this.isScale = null;
      e.preventDefault();
    },
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
