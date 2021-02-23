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
        <b-table striped hover :items="cycles[cycleNum]" v-bind:dark="darkTheme" @mouseover="test(1)" @row-hovered="rowHovered" @row-unhovered="rowUnhovered"></b-table>
      </div>

      <div class="col-3">

        <b-card title="Control Panel" v-bind:bg-variant="!darkTheme ? 'light' : 'dark'" v-bind:text-variant="!darkTheme ? '' : 'white'">
          <b-card-text>
            <div class="cyclesDiv">
              <span>Cycles</span>
              <span>[{{cycleNum + 1}} of {{cycles.length}}]</span>
              <span>
                <b-icon :class="['cyclesIconLeft', decreaseCycleDisabled ? 'iconDisabled' : 'iconEnabled']" 
                  icon="dash-circle" aria-hidden="true" @click="decreaseCyclesNum"></b-icon>
                <b-icon :class="['cyclesIconRight', increaseCycleDisabled ? 'iconDisabled' : 'iconEnabled']"
                  icon="plus-circle" aria-hidden="true" @click="increaseCyclesNum"></b-icon>
              </span>
            </div>
            <div class="cyclesDiv">
              <div>
              <SwitchGroup :darkTheme="darkTheme" :settings="settings" v-model="selectedSettings"/>
              </div>
              <div>
                <b-icon :class="['cyclesIconRight', selectedSettings.includes('rand_facts') ? 'iconEnabled' : 'iconDisabled']"
                  icon="arrow-clockwise" aria-hidden="true" @click="reloadFacts" :animation="reloadingFacts ? 'spin' : ''"></b-icon><br/>
                <b-icon :class="['cyclesIconRight', selectedSettings.includes('rand_rules') ? 'iconEnabled' : 'iconDisabled']"
                     icon="arrow-clockwise" aria-hidden="true" @click="reloadRules" :animation="reloadingRules ? 'spin' : ''"></b-icon>
              </div>
            </div>
          </b-card-text>
        </b-card>
      </div>
      <div class="col"></div>
    </div>
  </div>
</template>

<script>
import SwitchGroup from '@/components/SwitchGroup.vue';

export default {
  props: {
    darkTheme: {
      type: Boolean,
      required: true
    }
  },
  components: {
    SwitchGroup,
  },
  data() {
    return {
      variables : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
      stdFacts: ['A','B','C','D','E'],
      savedFacts: [],
      cycleNum : -1,
      ruleHovered: -1,
      selectedSettings : [],
      settings : [
        { text: 'Random facts', value: 'rand_facts' },
        { text: 'Random rules', value: 'rand_rules' },
        ],
      reloadingFacts : false,
      reloadingRules : false,
    }
  },
  computed: {
    currentFacts: function() {
      return this.selectedSettings.includes('rand_facts') ? this.savedFacts : this.stdFacts;
    },
    rules: function(){
      let arr = []; 
      arr.push({id: 1, ant: 'Y & D', cons: 'Z'});
      arr.push({id: 2, ant: 'X & B & E', cons: 'Y'});
      arr.push({id: 3, ant: 'A', cons: 'X'});
      arr.push({id: 4, ant: 'C', cons: 'L'});
      arr.push({id: 5, ant: 'L & M', cons: 'N'});
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
        this.rules.forEach(ruleObj => {
          if(this.validateAnt(ruleObj.ant, currFacts) && !currFacts.includes(ruleObj.cons))
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
    factsPrintable: function() {
      let str = '';
      this.currentFacts.forEach((fact, index) => {
        str += fact + (index == this.savedFacts.length - 1 ? '' : ', ');
      });
      return str;
    },
    rulesPrintable: function() {
      let str = [];
      this.rules.forEach(ruleObj => 
        str.push('R' + ruleObj.id + ': ' + ruleObj.ant + ' → ' + ruleObj.cons));
      return str;
    },
    increaseCycleDisabled: function() {
      return this.cycleNum === this.cycles.length - 1;
    },
    decreaseCycleDisabled: function() {
      return this.cycleNum === -1;
    }
  },
  methods: {
    generatedFacts() {
      let factsNum = Math.floor(Math.random() * 5) + 3;
      let facts = [];
      while(facts.length !== factsNum)
      {
        let newFact = this.variables[Math.floor(Math.random() * this.variables.length)];
        if(!facts.includes(newFact))
          facts.push(newFact);
      }
      return facts.sort();
    },
    validateAnt(ant, facts) {
      let splitty = ant.split(' & ');
      for(let i = 0; i < splitty.length; i++)
      {
        if(!facts.includes(splitty[i]))
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
      if(!this.selectedSettings.includes('rand_facts'))
        return;
      this.reloadingFacts = true;
      this.savedFacts.splice(0, this.savedFacts.length, ...this.generatedFacts());
      setTimeout(() => {
        this.reloadingFacts = false;}, 2000);
    },
    reloadRules () {
      if(!this.selectedSettings.includes('rand_rules'))
        return;
      this.reloadingRules = true;
      //this.savedFacts.splice(0, -1, ...this.generatedFacts());
      setTimeout(() => {
        this.reloadingRules = false;}, 2000);
    }
  },
  watch: {
    cycles() {
      if(this.cycleNum > this.cycles.length - 1)
        this.cycleNum = this.cycles.length - 1;
    },
  },
  created() {
    this.savedFacts.splice(0, this.savedFacts.length, ...this.generatedFacts());
  }
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
  color: #f5d782;
  cursor: pointer;
}
.highlightedRule {
  font-weight: bold;
}
</style>
