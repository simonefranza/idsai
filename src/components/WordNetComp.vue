<template>
  <div>
    <transition name="sliding" mode="out-in">
    <WordNetLegend :darkTheme="darkTheme" @closeLegend="closeExternalCard" v-model="showWordNetLegend" v-if="showWordNet"/>
    </transition>
    <WordNetHelp :darkTheme="darkTheme" @closeHelp="closeExternalCard" v-if="showWordNetHelp" />
    <div class="wordNetComp row">
      <div class="col-5">
      <b-card title="Control Panel" v-bind:bg-variant="!darkTheme ? 'light' : 'dark'" v-bind:text-variant="!darkTheme ? '' : 'white'">
        <b-card-body>
          <b-card-text>
            <div class="helpIcon" v-if="showWordNet">
              <b-button size="sm" 
                        id="legendButton"
                        class="showGraphButton"
                        pill
                        @click="showWordNetLegend = !showWordNetLegend"
                        :variant="darkTheme ? 'outline-dark' : 'outline-light'" >
                        <span v-if="!showWordNetLegend">Show legend</span>
                        <span v-else>Hide legend</span>
              </b-button>
                <b-icon id="helpIcon" icon="question-circle" 
                                      :class="['iconEnabled', 'cyclesIconRight', darkTheme ? 'iconDark' : 'iconLight']"
                                      @click="showHelp()" ></b-icon>
            </div>
          <div class="cyclesDiv">
            <span :class="{'disabledText' : showWordNet}">Adjacency Matrix</span>
            <ToggleSwitch :darkTheme="darkTheme" v-model="showWordNet" />
            <span :class="{'disabledText' : !showWordNet}">WordNet</span>
          </div>
          <span v-if="showWordNet">
            <b-spinner type="grow" label="Loading..." v-if="!loaded" :variant="darkTheme ? 'light' : 'dark'"></b-spinner>
            <div v-else>
              <div class="cyclesDiv">
                <span>Search depth (current {{exploreDepth}}, slow above 4)</span>
                <span>
                  <b-icon :class="['cyclesIconLeft', decreaseDepthDisabled ? 'iconDisabled' : 'iconEnabled', darkTheme ? 'iconDark' : 'iconLight']" 
                                                    icon="dash-circle" aria-hidden="true" @click="decreaseDepthNum"></b-icon>
                  <b-icon :class="['cyclesIconRight', 'iconEnabled', darkTheme ? 'iconDark' : 'iconLight']"
                                                                       icon="plus-circle" aria-hidden="true" @click="increaseDepthNum"></b-icon>
                </span>
              </div>
              <div class="cyclesDiv">
                <span>Random word</span>
                <b-icon :class="['cyclesIconRight', 'iconEnabled', darkTheme ? 'iconDark' : 'iconLight']"
                                        icon="arrow-clockwise" aria-hidden="true" @click="randomWord()" :animation="choosingRandomWord ? 'spin' : ''"></b-icon>
              </div>
              <div class="cyclesDiv">
                <span>Search </span>
                <b-form-input :class="{'darkInputForm' : darkTheme, 'inputForm' : 'true'}" v-model="searched" placeholder="Input something"></b-form-input>
              </div>
            </div>
          </span>
          <span v-else>
            <div class="cyclesDiv">
              <span class="toggleBlock">Matrix size (min: 2, max: 10)</span>
              <b-form-input size="sm" v-model="adjMatSize"
                                      :class="{'shake' : invalidMatrixSize, 'darkInputForm' : darkTheme, 'smallInput' : 'true'}"></b-form-input>
              <b-icon :class="['cyclesIconRight', 'iconEnabled', darkTheme ? 'iconDark' : 'iconLight']"
                                      icon="arrow-clockwise" aria-hidden="true" @click="reloadMatrix" :animation="reloadingMatrix ? 'spin' : ''"></b-icon>
            </div>
          </span>
          </b-card-text>
        </b-card-body>
      </b-card>
      <br/>
      <WordNetResult :ptrSymbols="ptrSymbols" 
                     :darkTheme="darkTheme" 
                     :searched="searched"
                     :depth="exploreDepth"
                     :chosenNoun="chosenNoun"
                     :chosenVerb="chosenVerb"
                     :chosenAdj="chosenAdj"
                     :chosenAdv="chosenAdv" 
                     :chosenGroup="chosenGroup"
                     :chosenIndex="chosenIndex"
                     :loaded="dataWasLoaded"
                     v-model="hoveredWord"
                     @graphChosen="showNewGraph"
                     v-if="showWordNet" />
      <AdjacencyMat :darkTheme="darkTheme" 
                    :matrixSize="parsedAdjMatSize"
                    @hoverElement="highlightNode"
                    @newNodeNames="updateNodeNames"
                     v-model="adjMatrix" 
                     v-else />
      </div>
      <div class="col-7">
        <GraphComp :dark-theme="darkTheme" 
                    :data="chosenData" 
                    :ptrSymbols="ptrSymbols" 
                    :depth="exploreDepth" 
                    v-model="hoveredWord"
                    v-if="showWordNet" />
       <AdjacencyGraph :darkTheme="darkTheme"
                        :matrix="adjMatrix"
                        :selectedRow="selectedRow"
                        :selectedCol="selectedCol"
                    :nodeNames="adjNodeNames" 
                    v-else />
      </div>
    </div>
  </div>
