<template>
  <div class="dict-entry">
    <ul v-if="data.words"><span class="categoryName">{{entryType}}</span><br/>
      <li>
        <span v-for="(wordArr, index) in data.words" :key="wordArr.word">
          <span :class="{'searchedWord' : wordArr.word.localeCompare(data.keyWord) == 0}">
            {{formatWord(wordArr.word)}}</span><span v-if="index != data.words.length - 1">, </span>
        </span>
        <span v-for="(gloss, index) in data.gloss" :key="gloss">
          <span v-if="index === 0"> [</span><span v-if="index >= 1">; </span>{{gloss}}<span v-if="index === data.gloss.length -1 ">]</span>
        </span>
        <span v-for="(ex, index) in data.example" :key="ex">
          <span v-if="index === 0">~ {{ex}}</span>
          <span v-else>; {{ex}}</span>
        </span>
          <RecSymbol :ptrSymbols="ptrSymbols" :data="data" :depth="depth" :darkTheme="darkTheme"/>
      </li>
    </ul>
  </div>
</template>

<script>
import RecSymbol from '@/components/RecSymbol.vue';
export default {
  components: {
    RecSymbol,
  },
  props: {
    data : {
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
    }

  },
  methods: {
    formatWord: function(word) {
      return word.replace(/_/g, " ");
    }

  }

}
</script>

<style scoped>
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
</style>
