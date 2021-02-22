<template>
  <div class="infoRetComp">
    <div class="row">
      <div class="col"></div>
      <div class="col-3">
        <b-table striped hover :items="documents" :fields="fields" v-bind:dark="darkTheme" foot-clone>
          <template #cell(modify)="row">
            <b-button size="sm" @click="startEditLine(row.index)" class="mr-2" variant="primary" v-if="row.index !== editLineIndex">
              <b-icon icon="pencil" aria-hidden="true"></b-icon>
            </b-button>
            <b-button size="sm" @click="finishEditLine(row.index)" class="mr-2" variant="success" v-else>
              <b-icon icon="check" aria-hidden="true"></b-icon>
            </b-button>
            <b-button size="sm" @click="removeDoc(row.index)" class="mr-2" variant="danger" v-if="row.index !== editLineIndex">
              <b-icon icon="trash" aria-hidden="true"></b-icon>
            </b-button>
            <b-button size="sm" @click="cancelEdit" class="mr-2" variant="danger" v-else>
              <b-icon icon="x" aria-hidden="true"></b-icon>
            </b-button>
          </template>

          <template #cell(document)="row">
            <div v-if="row.index !== editLineIndex">{{ row.value }}</div>
            <div v-else>
              <b-form-input :class="{'shake' : animatedEditField, 'darkInputForm' : darkTheme}" v-model="tempDoc" placeholder="Type or cancel" ></b-form-input>
            </div>
          </template>

          <template #foot(id)="">
            <span></span>
          </template>

          <template #foot(document)="">
            <b-form-input id="newDocForm" v-model="newDoc" placeholder="New document" :class="{'shake' : animatedNewField, 'darkInputForm' : darkTheme}"></b-form-input>
            <b-tooltip target="newDocForm" placement="bottom" :show.sync="showTooltip" triggers="manual">
              This document is already present, please choose something else!
            </b-tooltip>
          </template>

          <template #foot(modify)="">
            <b-button size="sm" @click="addDoc()" class="mr-2" >
              <b-icon icon="plus" aria-hidden="true"></b-icon>
            </b-button>
          </template>
        </b-table>
      </div>
      <div class="col-4">
        <b-form-input :class="{'darkInputForm' : darkTheme}" id="queryForm" v-model="query" placeholder="Input query" bg-variant="dark"></b-form-input>
      </div>
      <div class="col-3">

        <b-card title="Control Panel" v-bind:bg-variant="!darkTheme ? 'light' : 'dark'" v-bind:text-variant="!darkTheme ? '' : 'white'">
          <b-card-text>
          <div class="row">
            <div class="col-6 panelSwitches">
              <SwitchGroup :darkTheme="darkTheme" :settings="settings" v-model="selectedSettings" />
            </div>
            <div class="col-6 panelSwitches">
              <SwitchGroup :darkTheme="darkTheme" :settings="querySettings" v-model="selectedQuerySett" />
            </div>
          </div>
          <div>
            Ignored words (comma separated)
          </div>
          <div>
            <b-form-input :class="{'darkInputForm' : darkTheme}" v-model="ignoredTermsInput" placeholder="Ignored words comma separated"></b-form-input>

          </div>
          </b-card-text>
        </b-card>
      </div>
      <div class="col"></div>
    </div>

    <div class="row" v-if="selectedSettings.length">
      <div class="col"></div>
      <div class="col-2" v-if="selectedSettings.includes('dict')">
        <b-table striped hover :items="printableDict" v-bind:dark="darkTheme"></b-table>
      </div>
      <div class="col-1" v-if="selectedSettings.includes('idf')">
        <b-table striped hover :items="printableIdf" v-bind:dark="darkTheme">
          <template #head()="data">
            <span>{{ data.label.toLowerCase() }}</span>
          </template>
        </b-table>
      </div>
      <div class="col" v-if="selectedSettings.includes('tf')">
        <b-table striped hover :items="printableTf" v-bind:dark="darkTheme">
          <template #head()="data">
            <span>{{ data.label.toLowerCase().substring(0,1)}}<sub>{{data.label.substring(1,2)}}</sub></span>
          </template>
        </b-table>
      </div>
      <div class="col" v-if="selectedSettings.includes('tfidf')">
        <b-table striped hover :items="printableTfIdf" v-bind:dark="darkTheme">
          <template #head()="data">
            <span>{{ data.label.toLowerCase().substring(0,5)}}<sub>{{data.label.substring(5,6)}}</sub></span>
          </template>
        </b-table>
      </div>
      <div class="col"></div>
    </div>
    <br/>
    <br/>
    <div class="row" v-if="selectedQuerySett.length">
      <div class="col"></div>
      <div class="col" v-if="selectedQuerySett.includes('querytf')">
        <b-table striped hover :items="printableQueryTf" v-bind:dark="darkTheme">
          <template #head()="">
            <span>Query tf</span>
          </template>
        </b-table>
      </div>
      <div class="col" v-if="selectedQuerySett.includes('querytfidf')">
        <b-table striped hover :items="printableQueryTfIdf" v-bind:dark="darkTheme">
          <template #head()="">
            <span>Query tfidf</span>
          </template>
        </b-table>
      </div>
      <div class="col" v-if="selectedQuerySett.includes('ranking')">
        <b-table striped hover :items="ranking" v-bind:dark="darkTheme"></b-table>
      </div>
      <div class="col">
      </div>
    </div>
  </div>
