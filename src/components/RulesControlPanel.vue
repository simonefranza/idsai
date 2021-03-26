<template>
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
                                                    :class="{'newFact' : 'true', 'darkInputForm' : darkTheme}" @keyup.enter="addNewFact"></b-form-input>
          <b-icon :class="['cyclesIconRight', isNewFactValid ? 'iconEnabled' : 'iconDisabled', darkTheme ? 'iconDark' : 'iconLight']"
                                                    icon="check-circle" aria-hidden="true" @click="addNewFact"></b-icon>
        </span>
        <span class="cyclesDiv">
          <span>New rule</span> 
          <b-form-input size="sm" 
                        v-model="newAntecedents" 
                        placeholder="Ants & separated"
                        :class="{'newRule' : 'true', 'darkInputForm' : darkTheme}"
                        @keyup.enter="addNewRule()">
          </b-form-input>
          <span> → </span>
          <b-form-input size="sm" 
                        v-model="newConsequent" 
                        placeholder="Cons"
                        :class="{'newRule' : 'true', 'consequentInput' : 'true', 'darkInputForm' : darkTheme}" 
                        @keyup.enter="addNewRule()">
          </b-form-input>
          <b-icon :class="['cyclesIconRight', isNewRuleValid ? 'iconEnabled' : 'iconDisabled', darkTheme ? 'iconDark' : 'iconLight']"
                                                          icon="check-circle" aria-hidden="true" @click="addNewRule"></b-icon>
        </span>
        <div class="cyclesDiv">
          <span class="toggleBlock">Replace variable</span>
          <b-form-input size="sm" 
                        ref="fromInputField"
                        v-model="mapFrom" 
                        placeholder="A"
                        :class="{'shake' : invalidRulesNumber, 'darkInputForm' : darkTheme, 'mediumInput' : 'true'}"
                        @keyup.enter="addMapping()"></b-form-input>
          <span>:</span>
          <b-form-input size="sm" 
                        v-model="mapTo"
                        placeholder="something"
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
            <b-button pill :disabled="decreaseCycleDisabled" :class="['cyclesIconLeft', decreaseCycleDisabled ? 'iconDisabled' : 'iconEnabled']" 
            @click="decreaseCyclesNum" :variant="darkTheme ? 'outline-dark' : 'outline-light'">Remove 1 Cycle</b-button>
            <b-button pill :disabled="increaseCycleDisabled" :class="['cyclesIconRight', increaseCycleDisabled ?  'iconDisabled' : 'iconEnabled']" 
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
</template>

<script>
export default {
  data() {
    return {
      reloadingFacts : false,
      reloadingRules : false,
      newFact: '',
      newAntecedents: '',
      newConsequent: '',
      numFactsTemp : this.numFacts.toString(),
      numRulesTemp : this.numRules.toString(),
      mapFrom : '',
      mapTo : '',
      cycleNum : 0,
      searchedVariable : '',
    }
  },
  props: {
    numRules : {required : true},
    numFacts : {required : true},
    facts : {required : true},
    rules: {required : true},
    cycles : {required : true},
    variables : {required : true},
    cycleNumber : {required : true},
  },
  computed: {
    darkTheme() {
      return this.$store.state.darkTheme;
    },
    invalidFactsNumber: function() {
      return !this.numFacts || isNaN(this.numFacts) || ('' + this.numFacts).includes('.') ||
        parseInt(this.numFacts) > this.variables.length || parseInt(this.numFacts) < 0;
    },
    invalidRulesNumber: function() {
      return !this.numRules || isNaN(this.numRules) || ('' + this.numRules).includes('.');
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
    isMapValid: function() {
      if(!this.mapTo.trim() || !this.mapFrom.trim() || 
         !this.variables.includes(this.mapFrom.trim()) ||
         this.variables.includes(this.mapTo.trim()))
        return false;
      return true;
    },
    currentGoal: function() {
      return this.searchedVariable.trim();
    },
    invalidGoal: function() {
      if(!this.currentGoal.trim())
        return false;
      return !this.variables.includes(this.currentGoal);
    },
    antecedentsToAdd() {
      let splitty = this.newAntecedents.trim().split(' ');
      let ants = [];
      splitty.forEach((el, index) => {
        if(index % 2 === 0)
          ants.push(el);
      });
      return ants;
    },
    increaseCycleDisabled: function() {
      return this.cycleNum === this.cycles.length - 1;
    },
    decreaseCycleDisabled: function() {
      return this.cycleNum === -1;
    },
  },
  methods: {
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
    increaseCyclesNum() {
      if(this.cycleNum === this.cycles.length - 1)
        return;
      this.$emit('increaseCyclesNum');
    },
    decreaseCyclesNum() {
      if(this.cycleNum === -1)
        return;
      this.$emit('decreaseCyclesNum');
    },
    reloadFacts() {
      this.reloadingFacts = true;
      this.$emit('reloadFacts');
      setTimeout(() => {
        this.reloadingFacts = false;}, 2000);
    },
    reloadRules () {
      this.reloadingRules = true;
      this.$emit('reloadRules');
      setTimeout(() => {
        this.reloadingRules = false;}, 2000);
    },
    addNewFact() {
      if(!this.isNewFactValid)
        return;
      this.$emit('newFact', this.newFact.trim())
      this.newFact = '';
    },
    addNewRule() {
      if(!this.isNewRuleValid)
        return;
      this.$emit('newRule', {ant: this.antecedentsToAdd, cons: this.newConsequent.trim()})
      this.newConsequent = '';
      this.newAntecedents = '';
    },
    addMapping() {
      if(!this.isMapValid || !this.mapTo.trim())
        return;
      let fromVar = this.mapFrom.trim();
      let toVar = this.mapTo.trim();
      let indexVar = this.variables.indexOf(fromVar);
      if(indexVar === -1)
        return;
      if(this.searchedVariable.localeCompare(fromVar) === 0)
        this.searchedVariable = toVar;
      this.$emit('addNewMapping', {fromVar: fromVar, toVar: toVar, indexVar: indexVar});
      this.mapTo = '';
      this.mapFrom = '';
      this.$refs.fromInputField.$el.focus();
    }
  },
  watch: {
    numFacts(newVal) {
      if((newVal).toString().localeCompare(this.numFactsTemp))
        this.numFactsTemp = (newVal).toString();
    },
    numRules(newVal) {
      if((newVal).toString().localeCompare(this.numRulesTemp))
        this.numRulesTemp = (newVal).toString();
    },
    cycleNumber(newVal) {
      this.cycleNum = newVal;
    },
    mapFrom() {
      this.$emit('newMapFrom', this.mapFrom);
    },
    mapTo() {
      this.$emit('newMapTo', this.mapTo);
    },
    searchedVariable() {
      this.$emit('newGoal', this.searchedVariable.trim());
    },
    numRulesTemp(newVal) {
      this.$emit('updateNumRulesTemp', newVal);
    },
    numFactsTemp(newVal) {
      this.$emit('updateNumFactsTemp', newVal);
    }
  }
  
}
</script>

<style lang="scss" scoped>
.toggleBlock{
  display: flex;
  align-items: center;
}
.newRule {
  width: 40%;
  margin: 0 10px 0 10px;
}
.consequentInput {
  width: 20%;
}
.newFact {
  width: 25%;
}
</style>
