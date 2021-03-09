<template>
  <div>
    <div class="wordNetComp row">
      <div class="col-4">
      <b-card title="Control Panel" v-bind:bg-variant="!darkTheme ? 'light' : 'dark'" v-bind:text-variant="!darkTheme ? '' : 'white'">
        <b-card-body>
          <b-card-text>
          <div class="cyclesDiv">
            <span :class="{'disabledText' : showWordNet}">Adjacency Matrix</span>
            <ToggleSwitch :darkTheme="darkTheme" v-model="showWordNet" />
            <span :class="{'disabledText' : !showWordNet}">WordNet</span>
          </div>
          <span v-if="showWordNet">
            <b-spinner type="grow" label="Loading..." v-if="!loaded" :variant="darkTheme ? 'light' : 'dark'"></b-spinner>
            <div v-else>
              <div class="cyclesDiv">
                <span>Search depth (current {{exploreDepth}}, slow above 2)</span>
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
              <span class="toggleBlock">Matrix size</span>
              <b-form-input size="sm" v-model="adjMatSize"
                                      :class="{'shake' : invalidMatrixSize, 'darkInputForm' : darkTheme, 'mediumInput' : 'true'}"></b-form-input>
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
                     v-if="showWordNet" />
      <AdjacencyMat :darkTheme="darkTheme" 
                    :matrixSize="parsedAdjMatSize"
                    v-model="adjMatrix"
                    v-else />
      </div>
      <div class="col-8">
        <GraphComp :dark-theme="darkTheme" 
                   :data="chosenData"
                   :ptrSymbols="ptrSymbols" 
                   :depth="exploreDepth" 
                   v-if="showWordNet"/>
        <AdjacencyGraph :darkTheme="darkTheme"
                        :matrix="adjMatrix"
                        v-else />
      </div>
    </div>
  </div>
</template>

<script>
import WordNetResult from '@/components/WordNetResult.vue'
import GraphComp from '@/components/GraphComp.vue'
import AdjacencyMat from '@/components/AdjacencyMat.vue'
import AdjacencyGraph from '@/components/AdjacencyGraph.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'

