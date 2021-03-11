<template>
  <div class="dict-entry" v-if="array.length">
  <b-icon icon="plus-circle" v-if="!showData" @click="showData = !showData" class="iconNoHighlight cyclesIconLeft" :class='darkTheme? "iconDark" : "iconLight"'/>
    <b-icon icon="dash-circle" v-else @click="showData = !showData" class="iconNoHighlight cyclesIconLeft" :class='darkTheme? "iconDark" : "iconLight"'/>
      <span class="categoryName">{{entryType}}<span v-if="array.length > 1">s</span></span>
    <span v-if="showData">
    <br/>
    <span v-for="(data,outerIndex) in array" :key="outerIndex">
      <ul v-if="data.words" class="dictEntryList">      
        <li>
        <div class="row">
          <div class="col">
            <span v-for="(wordArr, index) in data.words" :key="wordArr.word">
              <span :class="{'searchedWord' : wordArr.word.localeCompare(data.keyWord) == 0}" >
                {{formatWord(wordArr.word)}}</span><span v-if="index != data.words.length - 1">, </span>
            </span>
            <span v-for="(gloss, index) in data.gloss" :key="gloss">
              <span v-if="index === 0"> [</span><span v-if="index >= 1">; </span>{{gloss}}<span v-if="index === data.gloss.length -1 ">]</span>
            </span>
            <span v-for="(ex, index) in data.example" :key="ex">
              <span v-if="index === 0">~ {{ex}}</span>
              <span v-else>; {{ex}}</span>
            </span>
            <RecSymbol :ptrSymbols="ptrSymbols" :data="data" :depth="depth" :darkTheme="darkTheme" v-model="hovered"/>
          </div>
          <div class="col-3">
          <b-button size="sm" 
                    class="showGraphButton"
                    pill
                    @click="emitNewGraph({index: outerIndex})"
                    :variant="darkTheme ? 'outline-dark' : 'outline-light'"
                    >See graph
          </b-button>
          </div>
        </div>
      </li>
    </ul>
    </span>
    </span>
  </div>
</template>

<script>
import RecSymbol from '@/components/RecSymbol.vue';
export default {
  components: {
    RecSymbol,
  },
  props: {
    array: {
      required: true
    },
    entryType: {
      required: true,
      type: String
    },
    depth: {
      required: true,
      type: Number,
    },
    ptrSymbols: {
      required:true,
    },
    darkTheme: {
      required: true,
    },
    value: {
      required:true,
    }
  },
  data() {
    return {
      hovered: '',
      showData: true,
    }
  },
  model: {
    event: "isHovered",
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
    emitNewGraph(obj) {
      this.$emit("newGraph", obj);
    },
    formatWord: function(word) {
      return word.replace(/_/g, " ");
    },
  }

}
</script>

<style scoped lang="scss">
.categoryName{
  font-weight: bold;
}

.dict-entry {
  text-align: left;
  padding-top: 10px;
}

.searchedWord {
  font-weight: bold;
}

.dictEntryList {
    padding-left: 2em;
}
.showGraphButton {
}
</style>
