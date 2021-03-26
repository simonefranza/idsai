<template>
  <div class="rulesComp">
    <div class="row">
    <div class="col-4">
      <RulesControlPanel :numRules="numRules" 
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
                          @reloadFacts="reloadFacts"
                          v-if="isWideDevice"/>
    </div>

      <!-- Facts and DB -->
      <div class="col-4">
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
      </div>

      <!-- Rules table -->
      <div class="col-4" v-if="cycleNum >= 0">
        <b-table striped hover :items="cycles[cycleNum]" :dark="darkTheme" @row-hovered="rowHovered" @row-unhovered="rowUnhovered">
          <template #cell(added_facts)="row">
            <span :class="{'dataTitle' : row.value.localeCompare(mapFrom.trim()) === 0}">{{row.value}}</span>

          </template>
        </b-table>
      </div>

    </div>
    <div class="row">
    <div class="col-12" v-if="!invalidGoal">
      <BackwardChaining :facts="currentFacts" :rules="rules"
                     :variables="variables" :goal="currentGoal" :highlight="mapFrom.trim()"/>
    </div>
    </div>
  </div>
</template>

<script>
//TODO: implement writing own formulas
import BackwardChaining from '@/components/BackwardChaining.vue';
import RulesControlPanel from '@/components/RulesControlPanel.vue';

export default {
  components: {
    BackwardChaining,
    RulesControlPanel,
  },
  data() {
    return {
      variables : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
      fields: ["from", "to", "remove"],
      rules: [],
      facts: [],
      addedRules: [],
      cycleNum : -1,
      ruleHovered: -1,
      bckwd_chain : false,
      num_facts_bool : false,
      num_rules_bool : false,
      numRulesTemp : '5',
      numFacts : 5,
      numRules : 5,
      hoveredRule : false,
      hoveredFact : false,
      searchedVariable : '',
      mapFrom : '',
      mapTo : '',
      currentGoal : '',
      reloadRulesDisabled : false,
      reloadFactsDisabled : false,
    }
  },
  computed: {
    darkTheme() {
      return this.$store.state.darkTheme;
    },
    isWideDevice() {
      return this.$store.state.isWideDevice;
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
    console.log("ciaofaajl");
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
      if(this.searchedVariable.localeCompare(fromVar) === 0)
        this.searchedVariable = toVar;
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
    rowHovered(item) {
      this.ruleHovered = item.fired_rules.slice(1);
    },
    rowUnhovered() {
      this.ruleHovered = -1;
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
.dataCard {
  text-align: left;
}
.dataTitle {
  font-weight: bold;
}

.flexSpan{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1px 5px 1px 0;
}

.switchPadding {
  margin-right:10px;
}
.disabledInput {
  opacity: 0.7;
}
.highlightRowDark {
  background: #1b1b1b;
}
.highlightRowLight{
  background: #eae7e7;
}
</style>
