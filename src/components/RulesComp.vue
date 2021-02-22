<template>
  <div class="rulesComp">
    <div class="row">
      <div class="col"></div>

      <!-- Facts and DB -->
      <div class="col">
        <b-card class="dataCard" v-bind:bg-variant="!darkTheme ? 'light' : 'dark'" v-bind:text-variant="!darkTheme ? '' : 'white'">
          <b-card-text>
            <p class="dataTitle">Facts</p>
            <span v-for="(fact, index) in facts" :key="fact">
              {{fact}}
              <span v-if="index !== facts.length - 1">,</span>
            </span>
            <br/> <br/>
            <p class="dataTitle">Rules</p>
            <span v-for="ruleObj in rules" :key="ruleObj.id">
              R{{ruleObj.id}}: {{ruleObj.ant}} → {{ruleObj.cons}}<br/>
            </span>

          </b-card-text>
        </b-card>
      </div>

      <!-- Rules table -->
      <div class="col">
        <b-table striped hover :items="cycles" v-bind:dark="darkTheme" ></b-table>
      </div>

      <div class="col-3">

        <b-card title="Control Panel" v-bind:bg-variant="!darkTheme ? 'light' : 'dark'" v-bind:text-variant="!darkTheme ? '' : 'white'">
          <b-card-text>
            <div class="row">
              <div class="col-6 panelSwitches">
                <SwitchGroup :darkTheme="darkTheme" :settings="settings" v-model="selectedSettings" />
              </div>
              <div class="col-6 panelSwitches">
                <SwitchGroup :darkTheme="darkTheme" :settings="querySettings" v-model="selectedQuerySett" />
              </div>
            </div>
            <div>
              Ignored words (comma separated)
            </div>
            <div>
              <b-form-input :class="{'darkInputForm' : darkTheme}" v-model="ignoredTermsInput" placeholder="Ignored words comma separated"></b-form-input>

            </div>
          </b-card-text>
        </b-card>
      </div>
      <div class="col"></div>
    </div>
  </div>
</template>

<script>


export default {
  props: {
    darkTheme: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      variables : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
      facts: ['A','B','C','D','E'],
    }
  },
  computed: {
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
      let currentFacts = [...this.facts];
      let data = [];
      let tempAddedFacts = [];
      let cycleN = 1;
      do 
      {
        tempAddedFacts = [];
        this.rules.forEach(ruleObj => {
          if(this.validateAnt(ruleObj.ant, currentFacts) && !currentFacts.includes(ruleObj.cons))
            tempAddedFacts.push(ruleObj.cons);
        });
        currentFacts.splice(currentFacts.length, 0, ...tempAddedFacts);
        data.push({cycle: cycleN++, added_facts: tempAddedFacts});
        console.log({tempAdded: tempAddedFacts, curr: currentFacts});

      } while(tempAddedFacts.length !== 0);
      return data;
    }
  },
  methods: {
    validateAnt(ant, facts) {
      let splitty = ant.split(' & ');
      for(let i = 0; i < splitty.length; i++)
      {
        console.log({fact: splitty[i]});
        if(!facts.includes(splitty[i]))
          return false;
      }
      return true;
    }

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
</style>
