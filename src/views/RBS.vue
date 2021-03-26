<template>
  <div class="rulesComp">
    <div class="row" :style="isWideDevice || isWiderThanHigher ? 'flex-direction: row' : 'flex-direction: column'">
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
      <div :class="isWideDevice ? 'col-4' : 'col'">
        <RBSDatabase :currentFacts="currentFacts"
           :rules="rules"
           :mapFrom="mapFrom"
           :mapTo="mapTo"
           :ruleHovered="ruleHovered"
           @deleteFact="deleteFact"
           @deleteRule="deleteRule"/>
      </div>
      <div :class="isWideDevice ? 'col-4' : 'col'" v-if="cycleNum >= 0">
        <ForwardChaining :cycles="cycles"
                         :cycleNum="cycleNum"
                         :mapFrom="mapFrom"
                         @rowUnhovered="rowUnhovered"
                         @rowHovered="rowHovered"/>
      </div>

    </div>
    <div class="row">
      <div class="col-12" v-if="!invalidGoal">
        <BackwardChaining :facts="currentFacts" 
                          :rules="rules"
                          :variables="variables" 
                          :goal="currentGoal"
                          :highlight="mapFrom.trim()"/>
      </div>
    </div>
  </div>
</template>

<script>
//TODO: implement writing own formulas
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
  },
  data() {
    return {
      variables : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
      fields: ["from", "to", "remove"],
      rules: [],
      facts: [],
      addedRules: [],
      cycleNum : 4,
      bckwd_chain : false,
      num_facts_bool : false,
      num_rules_bool : false,
      numRulesTemp : '5',
      numFacts : 5,
      numRules : 5,
      searchedVariable : '',
      mapFrom : '',
      mapTo : '',
      currentGoal : '',
      reloadRulesDisabled : false,
      reloadFactsDisabled : false,
      ruleHovered : -1,
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
</style>