</template>

<script>
import SwitchGroup from '@/components/SwitchGroup.vue'

export default {
  props: {
    darkTheme: {
      type: Boolean,
      required: true
    }
  },
  components: {
    SwitchGroup
  },
  data() 
  {
    return {
      //docs : ["I... I really, really, really love the sun!", "I hate sun!", "I love rain."],
      docs :  ["I love the sun!", "I hate sun!", "I love rain."],
      fields : ["id", "document", "modify"],
      ignored_terms : ["the", "a"],
      animatedNewField: false,
      animatedEditField: false,
      newDoc : "",
      showTooltip : false,
      query : "",
      tfPrecision : 4,
      tfIdfPrecision : 4,
      idfPrecision : 4,
      simPrecision : 4,
      selectedSettings : [],
      selectedQuerySett : [],
      allDocSett : ['dict', 'idf', 'tf', 'tfidf'],
      allQuerySett : ['querytf', 'querytfidf', 'ranking'],
      allDocSelected : false,
      allQuerySelected : false,
      settings : [
        { text: 'Dictionary', value: 'dict' },
        { text: 'idf', value: 'idf' },
        { text: 'tf', value: 'tf'},
        { text: 'tfidf', value: 'tfidf' },
        ],
      querySettings : [
        { text: 'Query tf', value: 'querytf'},
        { text: 'Query tfidf', value: 'querytfidf'},
        { text: 'Ranking', value: 'ranking'},
        { text: 'Toggle all', value: 'toggleAll'},
      ],
      editLineIndex : -1,
      tempDoc : ""
    }
  },
  computed : 
  {
    ignoredTermsInput: {
      get: function()
      {
        let str = "";
        this.ignored_terms.forEach(term => str += term + ',');
        return str.slice(0, -1);
      },
      set: function(newValue)
      {
        let temp = [];
        let tokens = newValue.split(",");
        tokens.forEach(word => {
          word = word.trim();
          if(!word || !word.match(/^[A-Za-z]+$/))
            return;

          if(!temp.includes(word.toLowerCase()))
            temp.push(word.toLowerCase())
        });
        this.ignored_terms.splice(0, this.ignored_terms.length, ...temp);
      }
    },

    documents: function() {
      let docList = [];
      this.docs.forEach((doc, index) => docList.push({id: index, document: doc}));
      return docList;
    },

    num_documents: function() {
      return this.documents.length;
    },

    docInfo: function() {
      let map = new Map();
      var natural = require('natural');
      var tokenizer = new natural.WordTokenizer();
      for(let doc of this.documents)
      {
        let uniqueTokens = this.getUniqueTokens(tokenizer.tokenize(doc['document']));
        let docLen = 0;
        uniqueTokens.forEach((val, ) => docLen += val);
        map.set(doc, {uniqueTokens: uniqueTokens, docLen : docLen});
      }
      return map;
    },

    dictionary: function() {
      let dict = new Map();
      this.docInfo.forEach((info, ) =>
        info['uniqueTokens'].forEach((count, token) => 
          dict.set(token, dict.has(token) ?  dict.get(token) + 1 : 1)));
      return dict;
    },

    printableDict: function() {
      let dict = this.dictionary;
      let printable = [];
      dict.forEach((count, token) => printable.push({word: token, frequency: count}));
      return printable;
    },

    norm_tf: function() {
      let tfs = new Map();
      this.docInfo.forEach((info, doc) => {
        let t_i = new Map();
        this.dictionary.forEach((_, token) => {
          t_i.set(token, info['uniqueTokens'].has(token) ? 
            info['uniqueTokens'].get(token) / info['docLen'] : 0);
        });
        tfs.set(doc, t_i);
      });
      return tfs;
    },

    printableTf: function() {
      let printableTf = [];
      this.dictionary.forEach((_,token) => {
        let temp_info = {};
        this.norm_tf.forEach((t_i, doc) => {
          let str = "t" + doc['id'];
          temp_info[str] = +parseFloat(t_i.get(token)).toFixed(this.tfPrecision);
        });
        printableTf.push(temp_info);
      });
      return printableTf;
    },

    idf : function() {
      let idfs = new Map(); 
      this.dictionary.forEach((count, token) => 
        idfs.set(token, Math.log10(this.num_documents / count)));
      return idfs;
    },

    printableIdf: function() {
      let printableIdf = [];
      this.idf.forEach((idf, ) => 
        printableIdf.push({idf : +parseFloat(idf).toFixed(this.idfPrecision)}));
      return printableIdf;
    },

    query_tf: function() {
      var natural = require('natural');
      var tokenizer = new natural.WordTokenizer();
      //words that are ignored in the documents are ignored here as well
      let uniqueTokens = this.getUniqueTokens(tokenizer.tokenize(this.query));
      let docLen = 0;
      uniqueTokens.forEach((val, ) => docLen += val);
      let t_i = new Map();
      this.dictionary.forEach((_, token) => {
        t_i.set(token, uniqueTokens.has(token) ? 
          uniqueTokens.get(token) / docLen : 0);
      });
      return t_i;
    },

    printableQueryTf: function() {
      let printableQueryTf = [];
      this.dictionary.forEach((_,token) => {
        printableQueryTf.push({query_tf : +parseFloat(this.query_tf.get(token)).toFixed(this.tfPrecision)});
      });
      return printableQueryTf;
    },

    docsTfIdf: function() {
      let tfIdf = new Map();
      this.norm_tf.forEach((t_i, doc) => {
        let temp_tdIdf = new Map();
        t_i.forEach((t_i_val, token) => {
          temp_tdIdf.set(token, this.idf.get(token) * t_i_val);
        });
        tfIdf.set(doc, temp_tdIdf);
      });
      return tfIdf;
    },

    printableTfIdf: function() {
      let printableTfIdf = [];
      this.dictionary.forEach((_, token) => {
        let temp_info = {};
        this.docsTfIdf.forEach((tfidf, doc) => {
          let str = "tfidf" + doc['id'];
          temp_info[str] = +parseFloat(tfidf.get(token)).toFixed(this.tfIdfPrecision);
        });
        printableTfIdf.push(temp_info);
      });
      return printableTfIdf;
    },

    queryTfIdf: function() {
      let queryTfIdf = new Map();
      this.idf.forEach((idf_val, token) => {
        queryTfIdf.set(token, this.query_tf.get(token) * idf_val);
      });
      return queryTfIdf;
    },

    printableQueryTfIdf: function() {
      let printableQueryTfIdf = [];
      this.dictionary.forEach((_, token) =>
        printableQueryTfIdf.push({query_TfIdf : +parseFloat(this.queryTfIdf.get(token)).toFixed(this.tfIdfPrecision)}));
      return printableQueryTfIdf;
    },

    sim: function() {
      let similarities = new Map();
      this.docsTfIdf.forEach((idf, doc) => {
        let vecA = [];
        let vecB = [];
        this.dictionary.forEach((_, token) => {
          vecA.push(idf.get(token));
          vecB.push(this.queryTfIdf.get(token));});
        let dotMult = this.dotMult(vecA, vecB);
        let lenA = this.dotMult(vecA, vecA);
        let lenB = this.dotMult(vecB, vecB);

        similarities.set(doc, (lenA === 0 || lenB === 0) ? 0 : dotMult / Math.sqrt(lenA * lenB));
      });
      return similarities;
    },

    ranking: function() {
      let ranking = [];
      this.sim.forEach((sim, doc) =>
        ranking.push({document: doc.document, sim: +parseFloat(sim).toFixed(this.simPrecision)}));
      ranking.sort((a, b) => a.sim > b.sim ? -1 : 1);
      return ranking;
    }
  },

  methods: {
    getUniqueTokens(tokens)
    {
      let map = new Map();
      tokens.forEach(token => {
        for(let ignored of this.ignored_terms)
        {
          if(!ignored.toLowerCase().localeCompare(token.toLowerCase()))
            return;
        }
        map.set(token.toLowerCase(), map.has(token.toLowerCase()) ? map.get(token.toLowerCase()) + 1: 1);
      });
      return map;
    },

      removeDoc(index)
    {
      this.docs.splice(index, 1);
    },

      addDoc()
    {
      let str = this.newDoc.trim();
      if(!str)
      {
        const self = this;
        self.animatedNewField = true;
        setTimeout(() => {self.animatedNewField = false}, 2000);
        return;
      }
      //TODO add even if same?
      let docPresent = false;
      this.docs.forEach(doc => docPresent = doc.toLowerCase().localeCompare(str.toLowerCase()) ? docPresent : true);
      if(docPresent)
      {
        this.showTooltip = true;
        const self = this;
        self.animatedNewField = true;
        setTimeout(() => {self.animatedNewField = false; this.showTooltip = false}, 2000);
        return;
      }

      this.docs.push(str);
      this.newDoc = "";
    },

      dotMult(vecA, vecB) {
        let value = 0;
        vecA.forEach((val, index) => value += val * vecB[index]);
        return value;
      },

      startEditLine(index)
    {
      this.editLineIndex = index;
      this.tempDoc = this.docs[index];

    },
      finishEditLine(index)
    {
      let str = this.tempDoc.trim();
      if(!str)
      {
        const self = this;
        self.animatedEditField = true;
        setTimeout(() => {self.animatedEditField = false}, 2000);
        return;
      }
      //TODO add even if same?
      let docPresent = false;
      this.docs.forEach(doc => docPresent = doc.toLowerCase().localeCompare(str.toLowerCase()) ? docPresent : true);
      if(docPresent && this.docs.indexOf(str) != index)
      {
        const self = this;
        self.animatedEditField = true;
        setTimeout(() => {self.animatedEditField = false}, 2000);
        return;
      }
      this.editLineIndex = -1;
      this.docs.splice(index, 1, str);
      this.tempDoc = '';
    },
      cancelEdit()
    {
      this.editLineIndex = -1;
      this.tempDoc = '';
    }




  },
  watch: {
    selectedSettings(newVal)
    {
      let temp = [...newVal];
      temp.sort();
      this.allDocSett.sort();
      if(this.allDocSett.length !== temp.length)
      {
        this.allDocSelected = false;
      }
      else
      {
        let isEqual = true;
        this.allDocSett.forEach((word, idx) => {
          isEqual = temp[idx].localeCompare(word) ? false : isEqual;});
        this.allDocSelected = isEqual;
      }

      if(this.allDocSelected && this.allQuerySelected && !this.selectedQuerySett.includes("toggleAll"))
      {
        this.selectedQuerySett.push("toggleAll");
      }
      else if(this.selectedQuerySett.includes("toggleAll") && !(this.allDocSelected && this.allQuerySelected)) 
      {
        let id = this.selectedQuerySett.indexOf("toggleAll");
        this.selectedQuerySett.splice(id, 1);
      }

    },

      selectedQuerySett(newVal, oldVal)
    {
      if(newVal.includes("toggleAll") && !oldVal.includes("toggleAll"))
      {
        this.selectedSettings = this.allDocSett.slice();
        this.selectedQuerySett.push(...this.allQuerySett);
        this.allDocSelected = true;
        this.allQuerySelected = true;
        return;
      }
      else if(oldVal.includes("toggleAll") && !newVal.includes("toggleAll"))
      {
        this.selectedSettings.splice(0, this.selectedSettings.length);
        this.selectedQuerySett.splice(0, this.selectedQuerySett.length);
        this.allDocSelected = false;
        this.allQuerySelected = false;
        return;
      }
      let temp = [...newVal];
      temp.sort();
      this.allQuerySett.sort();
      let isEqual = true;
      this.allQuerySett.forEach(word => {
        isEqual = temp.includes(word) ? isEqual : false;});
      this.allQuerySelected = isEqual;

      if(this.allDocSelected && this.allQuerySelected && !this.selectedQuerySett.includes("toggleAll"))
      {
        this.selectedQuerySett.push("toggleAll");
      }
      else if(this.selectedQuerySett.includes("toggleAll") && !(this.allDocSelected && this.allQuerySelected)) {
        let id = this.selectedQuerySett.indexOf("toggleAll");
        this.selectedQuerySett.splice(id, 1);

      }
    }

  }
}

//Taken from https://stackoverflow.com/questions/59855732/vuelidate-shaking-the-incorrect-input-field
</script>

<style scoped>
.shake {
  animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
}
@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
.panelSwitches {
  text-align : left;
}
.infoRetComp {
  width: 90%;
  margin: auto;
}
.darkInputForm {
  background-color: #303131;
  border: 1px solid #111;
  color: #f8f1f1;
}

.darkInputForm::placeholder {
  color: #888;
}

</style>
