<template>
  <ul v-if="depth" class="recSymbol">
    <li v-if="hypernyms.length">
      <b-icon icon="plus-circle" v-if="!showHypernym" @click="showHypernym = !showHypernym" class="iconNoHighlight" :class='darkTheme? "iconDark" : "iconLight"'/>
        <b-icon icon="dash-circle" v-else @click="showHypernym = !showHypernym" class="iconNoHighlight" :class='darkTheme? "iconDark" : "iconLight"'/>
      <span @click="showHypernym = !showHypernym"> Hypernym</span>
      <SymbolList v-if="showHypernym" :data="hypernyms" :depth="depth" :ptrSymbols="ptrSymbols" :darkTheme="darkTheme"/>
    </li>
    <li v-if="hyponyms.length">
      <b-icon icon="plus-circle" v-if="!showHyponym" @click="showHyponym = !showHyponym" class="iconNoHighlight" :class='darkTheme? "iconDark" : "iconLight"'/>
        <b-icon icon="dash-circle" v-else @click="showHyponym = !showHyponym" class="iconNoHighlight" :class='darkTheme? "iconDark" : "iconLight"'/>
          <span @click="showHyponym = !showHyponym"> Hyponym</span>
      <SymbolList v-if="showHyponym" :data="hyponyms" :depth="depth" :ptrSymbols="ptrSymbols" :darkTheme="darkTheme"/>
    </li>
    <li v-if="memberHolonym.length">
    <b-icon icon="plus-circle" v-if="!showMemberHolonym" @click="showMemberHolonym = !showMemberHolonym" class="iconNoHighlight" :class='darkTheme? "iconDark" : "iconLight"'/>
      <b-icon icon="dash-circle" v-else @click="showMemberHolonym = !showMemberHolonym" class="iconNoHighlight" :class='darkTheme? "iconDark" : "iconLight"'/>
        <span @click="showMemberHolonym = !showMemberHolonym"> Member Holonym</span>
      <SymbolList v-if="showMemberHolonym" :data="memberHolonym" :depth="depth" :ptrSymbols="ptrSymbols" :darkTheme="darkTheme"/>
    </li>
    <li v-if="substanceHolonym.length">
    <b-icon icon="plus-circle" v-if="!showSubstanceHolonym" @click="showSubstanceHolonym = !showSubstanceHolonym" class="iconNoHighlight" :class='darkTheme? "iconDark" : "iconLight"'/>
      <b-icon icon="dash-circle" v-else @click="showSubstanceHolonym = !showSubstanceHolonym" class="iconNoHighlight" :class='darkTheme? "iconDark" : "iconLight"'/>
        <span @click="showSubstanceHolonym = !showSubstanceHolonym"> Substance Holonym</span>
      <SymbolList v-if="showSubstanceHolonym" :data="substanceHolonym" :depth="depth" :ptrSymbols="ptrSymbols" :darkTheme="darkTheme"/>
    </li>
    <li v-if="partHolonym.length">
    <b-icon icon="plus-circle" v-if="!showPartHolonym" @click="showPartHolonym = !showPartHolonym" class="iconNoHighlight" :class='darkTheme? "iconDark" : "iconLight"'/>
      <b-icon icon="dash-circle" v-else @click="showPartHolonym = !showPartHolonym" class="iconNoHighlight" :class='darkTheme? "iconDark" : "iconLight"'/>
        <span @click="showPartHolonym = !showPartHolonym"> Part Holonym</span>
      <SymbolList v-if="showPartHolonym" :data="partHolonym" :depth="depth" :ptrSymbols="ptrSymbols" :darkTheme="darkTheme"/>
    </li>
    <li v-if="memberMeronym.length">
    <b-icon icon="plus-circle" v-if="!showMemberMeronym" @click="showMemberMeronym = !showMemberMeronym" class="iconNoHighlight" :class='darkTheme? "iconDark" : "iconLight"'/>
      <b-icon icon="dash-circle" v-else @click="showMemberMeronym = !showMemberMeronym" class="iconNoHighlight" :class='darkTheme? "iconDark" : "iconLight"'/>
        <span @click="showMemberMeronym = !showMemberMeronym"> Member Meronym</span>
      <SymbolList v-if="showMemberMeronym" :data="memberMeronym" :depth="depth" :ptrSymbols="ptrSymbols" :darkTheme="darkTheme"/>
    </li>
    <li v-if="substanceMeronym.length">
    <b-icon icon="plus-circle" v-if="!showSubstanceMeronym" @click="showSubstanceMeronym = !showSubstanceMeronym" class="iconNoHighlight" :class='darkTheme? "iconDark" : "iconLight"'/>
      <b-icon icon="dash-circle" v-else @click="showSubstanceMeronym = !showSubstanceMeronym" class="iconNoHighlight" :class='darkTheme? "iconDark" : "iconLight"'/>
        <span @click="showSubstanceMeronym = !showSubstanceMeronym"> Substance Meronym</span>
      <SymbolList v-if="showSubstanceMeronym" :data="substanceMeronym" :depth="depth" :ptrSymbols="ptrSymbols" :darkTheme="darkTheme"/>
    </li>
    <li v-if="partMeronym.length">
    <b-icon icon="plus-circle" v-if="!showPartMeronym" @click="showPartMeronym = !showPartMeronym" class="iconNoHighlight" :class='darkTheme? "iconDark" : "iconLight"'/>
      <b-icon icon="dash-circle" v-else @click="showPartMeronym = !showPartMeronym" class="iconNoHighlight" :class='darkTheme? "iconDark" : "iconLight"'/>
        <span @click="showPartMeronym = !showPartMeronym"> Part Meronym</span>
      <SymbolList v-if="showPartMeronym" :data="partMeronym" :depth="depth" :ptrSymbols="ptrSymbols" :darkTheme="darkTheme"/>
    </li>
  </ul>
