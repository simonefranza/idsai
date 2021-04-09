<template>
  <span :class="{'home-small' : !isWideDevice}">
  <div :class="['smallNav', darkTheme ? 'dark-theme' : 'light-theme']" v-if="!isWideDevice">
    <MenuIcon  class="menuIcon" />
    <h1 >.rules</h1>
    <div/>
  </div>
  <div class="rules-comp">
    <div class="row rules-comp-row" :style="isWideDevice || isWiderThanHigher ? 'flex-direction: row' : 'flex-direction: column'">
      <div class="col-4" v-if="isWideDevice">
        <RBSControlPanel :numRules="numRules" 
           :numFacts="numFacts" 
           :facts="facts"
           :rules="rules"
           :variables="variables"
           :cycles="cycles"
           :cycleNumber="cycleNum"
           @newFact="addNewFact"
           @newRule="addNewRule"
           @newMapFrom="updateMapFrom"
           @newMapTo="updateMapTo"
           @newGoal="updateCurrentGoal"
           @addNewMapping="addMapping"
           @updateNumRulesTemp="setNumRulesTemp"
           @updateNumFactsTemp="setNumFactsTemp"
           @increaseCyclesNum="increaseCyclesNum"
           @decreaseCyclesNum="decreaseCyclesNum"
           @reloadRules="reloadRules"
           @reloadFacts="reloadFacts"/>
      </div>
      <div :class="[isWideDevice ? 'col-4' : 'col', 
        !isWideDevice && isWiderThanHigher ? 'database-div' : '']">
        <RBSDatabase :currentFacts="currentFacts"
           :rules="rules"
           :mapFrom="mapFrom"
           :mapTo="mapTo"
           :ruleHovered="ruleHovered"
           @deleteFact="deleteFact"
           @deleteRule="deleteRule"/>
      </div>
      <div :class="[isWideDevice ? 'col-4' : 'col',
        !isWideDevice && isWiderThanHigher ? 'algorithm-div-wider' : '',
        !isWideDevice && !isWiderThanHigher ? 'algorithm-div-higher' : '']" 
        :style="!isWideDevice ? 'flex-grow:2; ' : ''"
        @touchstart="startTouch"
        @touchmove="moveTouch"
        @touchend="endTouch">
        <div id="rbs-algo-block"
          :class="{'db-block' : !isWideDevice ,
          'db-block-dark' : darkTheme,
          'db-block-light' : !darkTheme}">
        <transition :name="!showFwdCh ? 'slide-left' : 'slide-right'" mode="out-in">
        <ForwardChaining :cycles="cycles"
                         :cycleNum="cycleNum"
                         :mapFrom="mapFrom"
                         @rowUnhovered="rowUnhovered"
                         @rowHovered="rowHovered"
                         @decreaseCyclesNum="decreaseCyclesNum"
                         @increaseCyclesNum="increaseCyclesNum" 
                       v-if="showFwdCh"/>
        <BackwardChaining :facts="currentFacts" 
          class="moved-bwd-ch"
          :rules="rules"
          :variables="variables" 
          :goal="currentGoal"
          :highlight="mapFrom.trim()"
          v-if="!showFwdCh && !isWideDevice"/>
        </transition>
      </div>
      </div>

    </div>
    <div class="row" v-if="isWideDevice">
      <div class="col-12" v-if="!invalidGoal">
        <BackwardChaining :facts="currentFacts" 
                          :rules="rules"
                          :variables="variables" 
                          :goal="currentGoal"
                          :highlight="mapFrom.trim()"/>
      </div>
    </div>
  </div>
  </span>
</template>

<script>
import MenuIcon from '@/components/extra/MenuIcon.vue'
import BackwardChaining from '@/components/rbs/BackwardChaining.vue';
import ForwardChaining from '@/components/rbs/ForwardChaining.vue';
import RBSControlPanel from '@/components/rbs/RBSControlPanel.vue';
import RBSDatabase from '@/components/rbs/RBSDatabase.vue';

