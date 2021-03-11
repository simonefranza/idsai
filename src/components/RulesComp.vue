<template>
  <div class="rulesComp">
    <div class="row">
    <div class="col-4">

      <b-card title="Control Panel" v-bind:bg-variant="!darkTheme ? 'light' : 'dark'" v-bind:text-variant="!darkTheme ? '' : 'white'">
        <b-card-body>
          <b-card-sub-title :sub-title-text-variant="darkTheme ? 'light' : 'secondary'" class="mb-3">Facts & Rules</b-card-sub-title>
          <b-card-text>
            <div class="cyclesDiv">
              <span class="toggleBlock">Number of facts</span>
              <b-form-input size="sm" v-model="numFactsTemp"
                                      :class="{'shake' : invalidFactsNumber, 'darkInputForm' : darkTheme, 'mediumInput' : 'true'}"></b-form-input>
              <b-icon :class="['cyclesIconRight', 'iconEnabled', darkTheme ? 'iconDark' : 'iconLight']"
                                      icon="arrow-clockwise" aria-hidden="true" @click="reloadFacts" :animation="reloadingFacts ? 'spin' : ''"></b-icon>
            </div>
            <div class="cyclesDiv">
              <span class="toggleBlock">Number of rules</span>
              <b-form-input size="sm" v-model="numRulesTemp"
                                      :class="{'shake' : invalidRulesNumber, 'darkInputForm' : darkTheme, 'mediumInput' : 'true'}"></b-form-input>
              <b-icon :class="['cyclesIconRight', 'iconEnabled', darkTheme ? 'iconDark' : 'iconLight']"
                                      icon="arrow-clockwise" aria-hidden="true" @click="reloadRules" :animation="reloadingRules ? 'spin' : ''"></b-icon>
            </div>
            <span class="cyclesDiv">
              <span>New fact</span>
              <b-form-input size="sm" v-model="newFact" placeholder="Fact"
                                                        :class="{'newFact' : 'true', 'darkInputForm' : darkTheme}" @keyup.enter="addNewFact()"></b-form-input>
              <b-icon :class="['cyclesIconRight', isNewFactValid ? 'iconEnabled' : 'iconDisabled', darkTheme ? 'iconDark' : 'iconLight']"
                                                        icon="check-circle" aria-hidden="true" @click="addNewFact"></b-icon>
            </span>
            <span class="cyclesDiv">
              <span>New rule</span> 
              <b-form-input size="sm" v-model="newAntecedents" placeholder="Ants & separated"
                                                               :class="{'newRule' : 'true', 'darkInputForm' : darkTheme}"></b-form-input>
              <span> → </span>
              <b-form-input size="sm" v-model="newConsequent" placeholder="Cons"
                                                              :class="{'newRule' : 'true', 'consequentInput' : 'true', 'darkInputForm' : darkTheme}" @keyup.enter="addNewRule()"></b-form-input>
              <b-icon :class="['cyclesIconRight', isNewRuleValid ? 'iconEnabled' : 'iconDisabled', darkTheme ? 'iconDark' : 'iconLight']"
                                                              icon="check-circle" aria-hidden="true" @click="addNewRule"></b-icon>
            </span>
            <div class="cyclesDiv">
              <span class="toggleBlock">Replace variable</span>
              <b-form-input size="sm" ref="fromInputField" v-model="mapFrom" placeholder="A"
                                                                             :class="{'shake' : invalidRulesNumber, 'darkInputForm' : darkTheme, 'mediumInput' : 'true'}"
                                                                             @keyup.enter="addMapping()"></b-form-input>
              <span>:</span>
              <b-form-input size="sm" v-model="mapTo" placeholder="something"
                                                      :class="{'shake' : invalidRulesNumber, 'darkInputForm' : darkTheme, 'mediumInput' : 'true'}"
                                                      @keyup.enter="addMapping()"></b-form-input>
              <b-icon :class="['cyclesIconRight', isMapValid ? 'iconEnabled' : 'iconDisabled', darkTheme ? 'iconDark' : 'iconLight']"
                                                      icon="check-circle" aria-hidden="true" @click="addMapping"></b-icon>
            </div>
          </b-card-text>
          <b-card-sub-title :sub-title-text-variant="darkTheme ? 'light' : 'secondary'" class="mb-3 mt-4">Algorithms</b-card-sub-title>
          <b-card-text>
            <div class="cyclesDiv">
              <span>Forward chaining ({{cycleNum + 1}} / {{cycles.length}})</span>
              <span>
                <b-button :disabled="decreaseCycleDisabled" :class="['cyclesIconLeft', decreaseCycleDisabled ? 'iconDisabled' : 'iconEnabled']" 
                @click="decreaseCyclesNum" :variant="darkTheme ? 'outline-dark' : 'outline-light'">Remove 1 Cycle</b-button>
                <b-button :disabled="increaseCycleDisabled" :class="['cyclesIconRight', increaseCycleDisabled ?  'iconDisabled' : 'iconEnabled']" 
                @click="increaseCyclesNum" :variant="darkTheme ? 'outline-dark' : 'outline-light'">Add 1 Cycle</b-button>
                <!--<b-icon :class="['cyclesIconLeft', decreaseCycleDisabled ? 'iconDisabled' : 'iconEnabled', darkTheme ? 'iconDark' : 'iconLight']" 
                                                  icon="dash-circle" aria-hidden="true" @click="decreaseCyclesNum"></b-icon>
                <b-icon :class="['cyclesIconRight', increaseCycleDisabled ? 'iconDisabled' : 'iconEnabled', darkTheme ? 'iconDark' : 'iconLight']"
                                                                     icon="plus-circle" aria-hidden="true" @click="increaseCyclesNum"></b-icon>
                -->
              </span>
            </div>
            <div class="cyclesDiv">
              <span class="toggleBlock">Backward chaining goal</span>
              <b-form-input size="sm" v-model="searchedVariable"  placeholder="Goal"
                                      :class="{'shake' : invalidGoal, 'darkInputForm' : darkTheme, 'mediumInput' : 'true'}"></b-form-input>
            </div>
          </b-card-text>
        </b-card-body>
      </b-card>
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
        <b-table striped hover :items="cycles[cycleNum]" v-bind:dark="darkTheme" @row-hovered="rowHovered" @row-unhovered="rowUnhovered">
          <template #cell(added_facts)="row">
            <span :class="{'dataTitle' : row.value.localeCompare(mapFrom.trim()) === 0}">{{row.value}}</span>

          </template>
        </b-table>
      </div>

    </div>
    <div class="row">
    <div class="col-12" v-if="!invalidGoal">
      <BackwardChaining :darkTheme="darkTheme" :facts="currentFacts" :rules="rules"
                     :variables="variables" :goal="currentGoal" :highlight="mapFrom.trim()"/>
    </div>
    </div>
  </div>
