<template>
  <div v-if="searched.trim()">
  <b-card title="Search Result" v-bind:bg-variant="!darkTheme ? 'light' : 'dark'" 
    v-bind:text-variant="!darkTheme ? '' : 'white'" >
    <b-card-body>
      <b-card-text>
        <b-spinner type="grow" label="Loading..." v-if="!loaded" :variant="darkTheme ? 'light' : 'dark'"></b-spinner>
        <div>
        <span v-if="!Object.keys(chosenNoun).length && 
                     !Object.keys(chosenVerb).length && 
                     !Object.keys(chosenAdv).length && 
                     !Object.keys(chosenAdj).length &&
                     loaded">Nothing found.<br/><br/></span>

        <DictEntry :ptrSymbols="ptrSymbols" :depth="depth" entryType="Noun" 
           :data="chosenNoun" :darkTheme="darkTheme" v-if="Object.keys(chosenNoun).length"/>

        <DictEntry :ptrSymbols="ptrSymbols" :depth="depth" entryType="Verb" 
           :data="chosenVerb" :darkTheme="darkTheme" v-if="Object.keys(chosenVerb).length"/>

        <DictEntry :ptrSymbols="ptrSymbols" :depth="depth" entryType="Adjective" 
           :data="chosenAdj" :darkTheme="darkTheme" v-if="Object.keys(chosenAdj).length"/>

        <DictEntry :ptrSymbols="ptrSymbols" :depth="depth" entryType="Adverb" 
           :data="chosenAdv" :darkTheme="darkTheme" v-if="Object.keys(chosenAdv).length"/>

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
    darkTheme: {required: true},
    ptrSymbols: {required: true},
    searched: {required: true},
    depth: {required: true},
    chosenNoun: {required: true},
    chosenVerb: {required: true},
    chosenAdj: {required: true},
    chosenAdv: {required: true},
    loaded: {required: true},
  },
  components: {
    DictEntry
  }
}
</script>
<style scoped lang="scss">
footer {
  padding: 10px;
}
#lightFooter a {
  font-weight: bold;
  color: #2c3e50;
}

#darkFooter a {
  font-weight: bold;
  color: $text-primary-dark;
}
</style>