export default {
  name: 'Rules',
  components: {
    BackwardChaining,
    ForwardChaining,
    RBSControlPanel,
    RBSDatabase,
    MenuIcon,
  },
  data() {
    return {
      event: null,
      variables : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
      fields: ["from", "to", "remove"],
      rules: [],
      facts: [],
      cycleNum : 4,
      num_facts_bool : false,
      num_rules_bool : false,
      numFacts : 5,
      numRules : 5,
      searchedVariable : '',
      mapFrom : '',
      mapTo : '',
      currentGoal : 'Z',
      reloadRulesDisabled : false,
      reloadFactsDisabled : false,
      ruleHovered : -1,
      window: window,
      screen: screen,
      showFwdCh: true,
      touchesNum: 0,
      initialX: null,
      initialY: null,
      lastDiffX: null,
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
    invalidGoal: function() {
      if(!this.currentGoal.trim())
        return false;
      return !this.variables.includes(this.currentGoal);
    },
    currentFacts: function() {
      return this.facts;
    },
    cycles: function() {
      let currFacts = [...this.currentFacts];
      let cyclesData = [];
      let data = [];
      let newRules = [];
      let cycleN = 1;
      do 
      {
        newRules = [];
        this.rules.forEach(ruleObj => {
          let already_present = false;
          newRules.forEach(el => {
            if(el.fact.localeCompare(ruleObj.cons) === 0)
              already_present = true;
          });
          if(!already_present && this.validateAnt(ruleObj.ant, currFacts) && !currFacts.includes(ruleObj.cons))
          {
            newRules.push({rule: ruleObj.id, fact: ruleObj.cons});
            currFacts.push(ruleObj.cons);
          }
        });
        newRules.forEach((addedObj, index) => {
          data.push({cycle: index === 0 ? cycleN++ : '', 
                      fired_rules: 'R' + addedObj['rule'],
                      added_facts: addedObj['fact']});
        });
        if(newRules.length !== 0)
          cyclesData.push([...data]);
      } while(newRules.length !== 0);
      data.push({cycle: cycleN, fired_rules: '', added_facts: ''});
      cyclesData.push([...data]);
      return cyclesData;
    },
    antecedentsToAdd: function() {
      let splitty = this.newAntecedents.trim().split(' ');
      let ants = [];
      splitty.forEach((el, index) => {
        if(index % 2 === 0)
          ants.push(el);
      });
      return ants;
    },

  },
  methods: {
    startTouch(e) {
      if(this.isWideDevice)
        return;
      this.touchesNum = e.touches.length;
      if(this.touchesNum > 1)
        return;
      this.initialX = e.touches[0].clientX;
      this.initialY = e.touches[0].clientY;
    },
    moveTouch(e) {
      if(e.touches.length > this.touchesNum)
        this.touchesNum = e.touches.length;
      if(this.isWideDevice || this.touchesNum > 1 || !this.initialX || !this.initialY)
        return;

      var currentX = e.touches[0].clientX;
      this.lastDiffX = this.initialX - currentX;
    },
    endTouch() {
      if(this.touchesNum > 1 || !this.initialX || !this.initialY || this.isWideDevice)
      {
        this.touchesNum = 0;
        return;
      }
      this.touchesNum = 0;

      //swiped left 
      if(this.showFwdCh && this.lastDiffX > this.windowWidth * 0.33)
        this.showFwdCh = false;
      else if(!this.showFwdCh && this.lastDiffX < - this.windowWidth * 0.33)
        this.showFwdCh = true;

      this.initialX = null;
      this.initialY = null;
      this.lastDiffX = null;
    },
    rowHovered(item) {
      this.ruleHovered = item.fired_rules.slice(1);
    },
    rowUnhovered() {
      this.ruleHovered = -1;
    },
    setNumRulesTemp(newVal) {
      if(!newVal.trim() || isNaN(newVal.trim()))
      {
        this.numRules = newVal;
        return;
      }
      this.numRules = parseInt(newVal.trim());
    },
    setNumFactsTemp(newVal) {
      if(!newVal.trim() || isNaN(newVal.trim()))
      {
        this.numFacts = 0;
        return;
      }
      this.numFacts = parseInt(newVal.trim());
    },
    reloadFacts() {
      this.facts.splice(0, this.facts.length, ...this.generatedFacts());
    },
    reloadRules () {
      this.rules.splice(0, this.rules.length, ...this.generateRules());
    },
    addMapping(map) {
      let indexVar = map.indexVar;
      let toVar = map.toVar;
      let fromVar = map.fromVar;
      this.variables.splice(indexVar, 1, toVar);
      if((indexVar = this.facts.indexOf(fromVar)) !== -1)
        this.facts.splice(indexVar, 1, toVar);
      this.rules.forEach(ruleObj => {
        let idx = -1;
        if((idx = ruleObj['ant'].indexOf(fromVar)) !== -1)
          ruleObj['ant'].splice(idx, 1, toVar);
        if(ruleObj['cons'].localeCompare(fromVar) === 0)
          ruleObj['cons'] = toVar;
      });
      if((indexVar = this.facts.indexOf(fromVar)) !== -1)
        this.facts.splice(indexVar, 1, toVar);
    },
    removeMapping(index) {
      this.addedMapping.splice(index,1);
    },
    addNewRule(newRule) {
      this.rules.push({id: this.rules.length + 1, ant: newRule.ant, 
                        cons: newRule.cons});
      if(!this.variables.includes(newRule.cons))
        this.variables.push(newRule.cons);
      newRule.ant.forEach(ant => {
        if(!this.variables.includes(ant))
          this.variables.push(ant);
      });
      this.reloadRulesDisabled = true;
      this.numRules++;
    },
    addNewFact(newFact) {
      this.facts.push(newFact);
      if(!this.variables.includes(newFact))
        this.variables.push(newFact);
      this.reloadFactsDisabled = true;
      this.numFacts++;
    },
    deleteRule(index) {
      this.rules.splice(index, 1);
      this.rules.forEach((el, index) => el.id = index + 1);
      this.reloadRulesDisabled = true;
      this.numRules--;
    },
    deleteFact(index) {
      this.facts.splice(index, 1);
      this.reloadFactsDisabled = true;
      this.numFacts--;
    },
    generatedFacts() {
      if(this.invalidFactsNumber)
        return [];
      let facts = [];
      while(facts.length !== parseInt(this.numFacts))
      {
        let newFact = this.variables[Math.floor(Math.random() * this.variables.length)];
        if(!facts.includes(newFact))
          facts.push(newFact);
      }
      return facts.sort();
    },
    generateRules() {
      if(this.invalidRulesNumber)
        return [];
      let rules = [];
      for(let i = 0; i < parseInt(this.numRules); i++)
      {
        let numAnts = Math.floor(Math.random() * 3) + 1;
        let ants = [];
        while(ants.length != numAnts)
        {
          let ant = this.variables[Math.floor(Math.random() * this.variables.length)];
          if(!ants.includes(ant))
            ants.push(ant);
        }
        let cons = this.variables[Math.floor(Math.random() * this.variables.length)];
        if(this.isRuleAlreadyPresent(ants, cons, rules))
        {
          i--;
          continue;
        }
        rules.push({id: i + 1, ant: ants, cons: cons});
      }
      return rules;
    },
    isRuleAlreadyPresent(ants, cons, rules) {
      for(let j = 0; j < rules.length; j++)
      {
        let currAnts = [...rules[j]['ant']].sort();
        let haveSameAnts = true;
        if(currAnts.length !== ants.length)
          continue;

        ants.sort().forEach((el, index) => {
          if(currAnts[index].localeCompare(el))
            haveSameAnts = false;
        });

        if((haveSameAnts && rules[j]['cons'].localeCompare(cons) === 0) ||
          ants.includes(cons))
        {
          return true;
        }
      }
      return false;
    },
    validateAnt(ant, facts) {
      for(let i = 0; i < ant.length; i++)
      {
        if(!facts.includes(ant[i]))
          return false;
      }
      return true;
    },
    increaseCyclesNum() {
      this.cycleNum++;
    },
    decreaseCyclesNum() {
      this.cycleNum--;
    },
    updateMapTo(newVal) {
      this.mapTo = newVal;
    },
    updateMapFrom(newVal) {
      this.mapFrom = newVal;
    },
    updateCurrentGoal(newVal) {
      this.currentGoal = newVal;
    }
  },
  watch: {
    cycles() {
      if(this.cycleNum > this.cycles.length - 1)
        this.cycleNum = this.cycles.length - 1;
    },
    numRules(newVal, oldVal) {
      if(this.reloadRulesDisabled)
      {
        this.reloadRulesDisabled = false;
        return;
      }
      if(newVal === oldVal)
        return;
      this.rules.splice(0, this.rules.length);
      this.rules =  [...this.generateRules()];
    },
    numFacts(newVal, oldVal) {
      if(this.reloadFactsDisabled)
      {
        this.reloadFactsDisabled = false;
        return;
      }
      if(newVal === oldVal)
        return;
      this.facts.splice(0, this.rules.length);
      this.facts = [...this.generatedFacts()];
    },
  },
  created() {
    this.facts = this.variables.slice(0, this.numFacts);
    this.rules.push({id: 1, ant: [this.variables[24], this.variables[3]], cons: this.variables[25]});
    this.rules.push({id: 2, ant: [this.variables[23], this.variables[1], this.variables[4]], cons: this.variables[24]});
    this.rules.push({id: 3, ant: [this.variables[0]], cons: this.variables[23]});
    this.rules.push({id: 4, ant: [this.variables[2]], cons: this.variables[11]});
    this.rules.push({id: 5, ant: [this.variables[11], this.variables[12]], cons: this.variables[13]});
  },
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/_rbs_db_shared.scss';
.rules-comp {
  display: flex;
  flex-grow: 1;
  width: 100%;
  padding: 0 20px 20px 20px;
  &-row {
  flex-grow: 1;
  }
}
.smallNav{
  font-family: 'Dancing Script', handwriting;
  padding: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  top: 0;
  width: 100%;
  height: 6em;
  background: transparent;
  z-index : 1000;
}
.menuIcon {
  position: absolute;
  z-index: 10000;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
}
.home-small {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  flex-direction: column;
  overflow: hidden;
  margin: 0;
  h1 {
    font-size: 2.1em;
  }
}
.database-div {
  padding-right: 0;

}
.algorithm-div-wider {
  padding-left: 0; 
  max-height: calc(100vh - 8.5em);
}
.algorithm-div-higher{
  height: calc(100vh - 50vw - 11em);
  max-width: 100vw;
}
.moved-bwd-ch {
  overflow: hidden;
}
</style>