export default {
  props: {
    darkTheme: {
      type: Boolean,
      required: true
    }
  },
  components: {
    WordNetResult,
    GraphComp,
    AdjacencyMat,
    AdjacencyGraph,
    ToggleSwitch,
  },
  data() {
    return {
      //Adj Matrix
      adjMatrix : [],
      adjMatSize: 5,
      reloadingMatrix: false,

      //Word Net
      exploreDepth : 2,
      showWordNet : false,
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
        parseFloat(this.adjMatSize) < 2;
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
    wnCont: function() {
      let word = this.searched.trim().toLowerCase();
      if(!word)
        return '';
      word = word.replace(/ /g, "_");

      let indexFile = [];
      let dataFile = new Map();
      let res = '';
      this.poss.forEach(part => {
        res = this.binSearch(word, this.posIndex.get(part));
        if(res == -1)
        {
          let excWord = this.findBaseWord(part, word);
          if(excWord == -1)
            return '';
          res = this.binSearch(excWord, this.posIndex.get(part));
          if(res == -1)
            return '';
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
      });

      let ret = {index: indexFile, data: dataFile};
      return ret; 
    },
    chosenNoun: function() {
      let ret = this.printablePos(this.posFound('n'));
      return ret;
    },
    chosenVerb: function() {
      return this.printablePos(this.posFound('v'));
    },
    chosenAdj: function() {
      return this.printablePos(this.posFound('a'));
    },
    chosenAdv: function() {
      return this.printablePos(this.posFound('r'));
    },
    chosenData: function() {
      return this.chosenNoun;
    },
  },
  methods: {
    reloadMatrix () {
      this.reloadingMatrix= true;
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
    posFound: function(currPos) {
      const {index, data} = this.wnCont;
      if(!index)
        return [];

      let arr = [];
      let elements = index.filter(el => !el.pos.localeCompare(currPos));
      if(elements.length === 0 || elements[0].synset_cnt === 0)
        return [];
      elements.forEach(el => {
        el.synset_offset.forEach(off =>
          arr.push(data.get(el.pos + off)))});
      arr.forEach(el => {
        el.memberMeronym = this.findOneElement(el, '%m', true).words;
        el.substanceMeronym = this.findOneElement(el, '%s', true).words;
        el.partMeronym = this.findOneElement(el, '%p', true).words;
        el.memberHolonym = this.findOneElement(el, '#m', true).words;
        el.substanceHolonym = this.findOneElement(el, '#s', true).words;
        el.partHolonym = this.findOneElement(el, '#p', true).words;
        el.hypernym = this.findOneElement(el, '@', true).words;
        el.hyponym = this.findOneElement(el, '~', true).words;
        el.fullHyponym = this.findFullChain(el, '@');
        el.fullHypernym = this.findFullChain(el, '~');
        this.exploreNode(el, this.exploreDepth);
      });
      return [...arr];
    },
      //BFS 
    exploreNode: function(element, depth) {
      if(depth <= 0 || isNaN(depth))
        return;
      let queue = [];

      element.ptrs.forEach(ptr => queue.push({ptr: ptr, depth: depth - 1}));
      let currQueueEl = null;
      let res = null;
      while(queue.length)
      {
        currQueueEl = queue[0];
        queue.splice(0, 1);
        res = this.parseDataline(currQueueEl.ptr.pos, currQueueEl.ptr.synset_offset, '');
        currQueueEl.ptr.memberMeronym = this.findOneElement(res, '%m', true).words;
        currQueueEl.ptr.substanceMeronym = this.findOneElement(res, '%s', true).words;
        currQueueEl.ptr.partMeronym = this.findOneElement(res, '%p', true).words;
        currQueueEl.ptr.memberHolonym = this.findOneElement(res, '#m', true).words;
        currQueueEl.ptr.substanceHolonym = this.findOneElement(res, '#s', true).words;
        currQueueEl.ptr.partHolonym = this.findOneElement(res, '#p', true).words;
        currQueueEl.ptr.hypernym = this.findOneElement(res, '@', true).words;
        currQueueEl.ptr.hyponym = this.findOneElement(res, '~', true).words;
        currQueueEl.ptr.ptrs = res.ptrs;
        currQueueEl.ptr.words = res.words;
        if(currQueueEl.depth)
        {
          res.ptrs.forEach(ptr => queue.push({ptr: ptr, depth: currQueueEl.depth - 1}));
        }
      }
    },
    findFullChain: function(element, char) {
      let res = [];
      let oneEl = this.findOneElement(element, char, true);
      if(!oneEl.ptrs)
        return [];
      res.push(oneEl.words);
      while(oneEl.ptrs.filter(a => a.pointer_symbol.localeCompare(char) === 0).length)
      {
        oneEl = this.findOneElement(oneEl, char, true);
        res.push(oneEl.words);
      }
      return res;
    },
      findOneElement: function(element, char, exactMatch) {
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
      printablePos: function(pos) {
        if(!pos.length)
          return {};
        return pos[Math.floor(Math.random() * pos.length)];
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

          let compare = currWord.localeCompare(word);
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
        //        let data = null;
        //        if(depth > 0 && (ptr_sym.localeCompare('@') === 0 || ptr_sym.localeCompare('~') === 0))
        //            data = this.parseDataline(newPos, synset_offset, '', depth - 1);
        //        else if(searchedWord && (ptr_sym.localeCompare('!') === 0 ||
        //          ptr_sym.localeCompare('\\') === 0 || ptr_sym.includes('#') || ptr_sym.includes('%')))
        //          data = this.parseDataline(newPos, synset_offset, '', depth - 1);

        ptrs.push({pointer_symbol: ptr_sym, synset_offset: synset_offset,
          pos: newPos, source: src, target: trgt});
        //          pos: newPos, source: src, target: trgt, data: data});
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
  color: #2c3e50;
}

#darkFooter a {
  font-weight: bold;
  color: $text-primary-dark;
}

</style>
