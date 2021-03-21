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
          <div class="col-3 test">
          <b-button size="sm" 
                    class="showGraphButton"
                    pill
                    @click="emitNewGraph({index: outerIndex})"
                    :variant="darkTheme ? 'outline-dark' : 'outline-light'"
                    :disabled="chosenIndex === outerIndex" >
                    <span v-if="chosenIndex !== outerIndex">See graph</span>
                    <span v-else>Current</span>
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
    },
    chosenIndex: {required: true},
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
    handleScroll() {
      console.log("new");
      let buttons = document.getElementsByClassName('showGraphButton');
      buttons.forEach(button => {

        let buttonRect = button.getBoundingClientRect();
        let currStyle = button.getAttribute('style');
        let start = currStyle?.indexOf('/*') + 2;
        let end = currStyle?.indexOf('*/');
        let data = currStyle?.slice(start, end) || '';
        data = data?.split(':')[1];
        if(!data)
          data = parseInt(window.getComputedStyle(button, null).getPropertyValue('top').slice(0, -2));
        else
          data = parseInt(data);

        let parent = button.parentNode;
        let bounding = parent.getBoundingClientRect();
        let divStart = bounding.y - data;

        let divEnd = divStart + bounding.height;
        let moddedEnd = divEnd - buttonRect.height;

        let shouldStick = divStart <= 0 && moddedEnd > 0; 
        let shouldStickBottom = moddedEnd <= 0 && divEnd > 0; 
        let shouldRemove = divStart > 0 || divEnd + data <= 0; 

        if(shouldStick)
          button.setAttribute('style', 'position: fixed; /*savedTop:' + data + '*/');
        else if(shouldStickBottom)
          button.setAttribute('style', 'position : absolute; bottom: 0; top: auto; /*savedTop:' + data + '*/');
        else if(shouldRemove)
          button.removeAttribute('style');
      });


    },
    emitNewGraph(obj) {
      this.$emit("newGraph", obj);
    },
    formatWord: function(word) {
      return word.replace(/_/g, " ");
    },
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },

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
  position: sticky;
  top:10px;
}

.scrollHandler{
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 700;
}
</style>
