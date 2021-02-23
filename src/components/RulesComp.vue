<template>
  <div class="rulesComp">
    <div class="row">
      <div class="col"></div>

      <!-- Facts and DB -->
      <div class="col">
        <b-card class="dataCard" v-bind:bg-variant="!darkTheme ? 'light' : 'dark'" v-bind:text-variant="!darkTheme ? '' : 'white'">
          <b-card-text>
            <p class="dataTitle">Facts</p>
            {{factsPrintable}}
            <br/><br/>
            <p class="dataTitle">Rules</p>
            <span v-for="(rule, index) in rulesPrintable" :key="rule">
              <span :class="{'highlightedRule' : index+1 == ruleHovered}">{{rule}}<br/></span>
            </span>

          </b-card-text>
        </b-card>
      </div>

      <!-- Rules table -->
      <div class="col" v-if="cycleNum >= 0">
        <b-table striped hover :items="cycles[cycleNum]" v-bind:dark="darkTheme" @row-hovered="rowHovered" @row-unhovered="rowUnhovered"></b-table>
      </div>

      <div class="col-3">

        <b-card title="Control Panel" v-bind:bg-variant="!darkTheme ? 'light' : 'dark'" v-bind:text-variant="!darkTheme ? '' : 'white'">
          <b-card-text>
            <div class="cyclesDiv">
              <span>Cycles</span>
              <span>[{{cycleNum + 1}} of {{cycles.length}}]</span>
              <span>
                <b-icon :class="['cyclesIconLeft', decreaseCycleDisabled ? 'iconDisabled' : 'iconEnabled', darkTheme ? 'iconDark' : 'iconLight']" 
                 icon="dash-circle" aria-hidden="true" @click="decreaseCyclesNum"></b-icon>
                <b-icon :class="['cyclesIconRight', increaseCycleDisabled ? 'iconDisabled' : 'iconEnabled', darkTheme ? 'iconDark' : 'iconLight']"
                                    icon="plus-circle" aria-hidden="true" @click="increaseCyclesNum"></b-icon>
              </span>
            </div>
            <div class="cyclesDiv">
              <span class="toggleBlock"><ToggleSwitch class="switchPadding" :darkTheme="darkTheme" v-model="rand_facts"/>  Random facts</span>
              <b-form-input size="sm" v-model="numFacts" :disabled="!rand_facts"
                                      :class="{'shake' : invalidFactsNumber, 'darkInputForm' : darkTheme, 'smallInput' : 'true', 'disabledInput' : !rand_facts}"></b-form-input>
              <b-icon :class="['cyclesIconRight', rand_facts ? 'iconEnabled' : 'iconDisabled', darkTheme ? 'iconDark' : 'iconLight']"
                                      icon="arrow-clockwise" aria-hidden="true" @click="reloadFacts" :animation="reloadingFacts ? 'spin' : ''"></b-icon>
            </div>
            <div class="cyclesDiv">
              <span class="toggleBlock"><ToggleSwitch class="switchPadding" :darkTheme="darkTheme" v-model="rand_rules"/>Random rules</span>
              <b-form-input size="sm" v-model="numRules" :disabled="!rand_rules"
                                      :class="{'shake' : invalidRulesNumber, 'darkInputForm' : darkTheme, 'smallInput' : 'true', 'disabledInput' : !rand_rules}"></b-form-input>
              <b-icon :class="['cyclesIconRight', rand_rules? 'iconEnabled' : 'iconDisabled', darkTheme ? 'iconDark' : 'iconLight']"
                                      icon="arrow-clockwise" aria-hidden="true" @click="reloadRules" :animation="reloadingRules ? 'spin' : ''"></b-icon>
            </div>
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
        </b-card>
      </div>
      <div class="col" v-if="addedMapping.length">
        <b-table striped hover :items="addedMapping" :fields="fields" v-bind:dark="darkTheme" >
          <template #cell(remove)="row">
            <b-icon icon="x-circle" aria-hidden="true" @click="removeMapping(row.index)"
              :class="[darkTheme ? 'iconDark' : 'iconLight']"></b-icon>
          </template>
        </b-table>
      </div>
      <div class="col"></div>
    </div>
  </div>
</template>

<script>
//TODO: implement writing own formulas
import ToggleSwitch from '@/components/ToggleSwitch.vue';