</template>

<script>
//TODO: implement writing own formulas
import BackwardChaining from '@/components/BackwardChaining.vue';

export default {
  props: {
    darkTheme: {
      type: Boolean,
      required: true
    }
  },
  components: {
    BackwardChaining,
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
      reloadingFacts : false,
      reloadingRules : false,
      numRulesTemp : '5',
      numFactsTemp : '5',
      hoveredRule : false,
      hoveredFact : false,
      searchedVariable : '',
      mapFrom : '',
      mapTo : '',
      newAntecedents: '',
      newConsequent: '',
      newFact: '',
      reloadRulesDisabled : false,
      reloadFactsDisabled : false,
    }
  },
  computed: {
    currentGoal: function() {
      return this.searchedVariable.trim();
    },
    invalidFactsNumber: function() {
      return !this.numFacts || isNaN(this.numFacts) || ('' + this.numFacts).includes('.') ||
        parseInt(this.numFacts) > this.variables.length || parseInt(this.numFacts) < 0;
    },
    invalidRulesNumber: function() {
      return !this.numRules || isNaN(this.numRules) || ('' + this.numRules).includes('.');
    },
    currentFacts: function() {
      return this.facts;
    },
    cycles: function() {
      let currFacts = [...this.currentFacts];
      let cyclesData = [];
      let data = [];
      let tempAddedFacts = [];
      let cycleN = 1;
      do 
      {
        tempAddedFacts = [];
        this.rules.forEach(ruleObj => {
          let already_present = false;
          tempAddedFacts.forEach(el => {
            if(el.fact.localeCompare(ruleObj.cons) === 0)
              already_present = true;
          });
          if(this.validateAnt(ruleObj.ant, currFacts) && !currFacts.includes(ruleObj.cons) && !already_present)
            tempAddedFacts.push({rule: ruleObj.id, fact: ruleObj.cons});
        });
        tempAddedFacts.forEach((addedObj, index) => {
          data.push({cycle: index === 0 ? cycleN++ : '', 
            fired_rules: 'R' + addedObj['rule'], added_facts: addedObj['fact']});
          currFacts.push(addedObj['fact']);
        });
        if(tempAddedFacts.length !== 0)
          cyclesData.push([...data]);
      } while(tempAddedFacts.length !== 0);
      data.push({cycle: cycleN, fired_rules: '', added_facts: ''});
      cyclesData.push([...data]);
      return cyclesData;
    },
    increaseCycleDisabled: function() {
      return this.cycleNum === this.cycles.length - 1;
    },
    decreaseCycleDisabled: function() {
      return this.cycleNum === -1;
    },
    isMapValid: function() {
      if(!this.mapTo.trim() || !this.mapFrom.trim() || !this.variables.includes(this.mapFrom.trim()) ||
      this.variables.includes(this.mapTo.trim()))
        return false;
      return true;
    },
    invalidGoal: function() {
      if(!this.currentGoal.trim())
        return false;
      return !this.variables.includes(this.currentGoal);
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
    invalidNewAntecedents: function() {
      if(!this.newAntecedents.trim())
        return true;
      let splitty = this.newAntecedents.trim().split(' ').filter(el => el);

      if(splitty.length === 1 && !this.variables.includes(splitty[0]))
        return true;
      if(splitty.length % 2 === 0)
        return true;
      let isInvalid = false;
      let alreadyUsed = [];
      splitty.forEach((el, index) => {
        if(index % 2 && el.localeCompare("&"))
          isInvalid = true;
        else if(index % 2 === 0 && (el.localeCompare('&') === 0 || 
          el.localeCompare(this.newConsequent.trim()) === 0 || alreadyUsed.includes(el)))
          isInvalid = true;
        else
          alreadyUsed.push(el);
      });
      return isInvalid;
    },
    invalidNewConsequent: function() {
      if(!this.newConsequent.trim() || this.newConsequent.trim().includes(' '))
        return true;
      return false;
    },
    isNewFactValid: function() {
      if(this.newFact.trim().includes(' ') || !this.newFact.trim())
        return false;
      return !this.facts.includes(this.newFact.trim());
    },
    isNewRuleValid: function() {
      if(this.invalidNewAntecedents || this.invalidNewConsequent)
        return false;
      return !this.isRuleAlreadyPresent([...this.antecedentsToAdd], this.newConsequent.trim(), this.rules);
    },
    numRules: function() {
      if(isNaN(this.numRulesTemp.trim()))
        return 0;
      return parseInt(this.numRulesTemp.trim());
    },
    numFacts: function() {
      if(isNaN(this.numFactsTemp.trim()))
        return 0;
      return parseInt(this.numFactsTemp.trim());
    }

  },
  methods: {
    removeMapping(index) {
      this.addedMapping.splice(index,1);
    },
    addNewRule() {
      if(!this.isNewRuleValid)
        return;
      this.rules.push({id: this.rules.length + 1, ant: this.antecedentsToAdd, cons: this.newConsequent.trim()});
      if(!this.variables.includes(this.newConsequent.trim()))
        this.variables.push(this.newConsequent.trim());
      this.antecedentsToAdd.forEach(ant => {
        if(!this.variables.includes(ant))
          this.variables.push(ant);
      });
      this.reloadRulesDisabled = true;
      this.numRules++;
      this.newConsequent = '';
      this.newAntecedents = '';
    },
    addNewFact() {
      if(!this.isNewFactValid)
        return;
      this.facts.push(this.newFact.trim());
      if(!this.variables.includes(this.newFact.trim()))
        this.variables.push(this.newFact.trim());
      this.reloadFactsDisabled = true;
      this.numFacts++;
      this.newFact = '';
    },
    addMapping() {
      if(!this.isMapValid || !this.mapTo.trim())
        return;
      let fromVar = this.mapFrom.trim();
      let toVar = this.mapTo.trim();
      let indexVar = this.variables.indexOf(fromVar);
      if(indexVar === -1)
        return;
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

      
      this.mapTo = '';
      this.mapFrom = '';
      this.$refs.fromInputField.$el.focus();
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
      if(this.cycleNum === this.cycles.length - 1)
        return;
      this.cycleNum++;
    },
    decreaseCyclesNum() {
      if(this.cycleNum === -1)
        return;
      this.cycleNum--;
    },
    rowHovered(item) {
      this.ruleHovered = item.fired_rules.slice(1);
    },
    rowUnhovered() {
      this.ruleHovered = -1;
    },
    reloadFacts() {
      this.reloadingFacts = true;
      this.facts.splice(0, this.facts.length, ...this.generatedFacts());
      setTimeout(() => {
        this.reloadingFacts = false;}, 2000);
    },
    reloadRules () {
      this.reloadingRules = true;
      this.rules.splice(0, this.rules.length, ...this.generateRules());
      setTimeout(() => {
        this.reloadingRules = false;}, 2000);
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

.toggleBlock{
  display: flex;
  align-items: center;
}
.switchPadding {
  margin-right:10px;
}
.disabledInput {
  opacity: 0.7;
}
.newRule {
  width: 40%;
  margin: 0 10px 0 10px;
}
.consequentInput {
  width: 20%;
}
.highlightRowDark {
  background: #1b1b1b;
}
.highlightRowLight{
  background: #eae7e7;
}
.newFact {
  width: 25%;
}
</style>
