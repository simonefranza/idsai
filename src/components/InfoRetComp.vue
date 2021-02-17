<template>
  <div class="infoRetComp">
    <div class="row">
      <div class="col-3">
        <b-table striped hover :items="documents" :fields="fields" foot-clone>
          <template #cell(modify)="row">
            <b-button size="sm" @click="row.toggleDetails" class="mr-2" variant="primary">
              <b-icon icon="pencil" aria-hidden="true"></b-icon>
            </b-button>
            <b-button size="sm" @click="removeDoc(row.index)" class="mr-2" variant="danger">
              <b-icon icon="trash" aria-hidden="true"></b-icon>
            </b-button>
          </template>

          <template #foot(id)="">
            <span></span>
          </template>

          <template #foot(document)="">
            <b-form-input id="newDocForm" v-model="newDoc" placeholder="New document" :class="{'shake' : animated}"></b-form-input>
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
      <div class="col-1"></div>
      <div class="col-2">
        <b-table striped hover :items="printableDict" v-if="showDict"></b-table>
      </div>
      <div class="col-1"></div>
      <div class="col-1">
        <b-table striped hover :items="printableIdf" v-if="showIdf"></b-table>
      </div>
      <div class="col-1"></div>
      <div class="col">
        <b-table striped hover :items="printableTf" v-if="showTf"></b-table>
      </div>
      <div class="col-1"></div>
    </div>
    <div class="row">
      <div class="col-1"></div>
      <div class="col-2">
      </div>
      <div class="col-1"></div>
      <div class="col-2">
        <b-button variant="outline-primary" v-on:click = "showDict = !showDict">Show dictionary</b-button>
      </div>
      <div class="col-1"></div>
      <div class="col-1">
        <b-button variant="outline-primary" v-on:click = "showIdf = !showIdf">Show idf</b-button>
      </div>
      <div class="col-1"></div>
      <div class="col">
        <b-button variant="outline-primary" v-on:click = "showTf = !showTf">Show tf</b-button>
      </div>
      <div class="col-1"></div>
    </div>
    <br/>
    <div class="row">
      <div class="col"></div>
      <div class="col-6">
        <b-form-input id="queryForm" v-model="query" placeholder="Input query" ></b-form-input>
      </div>
      <div class="col"></div>
    </div>
    <br/>
    <div class="row">
      <div class="col"></div>
      <div class="col-2">
        <b-table striped hover :items="printableQueryTf"></b-table>
      </div>
      <div class="col"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() 
  {
    return {
      //docs : ["I... I really, really, really love the sun!", "I hate sun!", "I love rain."],
      docs :  ["I love the sun!", "I hate sun!", "I love rain."],
      fields : ["id", "document", "modify"],
      ignored_terms : ["the", "a"],
      showDict : false,
      showIdf : false,
      showTf : false,
      animated: false,
      newDoc : "",
      showTooltip : false,
      query : ""
    }
  },
  computed : 
  {
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
          temp_info[str] = +parseFloat(t_i.get(token)).toFixed(2);
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
        printableIdf.push({idf : +parseFloat(idf).toFixed(2)}));
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
        printableQueryTf.push({query_tf : +parseFloat(this.query_tf.get(token)).toFixed(2)});
      });
      return printableQueryTf;
    }
  },

  methods: {
    getUniqueTokens(tokens)
    {
      let map = new Map();
      tokens.forEach(token => {
        if(this.ignored_terms.includes(token))
          return;
        map.set(token, map.has(token) ? map.get(token) + 1: 1);
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
      //TODO add even if same?
      if(!str || this.docs.includes(str))
      {
        this.showTooltip = true;
        const self = this;
        self.animated = true;
        setTimeout(() => {self.animated = false; this.showTooltip = false}, 2000);
        return;
      }

      this.docs.push(str);
      this.newDoc = "";
    }
  }
}

//Taken from https://stackoverflow.com/questions/59855732/vuelidate-shaking-the-incorrect-input-field
</script>

<style>
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
</style>