</template>

<script>
import SymbolList from '@/components/SymbolList.vue';

export default {
  name: 'RecSymbol',
  data() {
    return {
      acceptedSymbols : ['@', '~', '#', '%'],
      showHypernym: false,
      showHyponym: false,
      showMemberHolonym: false,
      showSubstanceHolonym: false,
      showPartHolonym: false,
      showMemberMeronym: false,
      showSubstanceMeronym: false,
      showPartMeronym: false,
    }
  },
  components: {
    SymbolList
  },
  props: {
    data : {
      required: true
    },
    ptrSymbols: {
      required: true,
    },
    depth: {required: true},
    darkTheme: {required:true},
  },
  computed: {
    hypernyms : function() {
      return this.data.ptrs.filter(a => a.pointer_symbol.includes('@'));
    },
    hyponyms : function() {
      return this.data.ptrs.filter(a => a.pointer_symbol.includes('~'));
    },
    memberHolonym: function() {
      return this.data.ptrs.filter(a => a.pointer_symbol.includes('#m'));
    },
    substanceHolonym: function() {
      return this.data.ptrs.filter(a => a.pointer_symbol.includes('#s'));
    },
    partHolonym: function() {
      return this.data.ptrs.filter(a => a.pointer_symbol.includes('#p'));
    },
    memberMeronym: function() {
      return this.data.ptrs.filter(a => a.pointer_symbol.includes('%m'));
    },
    substanceMeronym: function() {
      return this.data.ptrs.filter(a => a.pointer_symbol.includes('%s'));
    },
    partMeronym: function() {
      return this.data.ptrs.filter(a => a.pointer_symbol.includes('%p'));
    },
  },
  methods: {
    formatWord: function(word) {
      return word.replace(/_/g, " ");
    },
    printSymbol: function(sym) {
      for(let symbol of this.acceptedSymbols)
      {
        if(sym.includes(symbol))
          return true;
      }
      return false;
    }
  },
}
</script>

<style scoped>
ul.recSymbol{
    list-style-type: none;
    padding-left: 1em;
}
.iconNoHighlight {
  cursor: pointer;
   -webkit-user-select: none;
   -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
}
.iconDark {
  color: #f5d782;
}
.iconLight {
  color: #111;
}
</style>
