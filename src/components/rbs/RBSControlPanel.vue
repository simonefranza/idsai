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
import { PassThrough } from 'stream';
export default {
  data() {
    return {
      reloadingFacts : false,
      reloadingRules : false,
      newFact: '',
      newAntecedents: '',
      newAntParseTree: 0,
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
    antParseTree: function() {
      return this.createParseTree(this.newAntecedents.trim());
    },
    antLeaves: function() {
      return this.findLeaves(this.antParseTree);
    },
    invalidNewAntecedents: function() {
      if(!this.newAntecedents.trim())
        return true;
      let splitty = this.newAntecedents.trim().split(' ').filter(el => el);
      console.log(splitty, this.variables);

      let parseTree = this.antParseTree;
      console.log('finalTree', parseTree);
      if(parseTree === -1 || parseTree === true || parseTree === false)
        return true;
      let leaves = this.antLeaves;
      console.log('leaves', leaves);
      for(let leaf of leaves){
        console.log(leaf, this.newConsequent);
        if(leaf.localeCompare(this.newConsequent.trim()) === 0)
          return true;
      }
      return false;
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
      console.log('bub');
      //return !this.isRuleAlreadyPresent([...this.antecedentsToAdd], this.newConsequent.trim(), this.rules);
      return true;
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
    findLeaves(parseTree) {
      let leaves = [];
      if(parseTree['left'] && parseTree['right'])
      {
        let leftLeaves = this.findLeaves(parseTree['left']);
        let rightLeaves = this.findLeaves(parseTree['right']);
        leaves.push(...leftLeaves, ...rightLeaves);
        return leaves;
      }
      return [parseTree['node']];
    },
    createParseTree(ant) {
      console.log(ant);
      let splitty = ant.replace(/\s/g, '').split(/(?=[&|()])|(?<=[&|()])/g);
      console.log('split', splitty);
      let parCheck = this.checkParentheses(splitty);
      console.log('parcheck', parCheck);
      if(parCheck === false)
        return false;
      let orderCheck = this.checkOrder(splitty);
      console.log('orderCheck', orderCheck);
      if(!orderCheck)
        return false;
      return this.recTree(splitty, parCheck);
    },
    checkOrder(splitty) {
      if(splitty.length < 2)
        return true;
      if(splitty.length === 2 && (splitty[0].localeCompare('(') || splitty[1].localeCompare(')')))
        return false;
      if(splitty[0].localeCompare('&') === 0 || splitty[0].localeCompare('|') === 0 ||
          splitty[splitty.length - 1].localeCompare('&') === 0 || splitty[splitty.length -1].localeCompare('|') === 0)
        return false;
      let isLastVar = false;
      let isLastOpenedPar = false;
      let isLastClosedPar = false;
      if(splitty[0].localeCompare('(') === 0)
        isLastOpenedPar = true;
      else
        isLastVar = true;
      //Check if sequence is symbol operation symbol ...
      for(let [idx,el] of splitty.slice(1,splitty.length).entries()) {
        //after a var there needs to be an & or |
        if(isLastVar && el.localeCompare(')') === 0)
        {
          isLastVar = false;
          isLastClosedPar = true;
        }
        else if(isLastVar && el.localeCompare('&') && el.localeCompare('|'))
          return false;
        else if(isLastVar)
          isLastVar = false;
        else if(isLastOpenedPar && (el.localeCompare('&') === 0 || el.localeCompare('|') === 0))
          return false;
        else if(isLastOpenedPar && el.localeCompare('(') === 0)
          isLastOpenedPar = true;
        else if(isLastOpenedPar && el.localeCompare(')') === 0)
        {
          isLastClosedPar = true;
          isLastOpenedPar = false;
        }
        else if(isLastOpenedPar)
        {
          isLastOpenedPar = false;
          isLastVar = true;
        }
        else if(isLastClosedPar && el.localeCompare(')') === 0)
          isLastClosedPar = true;
        else if(isLastClosedPar && el.localeCompare('(') === 0)
          return false;
        else if(isLastClosedPar && (el.localeCompare('&') === 0 || el.localeCompare('|') === 0))
        {
          isLastClosedPar = false;
        }
        else if(isLastClosedPar)
          return false;
        else if(el.localeCompare('&') === 0 || el.localeCompare('|') === 0)
          return false;
        else if(el.localeCompare('(') === 0)
          isLastOpenedPar = true;
        else if(el.localeCompare(')') === 0)
          isLastClosedPar =true;
        else if(el.localeCompare('&') && el.localeCompare('|'))
          isLastVar = true;
      }
      return true;
    },
    checkParentheses(splitty) {
      let stack = [];
      let valid = true;
      let correspondences = [];
      for(let [index, el] of splitty.entries()) {
        if(el.localeCompare('(') === 0)
          stack.push({'(' : index, 'high_level' : stack.length === 0});
        else if(el.localeCompare(')') === 0 && stack.length)
        {
          let popped = stack.pop();
          correspondences.push([popped['('], index, popped['high_level']]);
        }
        else if(el.localeCompare(')') === 0)
        {
          valid = false;
          break;
        }
      }
      if(!valid || stack.length !== 0)
        return false;
      else 
        return correspondences;
    },
    recTree(splitty, parIndexes) {
      [splitty, parIndexes] = this.trimParentheses(splitty, parIndexes);
      if(splitty.length === 1 && !splitty.includes('&') && !splitty.includes('|') && !splitty.includes('(') && 
        !splitty.includes(')'))
        return {'node' : splitty[0]};
      else if(splitty.length === 1)
        return -1;
      else if(splitty.length === 0)
        return true;
      let newOrIdx = splitty.indexOf('|');
      while(newOrIdx !== -1) {
        let [leftSide, rightSide] = this.splitLeftRightSide(splitty, parIndexes, newOrIdx);
        if(!leftSide && !rightSide)
        {
          newOrIdx = splitty.indexOf('|', newOrIdx + 1);
          continue;
        }
        let leftChild = this.recTree(leftSide, this.checkParentheses(leftSide));
        let rightChild = this.recTree(rightSide, this.checkParentheses(rightSide));
        if(leftChild === -1 || rightChild === -1)
          return -1;
        if(leftChild === true)
          return rightChild;
        if(rightChild === true)
          return leftChild;
        if(leftChild !== false && rightChild !== false)
          return {'node' : '|', 'left' : leftChild, 'right' : rightChild}; 
        return false;
      }


      let newAndIdx = splitty.indexOf('&');
      while(newAndIdx !== -1) {
        let [leftSide, rightSide] = this.splitLeftRightSide(splitty, parIndexes, newAndIdx);
        if(!leftSide && !rightSide)
        {
          newAndIdx = splitty.indexOf('&', newAndIdx + 1);
          continue;
        }
        let leftChild = this.recTree(leftSide, this.checkParentheses(leftSide));
        let rightChild = this.recTree(rightSide, this.checkParentheses(rightSide));
        if(leftChild === -1 || rightChild === -1)
          return -1;
        if(leftChild === true)
          return rightChild;
        if(rightChild === true)
          return leftChild;
        if(leftChild !== false && rightChild !== false)
          return {'node' : '&', 'left' : leftChild, 'right' : rightChild}; 
        return false;
      }
      console.log("smth went wrong", splitty);
      return false;
    },
    trimParentheses(splitty, parIndexes) {
      for(let par of parIndexes) {
        if(par[0] === 0 && par[1] === splitty.length - 1)
        {
          splitty = splitty.slice(1, splitty.length - 1);
          parIndexes = this.checkParentheses(splitty);
          return this.trimParentheses(splitty, parIndexes);
        }
      }
      return [splitty, parIndexes];
    },
    splitLeftRightSide(splitty, parIndexes, newIdx){
      let isContained = false;
      for(let par of parIndexes) {
        if(par[2] && newIdx > par[0] && newIdx < par[1])
        {
          isContained = true;
          break;
        }
      }
      if(isContained)
      {
        return [false, false];
      }
      let leftSide = splitty.slice(0, newIdx); 
      for(let par of parIndexes) {
        if(par[0] === 0 && par[1] === newIdx - 1)
        {
          leftSide = leftSide.slice(1, newIdx - 1);
          break;
        }
      }
      let rightSide = splitty.slice(newIdx + 1, splitty.length); 
      for(let par of parIndexes) {
        if(par[0] === newIdx + 1 && par[1] === splitty.length - 1)
        {
          rightSide = rightSide.slice(1, rightSide.length - 1);
          break;
        }
      }
      return [leftSide, rightSide];
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
      this.$emit('newRule', {ant: this.antParseTree, leaves: this.antLeaves, cons: this.newConsequent.trim()})
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
