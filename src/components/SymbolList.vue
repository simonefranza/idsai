<template>
  <span>
    <span v-for="(ptr, index) in data" :key="index + ptr.pointer_symbol + ptr.synset_offset">
        <ul>
          <li>
            <span v-for="(wordObj, index) in ptr.words" :key="wordObj.word">
              {{formatWord(wordObj.word)}}<span v-if="index !== ptr.words.length - 1">, </span>
            </span>
            <RecSymbol v-if="ptr.ptrs" :data="ptr" :ptrSymbols="ptrSymbols" :depth="depth - 1" :darkTheme="darkTheme"/>
          </li>
        </ul>
    </span>
  </span>
</template>

<script>

export default {
  name: 'SymbolList',
  components: {
  },
  props: {
    data: {required: true},
    ptrSymbols: {required: true},
    depth: {required: true},
    darkTheme: {required: true},
  },
  methods: {
    formatWord: function(word) {
      return word.replace(/_/g, " ");
    },
  },
  beforeCreate() {
    this.$options.components.RecSymbol = require("./RecSymbol.vue").default;
  }

}
</script>

