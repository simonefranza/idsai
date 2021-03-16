<template>
  <ul v-if="depth" class="recSymbol">
    <span v-for="(el,index) in printable" :key="el.label">
      <li v-if="el && el.array && el.array.length">
        <b-icon icon="plus-circle" v-if="!el.show" @click="printable = index" class="iconNoHighlight" :class='darkTheme? "iconDark" : "iconLight"'/>
          <b-icon icon="dash-circle" v-else @click="printable = index" class="iconNoHighlight" :class='darkTheme? "iconDark" : "iconLight"'/>
            <span @click="printable = index"> {{el.label}}</span>
            <SymbolList v-if="el.show" :data="el.array" :depth="depth" :ptrSymbols="ptrSymbols" :darkTheme="darkTheme"
            v-model="hovered"/>
      </li>
    </span>
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
      hovered: '',
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
    value: {required:true},
  },
  computed: {
    printable: {
      set(index) {
        switch(index) {
          case 0: 
            this.showHypernym = !this.showHypernym;
            break;
          case 1: 
            this.showHyponym = !this.showHyponym;
            break;
          case 2: 
            this.showMemberHolonym = !this.showMemberHolonym;
            break;
          case 3: 
            this.showSubstanceHolonym = !this.showSubstanceHolonym;
            break;
          case 4: 
            this.showPartHolonym = !this.showPartHolonym;
            break;
          case 5: 
            this.showMemberMeronym = !this.showMemberMeronym;
            break;
          case 6: 
            this.showSubstanceMeronym = !this.showSubstanceMeronym;
            break;
          case 7: 
            this.showPartMeronym = !this.showPartMeronym;
            break;
          default:
        }
      },
      get() {
        return [
          {array: this.hypernyms, show: this.showHypernym, label: 'Hypernym', highlight: ''},
          {array: this.hyponyms, show: this.showHyponym, label: 'Hyponym', highlight: ''},
          {array: this.memberHolonym, show: this.showMemberHolonym, label: 'Member Holonym', highlight: ''},
          {array: this.substanceHolonym, show: this.showSubstanceHolonym, label: 'Substance Holonym', highlight: ''},
          {array: this.partHolonym, show: this.showPartHolonym, label: 'Part Holonym', highlight: ''},
          {array: this.memberMeronym, show: this.showMemberMeronym, label: 'Member Meronym', highlight: ''},
          {array: this.substanceMeronym, show: this.showSubstanceMeronym, label: 'Substance Meronym', highlight: ''},
          {array: this.partMeronym, show: this.showPartMeronym, label: 'Part Meronym', highlight: ''},
        ];
      }
    },
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
    },
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
    data() {
      this.showHypernym = false;
      this.showHyponym = false;
      this.showMemberHolonym = false;
      this.showSubstanceHolonym = false;
      this.showPartHolonym = false;
      this.showMemberMeronym = false;
      this.showSubstanceMeronym = false;
      this.showPartMeronym = false;
    }
  }
}
</script>

<style scoped lang="scss">
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
  color: $secondary-dark;
}
.iconLight {
  color: $primary-light;
}
</style>