export default {
  props: {
    darkTheme: {
      type: Boolean,
      required: true
    }
  },
  components: {
    ToggleSwitch,
  },
  data() {
    return {
      variables : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
      stdFacts: ['A','B','C','D','E'],
      fields: ["from", "to", "remove"],
      savedFacts: [],
      savedRules: [],
      addedMapping: [],
      cycleNum : -1,
      ruleHovered: -1,
      selectedSettings : [],
      settings : [
        { text: 'Random facts', value: 'rand_facts' },
        { text: 'Random rules', value: 'rand_rules' },
        ],
      rand_facts : false,
      rand_rules : false,
      num_rand_facts_bool : false,
      num_rand_rules_bool : false,
      reloadingFacts : false,
      reloadingRules : false,
      numRules : 6,
      numFacts: 4,
      mapFrom : '',
      mapTo : '',
    }
  },
  computed: {
    invalidFactsNumber: function() {
      return !this.numFacts || isNaN(this.numFacts) || ('' + this.numFacts).includes('.') ||
        parseInt(this.numFacts) > this.variables.length;
    },
    invalidRulesNumber: function() {
      return !this.numRules || isNaN(this.numRules) || ('' + this.numRules).includes('.');
    },
    currentFacts: function() {
      return this.rand_facts ? this.savedFacts : this.stdFacts;
    },
    currentRules: function() {
      return this.rand_rules ? this.savedRules: this.rules;
    },
    currentMappings: function() {
      let map = new Map();
      this.variables.forEach(vr => map.set(vr, vr));
      this.addedMapping.forEach(mapping => {
        map.set(mapping['from'], mapping['to']);
      });
      console.log(map);

      return map;
    },
    rules: function(){
      let arr = []; 
      arr.push({id: 1, ant: ['Y', 'D'], cons: 'Z'});
      arr.push({id: 2, ant: ['X', 'B', 'E'], cons: 'Y'});
      arr.push({id: 3, ant: ['A'], cons: 'X'});
      arr.push({id: 4, ant: ['C'], cons: 'L'});
      arr.push({id: 5, ant: ['L', 'M'], cons: 'N'});
      return arr;
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
        this.currentRules.forEach(ruleObj => {
          if(this.validateAnt(ruleObj.ant, currFacts) && !currFacts.includes(ruleObj.cons))
            tempAddedFacts.push({rule: ruleObj.id, fact: ruleObj.cons});
        });
        tempAddedFacts.forEach((addedObj, index) => {
          data.push({cycle: index === 0 ? cycleN++ : '', 
            fired_rules: 'R' + addedObj['rule'], added_facts: this.currentMappings.get(addedObj['fact'])});
          currFacts.push(addedObj['fact']);
        });
        if(tempAddedFacts.length !== 0)
          cyclesData.push([...data]);
      } while(tempAddedFacts.length !== 0);
      data.push({cycle: cycleN, fired_rules: '', added_facts: ''});
      cyclesData.push([...data]);
      return cyclesData;
    },
    factsPrintable: function() {
      let str = '';
      this.currentFacts.forEach((fact, index) => {
        str += this.currentMappings.get(fact) + (index == this.currentFacts.length - 1 ? '' : ', ');
      });
      return str;
    },
    rulesPrintable: function() {
      let str = [];

      this.currentRules.forEach(ruleObj => {
        let antStr = '';
        ruleObj.ant.forEach((el,index) => {
          antStr += this.currentMappings.get(el);
          if(index !== ruleObj.ant.length - 1)
            antStr += " & ";
        });
        str.push('R' + ruleObj.id + ': ' + antStr + ' → ' + this.currentMappings.get(ruleObj.cons));
      });
      return str;
    },
    currentMappingsPrintable: function() {
      let mappings = [];
      console.log(this.addedMapping);
      this.addedMapping.forEach((to, from)=> mappings.push({from: from, to: to}));
      return mappings;
    },
    increaseCycleDisabled: function() {
      return this.cycleNum === this.cycles.length - 1;
    },
    decreaseCycleDisabled: function() {
      return this.cycleNum === -1;
    },
    isMapValid: function() {
      if(!this.mapTo.trim() || !this.mapFrom.trim() || !this.variables.includes(this.mapFrom.trim().toUpperCase()))
        return false;
      let isPresent = false;
      //Check if mapping is already present
      for(let i = 0; i < this.addedMapping.length; i++)
      {
        let map = this.addedMapping[i];
        console.log({from: this.mapFrom, to: this.mapTo, map: map['from'], map2: map['to']});
        if(map['to'].toUpperCase().localeCompare(this.mapTo.toUpperCase().trim()) === 0 &&
        map.from.toUpperCase().localeCompare(this.mapFrom.trim()))
        {
          isPresent = true;
          break;
        }
      }
      if(isPresent)
        return false;
      return true;
    }
  },
  methods: {
    removeMapping(index) {
      this.addedMapping.splice(index,1);
    },
    addMapping() {
      if(!this.isMapValid || !this.mapTo.trim())
        return;
      let index = -1;
      for(let i = 0; i < this.addedMapping.length; i++)
      {
        let mapping = this.addedMapping[i];
        if(mapping.from.localeCompare(this.mapFrom.trim().toUpperCase()) === 0)
          index = i;
      }
      if(index === -1)
        this.addedMapping.splice(this.addedMapping.length, 0, {from: this.mapFrom.toUpperCase(), to: this.mapTo});
      else
        this.addedMapping.splice(index, 1,{from: this.mapFrom.toUpperCase().trim(), to: this.mapTo.trim()});
      this.mapFrom = '';
      this.mapTo = '';
      console.log(this.$refs.fromInputField);
      this.$refs.fromInputField.$el.focus();
    },
    generatedFacts() {
      if(this.invalidFactsNumber)
        return [];
      let facts = [];
      let count = 0;
      while(facts.length !== parseInt(this.numFacts))
      {
        let newFact = this.variables[Math.floor(Math.random() * this.variables.length)];
        if(!facts.includes(newFact))
          facts.push(newFact);
        if(count++ > 40)
          break;
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
        let alreadyExists = false;
        for(let j = 0; j < rules.length; j++)
        {
          let currAnts = rules[j]['ant'].sort();
          let haveSameAnts = true;
          if(currAnts.length !== ants.length)
            continue;

          ants.sort().forEach((el, index) => {
            if(currAnts[index].localeCompare(el))
              haveSameAnts = false;
          });

          
          if(haveSameAnts && rules[j]['cons'].localeCompare(cons) === 0)
          {
            alreadyExists = true;
            break;
          }
        }
        if(alreadyExists)
        {
          i--;
          continue;
        }
        rules.push({id: i + 1, ant: ants, cons: cons});
      }
      return rules;
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
      if(!this.rand_facts)
        return;
      this.reloadingFacts = true;
      this.savedFacts.splice(0, this.savedFacts.length, ...this.generatedFacts());
      setTimeout(() => {
        this.reloadingFacts = false;}, 2000);
    },
    reloadRules () {
      if(!this.rand_rules)
        return;
      this.reloadingRules = true;
      this.savedRules.splice(0, this.savedRules.length, ...this.generateRules());
      setTimeout(() => {
        this.reloadingRules = false;}, 2000);
    }
  },
  watch: {
    cycles() {
      if(this.cycleNum > this.cycles.length - 1)
        this.cycleNum = this.cycles.length - 1;
    },
    numRules() {
      this.savedRules.splice(0, this.savedRules.length, ...this.generateRules());
    },
    numFacts() {
      this.savedFacts.splice(0, this.savedFacts.length, ...this.generatedFacts());
    },
  },
  created() {
    this.savedFacts.splice(0, this.savedFacts.length, ...this.generatedFacts());
    this.savedRules.splice(0, this.savedRules.length, ...this.generateRules());
  },
}
</script>

<style scoped>
.dataCard {
  text-align: left;
}
.dataTitle {
  font-weight: bold;
}

.cyclesDiv {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.cyclesIconLeft {
  margin-right: 5px;
}
.cyclesIconRight {
  margin-left: 5px;
}

.iconDisabled{
opacity: 0.5;
}

.iconEnabled{
  opacity: 1;
  cursor: pointer;
}
.iconDark {
  color: #f5d782;
}
.iconLight {
  color: #111;
}
.highlightedRule {
  font-weight: bold;
}
.toggleBlock{
  display: flex;
  align-items: center;
}
.switchPadding {
  margin-right:10px;
}
.smallInput {
  width: 50px;
}
.mediumInput {
  width: 25%;
}
.darkInputForm {
  background-color: #303131;
  border: 1px solid #111;
  color: #f8f1f1;
}
.shake {
  animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
}
@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
.disabledInput {
  opacity: 0.7;
}
</style>