</template>

<script>
import WordNetHelp from '@/components/WordNetHelp.vue'
import WordNetLegend from '@/components/WordNetLegend.vue'
import WordNetResult from '@/components/WordNetResult.vue'
import AdjacencyMat from '@/components/AdjacencyMat.vue'
import GraphComp from '@/components/GraphComp.vue'
import AdjacencyGraph from '@/components/AdjacencyGraph.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import ramjet from 'ramjet'

export default {
  props: {
    darkTheme: {
      type: Boolean,
      required: true
    }
  },
  components: {
    WordNetResult,
    AdjacencyMat,
    GraphComp,
    AdjacencyGraph,
    ToggleSwitch,
    WordNetHelp,
    WordNetLegend,
  },
  data() {
    return {
      //Adj Matrix
      adjMatrix : [],
      adjMatSize: 5,
      reloadingMatrix: false,
      selectedRow: -1,
      selectedCol: -1,
      adjNodeNames: {},

      //Word Net
      showWordNetHelp: false,
      showWordNetLegend: false,
      showHelpAnimDuration: 3,
      preventHelpClosing: false,
      chosenGroup: -1,
      chosenIndex: -1,
      hoveredWord: null,
      dataWasLoaded: false,
      chosenNoun: {},
      loadedNoun: false,
      chosenVerb: {},
      loadedVerb: false,
      chosenAdj: {},
      loadedAdj: false,
      chosenAdv: {},
      loadedAdv: false,
      exploreDepth : 2,
      showWordNet : false,
      relevantSymbols : ['!', '@', '@i', '~', '~i', '#m', '#s', '#p', '%m', '%s', '%p'],
      choosingRandomWord: false,
      searched: '',
      poss: ['n', 'v', 'a', 'r'],
      loaded : false,

      nounIndex : '',
      verbIndex : '',
      adjIndex : '',
      advIndex : '',

      verbData : '',
      adjData : '',
      advData : '',

      nounExc : '',
      verbExc : '',
      adjExc : '',
      advExc : '',

      adjPert : '',
      advAll : '',
      nounTops : '',
      nounAct : '',
      nounAnimal : '',
      nounArtifact : '',
      nounAttribute : '',
      nounBody : '',
      nounCognition : '',
      nounCommuncation : '',
      nounEvent : '',
      nounFeeling : '',
      nounFood : '',
      nounGroup : '',
      nounLocation : '',
      nounMotive : '',
      nounObject : '',
      nounPerson : '',
      nounPhenomenon : '',
      nounPlant : '',
      nounPossession : '',
      nounProcess : '',
      nounQuantity : '',
      nounRelation : '',
      nounShape : '',
      nounState : '',
      nounSubstance : '',
      nounTime : '',
      verbBody : '',
      verbChange : '',
      verbCognition : '',
      verbCommunication : '',
      verbCompetition : '',
      verbConsumption : '',
      verbContact : '',
      verbCreation : '',
      verbEmotion : '',
      verbMotion : '',
      verbPerception : '',
      verbPossession : '',
      verbSocial : '',
      verbStative : '',
      verbWeather : '',
      adjPpl : '',
    }
  },
  computed: {
    parsedAdjMatSize: function() {
      return this.invalidMatrixSize ? 2 : parseInt(this.adjMatSize);
    },
    invalidMatrixSize: function() {
      return !this.adjMatSize || isNaN(this.adjMatSize) || ('' + this.adjMatSize).includes('.') ||
        parseFloat(this.adjMatSize) < 2 || parseFloat(this.adjMatSize) > 10;
    },
    decreaseDepthDisabled: function() {
      return this.exploreDepth === 0;
    },
    posIndex : function() {
      let map = new Map();
      map.set('n', this.nounIndex);
      map.set('v', this.verbIndex);
      map.set('a', this.adjIndex);
      map.set('r', this.advIndex);
      return map;
    },
    posData: function() {
      let map = new Map();
      map.set('n', this.nounData);
      map.set('v', this.verbData);
      map.set('a', this.adjData);
      map.set('r', this.advData);
      return map;
    },
    excFiles: function() {
      let map = new Map();
      map.set('n', this.nounExc);
      map.set('v', this.verbExc);
      map.set('a', this.adjExc);
      map.set('r', this.advExc);
      return map;
    },
    lexicographerFiles: function() {
      let map = new Map();
      map.set(0, this.adjAll);
      map.set(1, this.adjPert);
      map.set(2, this.advAll);
      map.set(3, this.nounTops);
      map.set(4, this.nounAct);
      map.set(5, this.nounAnimal);
      map.set(6, this.nounArtifact);
      map.set(7, this.nounAttribute);
      map.set(8, this.nounBody);
      map.set(9, this.nounCognition);
      map.set(10, this.nounCommuncation);
      map.set(11, this.nounEvent);
      map.set(12, this.nounFeeling);
      map.set(13, this.nounFood);
      map.set(14, this.nounGroup);
      map.set(15, this.nounLocation);
      map.set(16, this.nounMotive);
      map.set(17, this.nounObject);
      map.set(18, this.nounPerson);
      map.set(19, this.nounPhenomenon);
      map.set(20, this.nounPlant);
      map.set(21, this.nounPossession);
      map.set(22, this.nounProcess);
      map.set(23, this.nounQuantity);
      map.set(24, this.nounRelation);
      map.set(25, this.nounShape);
      map.set(26, this.nounState);
      map.set(27, this.nounSubstance);
      map.set(28, this.nounTime);
      map.set(29, this.verbBody);
      map.set(30, this.verbChange);
      map.set(31, this.verbCognition);
      map.set(32, this.verbCommunication);
      map.set(33, this.verbCompetition);
      map.set(34, this.verbConsumption);
      map.set(35, this.verbContact);
      map.set(36, this.verbCreation);
      map.set(37, this.verbEmotion);
      map.set(38, this.verbMotion);
      map.set(39, this.verbPerception);
      map.set(40, this.verbPossession);
      map.set(41, this.verbSocial);
      map.set(42, this.verbStative);
      map.set(43, this.verbWeather);
      map.set(44, this.adjPpl);
      return map;
    },
    ptrSymbols: function() {
      let outerMap = new Map();
      let nounsMap = new Map();
      let verbsMap = new Map();
      let adjsMap = new Map();
      let advsMap = new Map();
      outerMap.set('n', nounsMap);
      outerMap.set('v', verbsMap);
      outerMap.set('a', adjsMap);
      outerMap.set('r', advsMap);

      nounsMap.set('!', 'Antonym');
      nounsMap.set('@', 'Hypernym');
      nounsMap.set('@i', 'Instance Hypernym');
      nounsMap.set('~', 'Hyponym');
      nounsMap.set('~i', 'Instance Hyponym');
      nounsMap.set('#m', 'Member holonym');
      nounsMap.set('#s', 'Substance holonym');
      nounsMap.set('#p', 'Part holonym');
      nounsMap.set('%m', 'Member meronym');
      nounsMap.set('%s', 'Substance meronym');
      nounsMap.set('%p', 'Part meronym');
      nounsMap.set('=', 'Attribute');
      nounsMap.set('+', 'Derivationally related form');
      nounsMap.set(';c', 'Domain of synset - TOPIC');
      nounsMap.set('-c', 'Member of this domain - TOPIC');
      nounsMap.set(';r', 'Domain of synset - REGION');
      nounsMap.set('-r', 'Member of this domain - REGION');
      nounsMap.set(';u', 'Domain of synset - USAGE');
      nounsMap.set('-u', 'Member of this domain - USAG');

      verbsMap.set('!', 'Antonym');
      verbsMap.set('@', 'Hypernym');
      verbsMap.set('~', 'Hyponym');
      verbsMap.set('*', 'Entailment');
      verbsMap.set('>', 'Cause');
      verbsMap.set('^', 'Also see');
      verbsMap.set('$', 'Verb Group');
      verbsMap.set('+', 'Derivationally related form');
      verbsMap.set(';c', 'Domain of synset - TOPIC');
      verbsMap.set(';r', 'Domain of synset - REGION');
      verbsMap.set(';u', 'Domain of synset - USAGE');

      adjsMap.set('!', 'Antonym');
      adjsMap.set('&', 'Similar to');
      adjsMap.set('<', 'Participle of verb');
      adjsMap.set('\\', 'Pertainym (pertains to noun)');
      adjsMap.set('=', 'Attribute');
      adjsMap.set('^', 'Also see');
      adjsMap.set(';c', 'Domain of synset - TOPIC');
      adjsMap.set(';r', 'Domain of synset - REGION');
      adjsMap.set(';u', 'Domain of synset - USAG');

      advsMap.set('!', 'Antonym');
      advsMap.set('\\', 'Derived from adjective');
      advsMap.set(';c', 'Domain of synset - TOPIC');
      advsMap.set(';r', 'Domain of synset - REGION');
      advsMap.set(';u', 'Domain of synset - USAG');
      return outerMap;
    },
    chosenData: function() {
      if(!this.dataWasLoaded || this.chosenIndex === -1 ||
        this.chosenGroup === -1)
        return {};
      let data = [];
      switch(this.chosenGroup) {
        case 0:
          data = this.chosenNoun;
          break;
        case 1:
          data = this.chosenVerb;
          break;
        case 2:
          data = this.chosenAdj;
          break;
        case 3:
          data = this.chosenAdv;
          break;
        default:
          break;
      }
      if(this.chosenIndex < data.length)
        return data[this.chosenIndex];
      return {}; 
    },
    wnCont: function() {
      let word = this.searched.trim().toLowerCase();
      if(!word)
        return '';
      word = word.replace(/ /g, "_");

      let indexFile = [];
      let dataFile = new Map();
      let res = '';
      for(let part of this.poss) {
        res = this.binSearch(word, this.posIndex.get(part));
        if(res == -1)
        {
          let excWord = this.findBaseWord(part, word);
          if(excWord == -1)
            continue;
          res = this.binSearch(excWord, this.posIndex.get(part));
          if(res == -1)
            continue;
          word = excWord;
        }
        let split = res.split(' ');
        let lemma = split[0];
        let pos = split[1];
        let synset_cnt = parseInt(split[2]);
        let p_cnt = parseInt(split[3]);
        let ptr_symbol = [];
        for(let i = 0; i < p_cnt; i++)
        {
          ptr_symbol.push(split[4 + i]);
        }
        //let sense_cnt = split[4 + p_cnt]; // just redundant
        let tagsense_cnt = parseInt(split[5 + p_cnt]);
        let synset_offset = [];
        for(let i = 0; i < synset_cnt; i++)
        {
          synset_offset.push(parseInt(split[6 + p_cnt + i]));

          let key = pos + synset_offset[i];
          let val = this.parseDataline(pos, synset_offset[i], word);
          dataFile.set(key, val);
        }
        indexFile.push({lemma: lemma, pos: pos, synset_cnt: synset_cnt, p_cnt: p_cnt,
          ptr_symbol: [...ptr_symbol], tagsense_cnt: tagsense_cnt, synset_offset: [...synset_offset]});
      }

      let ret = {index: indexFile, data: dataFile};
      return ret; 
    },
  },
  methods: {
    showHelp() {
      this.showWordNetHelp = true;
      let animDuration = 200;
      this.$nextTick(async function() {
        let a = document.getElementById('helpIcon');
        let b = document.getElementById('helpBlock');
        ramjet.hide(b);
        ramjet.transform(a,b, {duration: animDuration});
        await new Promise(r => setTimeout(r, animDuration));
        ramjet.show(b);
      });
    },
    closeExternalCard(isParent) {
      if(!isParent) {
        this.preventHelpClosing = true;
        return;
      }
      if(this.preventHelpClosing)
      {
        this.preventHelpClosing = false;
        return;
      }
      let animDuration = 200;
      this.$nextTick(async function() {
        let a = document.getElementById('helpIcon');
        let b = document.getElementById('helpBlock');
        ramjet.hide(b);
        ramjet.transform(b,a, {duration: animDuration});
      });
      this.showWordNetHelp = false;
    },
    updateNodeNames(e) {
      this.adjNodeNames = e;
    },
    highlightNode(e) {
      this.selectedRow = e.row;
      this.selectedCol = e.col;
    },
    showNewGraph(e) {
      this.chosenGroup = e.group;
      this.chosenIndex = e.index;
    },
    reloadMatrix () {
      this.reloadingMatrix = true;

      this.adjMatrix = [];
      setTimeout(() => {
        this.reloadingMatrix = false;}, 2000);
    },
    randomWord: function() {
      this.choosingRandomWord= true;
      let file = this.posIndex.get('n');
      let lines = file.split(/\r\n|\r|\n/);
      let len = lines.length - 1;
      let line = lines[Math.floor(Math.random() * len)];
      this.searched = line.split(' ')[0].replace(/_/g, " ");
      setTimeout(() => {
        this.choosingRandomWord = false;}, 2000);

    },
    increaseDepthNum() {
      this.exploreDepth++;
    },
    decreaseDepthNum() {
      if(this.exploreDepth === 0)
        return;
      this.exploreDepth--;
    },
    posFound: async function(currPos) {
      return this.$worker.run((currPos, wnCont, posData, relevantSymbols, depth) => {
        const {index, data} = wnCont;
        if(!index)
          return [];

        let arr = [];

        for(let i = 0; i < index.length ; i++) {
          let el = index[i];
          if(el.pos.localeCompare(currPos))
            continue;

          for(let ii = 0; ii < el.synset_offset.length; ii++) {
            let off = el.synset_offset[ii];
            arr.push(data.get(el.pos + off))
          }
        }

        if(!arr.length || depth <= 0 || isNaN(depth))
          return [];

        for(let i = 0; i < arr.length; i++) {
          let element = arr[i];
          let queue = element.ptrs.map(ptr => {
            return {ptr: ptr, depth: depth -1};});

          let index = 0 ;
          let now = performance.now();
          while(index < queue.length)
          {
            let currQueueEl = queue[index++];
            let pos = currQueueEl.ptr.pos;
            let offset = currQueueEl.ptr.synset_offset;

            let newlineId = posData.get(pos).indexOf('\n', offset);
            let line = posData.get(pos).slice(offset, newlineId);
            let split = line.split(' ');
            let w_cnt = parseInt(split[3], 16);
            let words = [];
            for(let i = 0; i < w_cnt; i++)
              words.push({word: split[4 + 2 * i], lex_id: split[5 + 2 * i]});

            let p_cnt = parseInt(split[4 + 2 * w_cnt]);
            let ptrs = [];
            for(let j = 0; j < p_cnt; j++)
            {
              let src_trgt = split[8 + 2 * w_cnt + 4 * j];
              let src = parseInt(src_trgt.slice(0,2) ,16);
              let trgt = parseInt(src_trgt.slice(2,4) ,16);
              let ptr_sym = split[5 + 2 * w_cnt + 4 * j];
              let synset_offset = parseInt(split[6 + 2 * w_cnt + 4 * j]);
              let newPos = split[7 + 2 * w_cnt + 4 * j];

              ptrs.push({pointer_symbol: ptr_sym, synset_offset: synset_offset,
                pos: newPos, source: src, target: trgt});
            }
            currQueueEl.ptr.ptrs = [...ptrs];
            currQueueEl.ptr.words = [...words];
            if(currQueueEl.depth)
            {
              for(let j = 0; j < ptrs.length; j++) {
                let ptr = ptrs[j];
                if(relevantSymbols.includes(ptr.pointer_symbol))
                  queue.push({ptr: ptr, depth: currQueueEl.depth - 1});
              }
            }
            if(performance.now() - now > 150)
              setTimeout(now = performance.now(), 1);
          }

        }
        return [...arr];
    }, [currPos, this.wnCont, this.posData, this.relevantSymbols, this.exploreDepth])
    },
    findFullChain: async function(element, char) {
      let res = [];
      let oneEl = await this.findOneElement(element, char, true);
      if(!oneEl.ptrs)
        return [];
      res.push(oneEl.words);
      while(oneEl.ptrs.filter(a => a.pointer_symbol.localeCompare(char) === 0).length)
      {
        oneEl = await this.findOneElement(oneEl, char, true);
        res.push(oneEl.words);
      }
      return res;
    },
    findOneElement: async function(element, char, exactMatch) {
      if(!element.ptrs || element.ptrs.length === 0)
        return {};
      let elWithChar = element.ptrs.filter(a => {
        return exactMatch ? a.pointer_symbol.localeCompare(char) === 0 : a.pointer_symbol.includes(char);
      });
      if(!elWithChar.length)
        return {};

      let res = this.parseDataline(elWithChar[0].pos, elWithChar[0].synset_offset, '');
      let words = [];
      res.words.forEach(wordObj => words.push(wordObj.word));
      let ret = {words: words, ptrs: res.ptrs};

      return ret;
    },
    customCompare: function(a, b) {
      //neg if a before b, pos a after b, 0 same 
      let minLen = Math.min(a.length, b.length);
      let diff = 0;
      for(let id = 0; id < minLen; id++) 
      {
        diff = a.charCodeAt(id) - b.charCodeAt(id);
        if(diff)
          return diff;
      }
      if(a.length === b.length)
        return 0;
      return a.length - b.length;
    },
    binSearch: function(word, file) {
      let lines = file.split(/\r\n|\r|\n/);
      let len = lines.length - 1;
      let index = Math.round((len)/ 2); 
      let start = 0;
      let end = len;
      while(end >= start)
      {
        let currWord = lines[index].split(' ')[0];

        let compare = this.customCompare(currWord, word);
        if(!compare)
          return lines[index];
        else if(compare < 0)
          start = index + 1;
        else
          end = index - 1;

        index = Math.round(start + (end - start) / 2);
      }
      return -1;
      },
    parseDataline: function(pos, offset, searchedWord) {
      let data = {};
      let newlineId = this.posData.get(pos).indexOf('\n', offset);
      let line = this.posData.get(pos).slice(offset, newlineId);
      let split = line.split(' ');
      let synset_offset = parseInt(split[0]);
      let lex_filenum = parseInt(split[1]); 
      let ss_type = split[2];
      let w_cnt = parseInt(split[3], 16);
      let words = [];
      for(let i = 0; i < w_cnt; i++)
      {
        words.push({word: split[4 + 2 * i], lex_id: split[5 + 2 * i]});
      }
      let p_cnt = parseInt(split[4 + 2 * w_cnt]);
      let ptrs = [];
      for(let i = 0; i < p_cnt; i++)
      {
        let src_trgt = split[8 + 2 * w_cnt + 4 * i];
        let src = parseInt(src_trgt.slice(0,2) ,16);
        let trgt = parseInt(src_trgt.slice(2,4) ,16);
        let ptr_sym = split[5 + 2 * w_cnt + 4 * i];
        let synset_offset = parseInt(split[6 + 2 * w_cnt + 4 * i]);
        let newPos = split[7 + 2 * w_cnt + 4 * i];

        ptrs.push({pointer_symbol: ptr_sym, synset_offset: synset_offset,
          pos: newPos, source: src, target: trgt});
      }
      data = {synset_offset: synset_offset, lex_filenum: lex_filenum, ss_type: ss_type,
        w_cnt: w_cnt, words: [...words], p_cnt: p_cnt, ptrs: [...ptrs], keyWord: searchedWord};
      //if no | then there are frames
      if(split[5 + 2 * w_cnt + 4 * p_cnt].localeCompare('|'))
      {
        let f_cnt = parseInt(split[5 + 2 * w_cnt + 4 * p_cnt], 10);
        let frames = [];
        for(let i = 0; i < f_cnt; i++)
        {
          frames.push({f_num: split[7 + 2 * w_cnt + 4 * p_cnt + 3 * i],
            w_num: split[8 + 2 * w_cnt + 4 * p_cnt + 3 * i]});
        }
        data['f_cnt'] = f_cnt;
        data['frames'] = frames;
      }
      let glossIdx = line.indexOf('|');
      let glossSplit = line.slice(glossIdx + 2, -1).trim().split(';');
      let glosses = [];
      let examples = [];
      glossSplit.forEach(gloss => {
        if(gloss.includes('"'))
          examples.push(gloss);
        else
          glosses.push(gloss);
      });
      data['gloss'] = [...glosses];
      data['example'] = [...examples];
      return data;
    },
      findBaseWord: function(pos, word) {
        let line = this.binSearch(word, this.excFiles.get(pos));
        if(line == -1)
          return -1;
        return line.split(' ')[1];
      },
    regenData: async function() {
      let currentSearched = this.searched;
      let currentDepth = this.exploreDepth;
      this.chosenGroup = -1;
      this.chosenIndex = -1;
      this.chosenNoun = {};
      this.chosenVerb = {};
      this.chosenAdj = {};
      this.chosenAdv= {};
      this.loadedNoun = false;
      this.loadedVerb = false;
      this.loadedAdj = false;
      this.loadedAdv= false;
      this.dataWasLoaded = false;
      let tempNoun = await this.posFound('n');
      let tempVerb = await this.posFound('v');
      let tempAdj = await this.posFound('a');
      let tempAdv = await this.posFound('r');
      if(this.searched !== currentSearched || this.exploreDepth !== currentDepth)
        return;
      this.loadedNoun = true;
      this.loadedVerb = true;
      this.loadedAdj= true;
      this.loadedAdv= true;
      this.chosenNoun = tempNoun;
      this.chosenVerb = tempVerb;
      this.chosenAdj= tempAdj;
      this.chosenAdv= tempAdv;
      if(this.chosenNoun.length)
      {
        this.chosenGroup = 0;
      }
      else if(this.chosenVerb.length)
      {
        this.chosenGroup = 1;
      }
      else if(this.chosenAdj.length)
      {
        this.chosenGroup = 2;
      }
      else if(this.chosenAdv.length)
      {
        this.chosenGroup = 3;
      }
      if(this.chosenGroup !== -1)
        this.chosenIndex = 0;

      this.dataWasLoaded = true;
    }
  },
  watch: {
    searched: async function() {
      await this.regenData();
    },
    exploreDepth: async function() {
      await this.regenData();
    }
  },
  async created() {
    if(this.nounIndex)
      return;
    let response;
    response = await import('./../data/dict/index.noun.json');
    this.nounIndex = response.default.data;
    response = await import('./../data/dict/index.verb.json');
    this.verbIndex = response.default.data;
    response = await import('./../data/dict/index.adj.json');
    this.adjIndex = response.default.data;
    response = await import('./../data/dict/index.adv.json');
    this.advIndex = response.default.data;

    response = await import('./../data/dict/data.noun.json');
    this.nounData = response.default.data;
    response = await import('./../data/dict/data.verb.json');
    this.verbData = response.default.data;
    response = await import('./../data/dict/data.adj.json');
    this.adjData = response.default.data;
    response = await import('./../data/dict/data.adv.json');
    this.advData = response.default.data;

    response = await import('./../data/dict/noun.exc.json');
    this.import = response.default.data;
    response = await import('./../data/dict/verb.exc.json');
    this.verbExc = response.default.data;
    response = await import('./../data/dict/adj.exc.json');
    this.adjExc = response.default.data;
    response = await import('./../data/dict/adv.exc.json');
    this.advExc = response.default.data;

    response = await import('./../data/dict/dbfiles/adj.all.json');
    this.adjAll = response.default.data;
    response = await import('./../data/dict/dbfiles/adj.pert.json');
    this.adjPert = response.default.data;
    response = await import('./../data/dict/dbfiles/adv.all.json');
    this.advAll = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.Tops.json');
    this.nounTops = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.act.json');
    this.nounAct = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.animal.json');
    this.nounAnimal = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.artifact.json');
    this.nounArtifact = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.attribute.json');
    this.nounAttribute = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.body.json');
    this.nounBody = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.cognition.json');
    this.nounCognition = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.communication.json');
    this.nounCommuncation = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.event.json');
    this.nounEvent = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.feeling.json');
    this.nounFeeling = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.food.json');
    this.nounFood = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.group.json');
    this.nounGroup = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.location.json');
    this.nounLocation = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.motive.json');
    this.nounMotive = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.object.json');
    this.nounObject = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.person.json');
    this.nounPerson = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.phenomenon.json');
    this.nounPhenomenon = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.plant.json');
    this.nounPlant = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.possession.json');
    this.nounPossession = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.process.json');
    this.nounProcess = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.quantity.json');
    this.nounQuantity = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.relation.json');
    this.nounRelation = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.shape.json');
    this.nounShape = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.state.json');
    this.nounState = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.substance.json');
    this.nounSubstance = response.default.data;
    response = await import('./../data/dict/dbfiles/noun.time.json');
    this.nounTime = response.default.data;
    response = await import('./../data/dict/dbfiles/verb.body.json');
    this.verbBody = response.default.data;
    response = await import('./../data/dict/dbfiles/verb.change.json');
    this.verbChange = response.default.data;
    response = await import('./../data/dict/dbfiles/verb.cognition.json');
    this.verbCognition = response.default.data;
    response = await import('./../data/dict/dbfiles/verb.communication.json');
    this.verbCommunication = response.default.data;
    response = await import('./../data/dict/dbfiles/verb.competition.json');
    this.verbCompetition = response.default.data;
    response = await import('./../data/dict/dbfiles/verb.consumption.json');
    this.verbConsumption = response.default.data;
    response = await import('./../data/dict/dbfiles/verb.contact.json');
    this.verbContact = response.default.data;
    response = await import('./../data/dict/dbfiles/verb.creation.json');
    this.verbCreation = response.default.data;
    response = await import('./../data/dict/dbfiles/verb.emotion.json');
    this.verbEmotion = response.default.data;
    response = await import('./../data/dict/dbfiles/verb.motion.json');
    this.verbMotion = response.default.data;
    response = await import('./../data/dict/dbfiles/verb.perception.json');
    this.verbPerception = response.default.data;
    response = await import('./../data/dict/dbfiles/verb.possession.json');
    this.verbPossession = response.default.data;
    response = await import('./../data/dict/dbfiles/verb.social.json');
    this.verbSocial = response.default.data;
    response = await import('./../data/dict/dbfiles/verb.stative.json');
    this.verbStative = response.default.data;
    response = await import('./../data/dict/dbfiles/verb.weather.json');
    this.verbWeather = response.default.data;
    response = await import('./../data/dict/dbfiles/adj.ppl.json');
    this.adjPpl = response.default.data;
    this.loaded = true;
  }

}
</script>

<style scoped lang="scss">
footer {
  padding: 10px;
}
#lightFooter a {
  font-weight: bold;
  color: $vue-primary;
}

#darkFooter a {
  font-weight: bold;
  color: $text-primary-dark;
}

.helpIcon {
  position: absolute;
  top: 1.2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.938rem;
}

.helpIcon > button{
  margin-right: 1rem; 
}

/* slide legend message */
$slide-speed : 1s;

.sliding-enter-active, .sliding-leave-active{
  transition: all $slide-speed ease-in-out;
}

.sliding-leave-to{
  transform: translate(-107%, -50%) !important;
}
.sliding-enter{
  transform: translate(-107%, -50%) !important;
}

/* slide legend message END*/

</style>
