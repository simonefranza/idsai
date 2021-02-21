<template>
  <div class="dict-entry">
    <ul v-if="data !== ''"><span class="categoryName">{{entryType}}</span><br/>
      <li v-for="el in data" :key="el.synset_offset">
        <span v-for="(wordArr, index) in el.words" :key="wordArr.word">
          <span :class="{'searchedWord' : wordArr.word.localeCompare(el.keyWord) == 0}">
            {{formatWord(wordArr.word)}}</span><span v-if="index != el.words.length - 1">, </span>
        </span>
        <span v-for="(gloss, index) in el.gloss" :key="gloss">
          <span v-if="el.gloss.length === 1"> [{{gloss}}] </span>
          <span v-else-if="index === 0"> [{{gloss}}</span>
          <span v-else-if="index === el.gloss.length - 1">; {{gloss}}] </span>
          <span v-else>, {{gloss}}</span>
        </span>
        <span v-for="(ex, index) in el.example" :key="ex">
          <span v-if="index === 0">~ {{ex}}</span>
          <span v-else>; {{ex}}</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    data : {
      required: true
    },
    entryType: {
      required: true,
      type: String
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
