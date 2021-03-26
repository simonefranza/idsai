<template>
  <span>
    <span v-for="(ptr, outerIndex) in data" :key="outerIndex + ptr.pointer_symbol + ptr.synset_offset">
        <ul>
          <li>
            <span v-for="(wordObj, index) in ptr.words" :key="wordObj.word" @mouseenter="hoveredWord(outerIndex)" @mouseleave="mouseLeft()">
              <span :class="{boldElement : index === 0 && outerIndex === hoveredIndex}">{{formatWord(wordObj.word)}}</span><span v-if="index !== ptr.words.length - 1">, </span>
            </span>
            <RecSymbol v-if="ptr.ptrs" 
                        :data="ptr" 
                        :ptrSymbols="ptrSymbols" 
                        :depth="depth - 1" 
                        :darkTheme="darkTheme" 
                        v-model="hovered"/>
          </li>
        </ul>
    </span>
  </span>
</template>

<script>

export default {
  name: 'SymbolList',
  computed: {
    darkTheme() {
      return this.$store.state.darkTheme;
    }
  },
  props: {
    data: {required: true},
    ptrSymbols: {required: true},
    depth: {required: true},
    value: { required: true}, 
  },
  data() {
    return {
      hovered: '',
      hoveredIndex: -1,
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
    formatWord: function(word) {
      return word.replace(/_/g, " ");
    },
    hoveredWord(index) {
      this.hoveredIndex = index;
      this.hovered = this.data[index].words[0].word;
    },
    mouseLeft() {
      this.hovered = '';
      this.hoveredIndex = -1;
    }
  },
  beforeCreate() {
    this.$options.components.RecSymbol = require("@/components/graphs/RecSymbol.vue").default;
  }

}
</script>

<style scoped lang="scss">
.a{}
</style>
