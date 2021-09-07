<template>
  <div 
  @touchstart="startTouch"
  @touchmove="moveTouch"
  @touchend="endTouch">
  <h4 style="text-align: center; position: relative; z-index: 100"
    v-if="!isWideDevice">Backward Chaining</h4>
  <span :class="{'floating-zoom' : true,
                 'zoom-block' : true,
                 'zoom-block-dark' : darkTheme,
                 'zoom-block-light' : !darkTheme}"
        v-if="Object.keys(backwardChain).length !== 0">
    <span class="h5 zoom-text">Zoom</span>
    <span class="zoom-icons"><b-icon :class="['cyclesIconLeft', 
                     'iconEnabled', 
                     darkTheme ? 'iconDark' : 'iconLight']"
            icon="dash-circle"
            aria-hidden="true"
            @click="zoomOut"></b-icon>
    <b-icon :class="['cyclesIconRight', 
                     'iconEnabled', 
                     darkTheme ? 'iconDark' : 'iconLight']"
            icon="plus-circle"
            aria-hidden="true"
            @click="zoomIn"></b-icon></span>
  </span>
  <vue-tree
    :style="{width: '2000px', height: '2000px', transform: 'scale(' + (isWideDevice ? 1 : scaleFactor) + ') ' +
    'translate(' + (isWideDevice ? 0 : translateX) + 'px,' + (isWideDevice ? 0 : translateY) + 'px)',
    transformOrigin: origin}"
    :dataset="backwardChain"
    :config="treeConfig"
    :key="updateVar"
    v-if="Object.keys(backwardChain).length !== 0"
    ref="tree"
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
      lastCenter: null,
      isScale: null,
    }
  },
  computed: {
    nodeWidth() {
      return 325*this.scaleFactor;
    },
    nodeHeight() {
      return 200 * this.scaleFactor;
    },
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
      if(!this.goal['node'])
        return {};
      let res = this.checkGoal(this.goal, [...this.facts], [this.goal['node']]);
      if(res === true || res === false)
      {
        return {value: this.goal['node'], nodeData: {goal: this.goal['node'], 
          facts: [...this.facts], isRoot: true, isTrue: res}};
      }
      res.nodeData.isRoot = true;
      return res;
    },
  },
  methods: {
    zoomIn() {
      this.$refs.tree.zoomIn();
    },
    zoomOut() {
      this.$refs.tree.zoomOut();
    },
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
      let currCenter = [(e.touches[0].clientX + e.touches[1].clientX)/2, 
        (e.touches[0].clientY + e.touches[1].clientY)/2 + this.translateY];
      this.translateX += currCenter[0] - this.lastCenter[0];
      this.translateY += currCenter[1] - this.lastCenter[1];
      this.lastCenter = currCenter;
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

      this.initialDist = currentDist;
      this.isScale = !isNaN(cosine) && cosine <= 1 / Math.sqrt(2);
      let currCenter = [(e.touches[0].clientX + e.touches[1].clientX)/2, 
        (e.touches[0].clientY + e.touches[1].clientY)/2 + this.translateY];
      this.origin = `${currCenter[0]}px ${currCenter[1]}px`;
      //translate
      //      if(!this.isScale)
      //      {
        //        this.origin = 'center';
        this.translateX += (resVec[0])*0.5;
        this.translateY += (resVec[1])*0.5;
      //      }
      //scale
    //      else
    //      {
        this.scaleFactor = this.scaleFactor * scale;
    //      }

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
    createGoalObject(goal, facts, childrenCount, isRoot, isTrue) {
      return {'goal' : goal,
              'facts': [...facts],
              'children' : childrenCount,
              'isRoot' : isRoot,
              'isTrue' : isTrue};
    },
    checkTreeBranches(tree, facts, path)
    {
      let branchesRes = [];
      let subgoals = [tree['left'], tree['right']];
      //let cnt = 0;
      for(let subgoal of subgoals) {
        if(path.includes(subgoal['node']))
        {
          //isDeadlock
          //console.log('breaking because of deadlock');
          let newObj = this.createGoalObject(subgoal['node'], facts, 0, false, false);
          branchesRes.push({nodeData: newObj, value: subgoal['node']});
          continue;
        }
        let res = this.checkGoal(subgoal, facts, [...path]);
        //console.log('got res in branch', cnt++ === 0 ? 'left' : 'right', res);
        if(typeof res === 'boolean')
        {
          let newObj = this.createGoalObject(subgoal['node'], facts, 0, false, res);
          branchesRes.push({nodeData: newObj, facts: facts, value: subgoal['node']});
        }
        else if(Array.isArray(res))
          branchesRes.push(...res);
        else
          branchesRes.push(res);
      }
      let finalRes = false;
      if(tree['node'].localeCompare('|') === 0)
        finalRes = branchesRes[0].nodeData.isTrue || branchesRes[1].nodeData.isTrue;
      else if(tree['node'].localeCompare('&') === 0)
        finalRes = branchesRes[0].nodeData.isTrue && branchesRes[1].nodeData.isTrue;

      let nodeData = this.createGoalObject(tree['node'], facts, branchesRes.length, false, finalRes);
      let newFacts = [...facts];
      for(let branch of branchesRes)
      {
        branch.nodeData.facts.forEach((fact) => {
          if(!newFacts.includes(fact))
            newFacts.push(fact);
        })
      }
      let mainGroup = {'children' : branchesRes, 'nodeData' : nodeData, 'value' : tree['node'], 'facts': [...newFacts]};
      //console.log('res of subroutine to find', tree['left']['node'], tree['right']['node'], finalRes);
      //console.log('retourning from branch', mainGroup);
      return mainGroup;
    },
    checkGoal(goal, facts, path)
    {
      //console.log('goal', goal, 'facts', facts)

      //Not a tree and included in facts
      if(!goal['left'] && facts.includes(goal['node']))
      {
        //console.log(`the goal ${goal['node']} is true since it's in the facts`);
        return true;
      }

      // It's not single element but a tree
      if(goal['left'])
      {
        return this.checkTreeBranches(goal, facts, path);
      }

      let ants = this.findAnts(goal);
      //console.log({goal: goal, ants: ants});
      if(!ants.length)
      {
        //console.log(`no ants the goal ${goal['node']} is false since there are no rule for it`);
        return false;
      }

      let counter = 0;
      let groupData = [];
      for(let j = 0; j < ants.length; j++)
      {
        let antTree = ants[j];
        //console.log('antTree', antTree);

        //Antecedent is a tree and not single value
        if(antTree['left'])
        {
          let newData = this.checkTreeBranches(antTree, facts, path);
          if(Array.isArray(newData))
            groupData.push(...newData);
          else
            groupData.push(newData);
          //console.log('newData', newData);
          
          if((Array.isArray(newData) && newData[0].nodeData.isTrue) || 
              (newData.nodeData && newData.nodeData.isTrue))
          {
            break;
          }
        }
        else {
          if(path.includes(antTree['node']))
          {
            //isDeadlock
            //console.log('breaking because of deadlock');
            let newObj = this.createGoalObject(antTree['node'], facts, 0, false, false);
            groupData.push({nodeData: newObj, value: antTree['node']});
            continue;
          }
          let res = this.checkGoal(antTree, facts, [...path, antTree['node']]);
          //console.log({res:res});
          if(typeof res === 'boolean')
          {
            let newObj = this.createGoalObject(antTree['node'], facts, 0, false, res);
            groupData.push({nodeData: newObj, facts: facts, value : antTree['node']});
          }
          else if(Array.isArray(res))
            groupData.push(...res);
          else
            groupData.push(res);
          if(res)
            break;
        }
        //console.log({groupD: groupData});
        if(counter++ > 10)
        {
          //console.log('failsafe');
          break;
        }
      }

      let tempFacts = [...facts];
      let isDataTrue = false;
      groupData.forEach((child) => {
        if(child.nodeData.isTrue)
        {
          for(let fact of child.facts)
          {
            if(!tempFacts.includes(fact))
              tempFacts.push(fact);
          }
          //console.log(`added ${goal['node']} to local facts`);
          if(!tempFacts.includes(goal['node']))
            tempFacts.push(goal['node']);
          isDataTrue = true;
        }
      });
      let nodeData = this.createGoalObject(goal['node'], tempFacts, groupData.length, false, isDataTrue);
      let data = {children: [...groupData], nodeData: nodeData, value: goal['node'], facts: [...tempFacts]};
      //console.log({returningData: data});
      return data;
    },
    findAnts(goal)
    {
      let ants = [];
      for(let i = 0; i < this.rules.length; i++)
      {
        let rule = this.rules[i];
        if(rule.cons.localeCompare(goal['node']) === 0)
        {
          ants.push(rule.ant);
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

<style lang='scss' scoped>
.floating-zoom{
  float:right;
  position: -webkit-sticky;
  position: -moz-sticky;
  position: -ms-sticky;
  position: -o-sticky;
  position: sticky;
  top: 3em;
  //right: 5em;
  z-index: 1;
}
.zoom-block {
  $margin: .2em;
//  box-shadow: 0 0 5px 0px #ffffff3e;
//  border: 1px solid #ffffff0a;
  border-radius: .7em;
  padding: 1em 1.6em;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  &-dark {
    background: linear-gradient(-117deg, #262626e6, #1a1818e6);
    box-shadow: -5px -5px 15px 0 #ffffff1a;
  }
  &-light {
    background: linear-gradient(312deg, #faf8f8, #f9e9e9e6);
    box-shadow: -5px -5px 15px 0 #c5c5c57d;
  }
  &-dark:before {
    box-shadow: 5px 5px 10px 0 #000000;
  }
  &-light:before {
    box-shadow: 5px 5px 10px 0 #00000042;
  }
  &:before{
    content: '';
    border-radius: .7em;
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;
    bottom:0;
    left: 0;
    right: 0;
    z-index: -1;
  }
  & p {
    margin-bottom: $margin;
  }
  & h4 {
    text-align: center;
  }
  & hr {
    width:100%;
  }
  & hr.hr-dark {
    border-top: 1px solid $text-primary-dark; 
    margin-top: .4rem;
  }
  & hr.hr-light{
    border-top: 1px solid $vue-primary; 
    margin-top: .4rem;
  }
  & b-icon {
    z-index:10;
    position: relative;
  }
}
.zoom-icons {
  font-size: 1.25rem;
  margin-left: .6em;
}
.zoom-text{
  margin: 0;
  padding: 0;
}
</style>