<template>
  <div v-if="searched.trim()">
  <b-card title="Search Result" v-bind:bg-variant="!darkTheme ? 'light' : 'dark'" 
    v-bind:text-variant="!darkTheme ? '' : 'white'" >
    <b-card-body>
      <b-card-text>
        <b-spinner type="grow" label="Loading..." v-if="!loaded" :variant="darkTheme ? 'light' : 'dark'"></b-spinner>
        <div>
          <span v-if="isNothingFound && loaded">Nothing found.<br/><br/></span>

          <span v-else v-for="(entry,index) in dictEntries"
                :key="entry.entryLabel">
            <DictEntry :ptrSymbols="ptrSymbols" 
                :depth="depth" 
                :entryType="entry.entryLabel" 
                :array="entry.array" 
                :chosenIndex="index === chosenGroup ? chosenIndex : -1"
                v-model="hovered"
                @newGraph="chosenGraph($event, index)"
                v-if="entry.array.length"/>
          </span>
        </div>

        <footer :id="darkTheme? 'darkFooter' : 'lightFooter'">
          Princeton University "About WordNet." 
          <a href="https://wordnet.princeton.edu">WordNet</a>. 
          Princeton University. 2010.
        </footer>
      </b-card-text>
    </b-card-body>
  </b-card>
  </div>
</template>

<script>
import DictEntry from "./DictEntry";
export default {
  props: {
    ptrSymbols: {required: true},
    searched: {required: true},
    depth: {required: true},
    chosenNoun: {required: true},
    chosenVerb: {required: true},
    chosenAdj: {required: true},
    chosenAdv: {required: true},
    chosenGroup: {required:  true},
    chosenIndex: {required:true},
    loaded: {required: true},
    value: {required: true},
  },
  computed: {
    darkTheme() {
      return this.$store.state.darkTheme;
    },
    isNothingFound() {
      return !this.chosenNoun.length && !this.chosenVerb.length &&
        !this.chosenAdj.length && !this.chosenAdv.length;
    },
    dictEntries() {
      return [
        {array: this.chosenNoun, entryLabel: 'Noun'},
        {array: this.chosenVerb, entryLabel: 'Verb'},
        {array: this.chosenAdj, entryLabel: 'Adjective'},
        {array: this.chosenAdv, entryLabel: 'Adverb'},
      ];


    },
  },
  components: {
    DictEntry
  },
  data() {
    return {
      hovered: '',
    }
  },
  model: {
    event: "isHovered"
  },
  created() {
    this.hovered = this.value;
  },
  watch: {
    value(newV) {
      this.hovered = newV;
    },
    hovered() {
      this.$emit("isHovered", this.hovered);
    },
  },
  methods: {
    chosenGraph(e,index) {
      e.group = index;
      this.$emit("graphChosen", e);
    }

  }

}
</script>
<style scoped lang="scss">
footer {
  padding: 10px;
}
#lightFooter a {
  font-weight: bold;
  color: $vue-primary;
}

#darkFooter a {
  font-weight: bold;
  color: $text-primary-dark;
}
</style>
