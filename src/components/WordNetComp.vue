<template>
  <div>
    <b-spinner type="grow" label="Loading..." v-if="!loaded" :variant="darkTheme ? 'light' : 'dark'"></b-spinner>
    <div class="wordNetComp row" v-else>
      <div class="col">
        <b-form-input :class="{'darkInputForm' : darkTheme}" v-model="searched" placeholder="Input something"></b-form-input>
        <DictEntry entryType="Noun" :data="chosenNoun" />
        <DictEntry entryType="Verb" :data="chosenVerb" />
        <DictEntry entryType="Adjective" :data="chosenAdj" />
        <DictEntry entryType="Adverb" :data="chosenAdv" />
        <span v-if="posFound('a').length">
        </span>

        <footer :id="darkTheme? 'darkFooter' : 'lightFooter'">
          Princeton University "About WordNet." 
          <a href="https://wordnet.princeton.edu">WordNet</a>. 
          Princeton University. 2010.
        </footer>
      </div>
      <div class="graphComp col">
        <GraphComp :dark-theme="darkTheme" :data="chosenData"/>
      </div>
    </div>
  </div>
</template>

<script>
import DictEntry from "./DictEntry";
import GraphComp from '@/components/GraphComp.vue'

export default {
  props: {
    darkTheme: {
      type: Boolean,
      required: true
    }
  },
  components: {
    DictEntry,
    GraphComp,
  },
  data() {
    return {
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
    posIndex : function() {
      let map = new Map();
      map.set('n', this.nounIndex);
      map.set('v', this.verbIndex);
      map.set('a', this.adjIndex);
      map.set('r', this.advIndex);
      this.testing;
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
          let val = this.parseDataline(pos, synset_offset[i], word, 3);
          //call function to find all hypnonyms, then hypernyms etc
          dataFile.set(key, val);
        }
        // need hyponym ~, hypernym @, holonym #, meronym %
        indexFile.push({lemma: lemma, pos: pos, synset_cnt: synset_cnt, p_cnt: p_cnt,
          ptr_symbol: [...ptr_symbol], tagsense_cnt: tagsense_cnt, synset_offset: [...synset_offset]});

      });
      console.log(dataFile);

      let ret = {index: indexFile, data: dataFile};
      return ret; 
    },
    chosenNoun: function() {
      return this.printablePos(this.posFound('n'));
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
      let ret = this.chosenNoun;
      let nData = ret.data ? ret.data.size : 0;
      if(this.chosenVerb.data && this.chosenVerb.data.size > nData)
      {
        ret = this.chosenVerb;
        nData = ret.data.size;
      }
      if(this.chosenAdj.data && this.chosenAdj.data.size > nData)
      {
        ret = this.chosenAdj;
        nData = ret.data.size;
      }
      if(this.chosenAdv.data && this.chosenAdv.data.size > nData)
      {
        ret = this.chosenAdv;
      }
      return ret[0];
    },
  },
  methods: {
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
        el.ptrs.forEach(ptr => {
          if(!ptr.data)
            return;
          let label = this.ptrSymbols.get(currPos).get(ptr.pointer_symbol);
          if(!el.data)
            el.data = new Map();
          if(!el.data.has(label))
            el.data.set(label, []);
          el.data.get(label).push({id : el.data.get(label).length, words:[...ptr.data.words]});
        });
      });
      return [...arr];
    },
    printablePos: function(pos) {
      let toChooseFrom = [];
      let maxData = 0;
      pos.forEach(el => {
        if(!el.data || el.data.size < maxData)
          return;
        else if(el.data.size > maxData)
        {
          toChooseFrom = [];
          maxData = el.data.size;
        }
        toChooseFrom.push(el);
      });
      if(toChooseFrom.length === 0)
        return [];
      let chosen = toChooseFrom[Math.floor(Math.random() * toChooseFrom.length)];
      chosen.data.forEach((arr, label) => {
        let chosenWords = arr[Math.floor(Math.random() * arr.length)];
        chosen.data.set(label, [chosenWords]); 
      });

      return [chosen];
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
    parseDataline: function(pos, offset, searchedWord, depth) {
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
        let data = null;
        if(depth > 0 && (ptr_sym.localeCompare('@') === 0 || ptr_sym.localeCompare('~') === 0))
            data = this.parseDataline(newPos, synset_offset, '', depth - 1);
        else if(searchedWord && (ptr_sym.localeCompare('!') === 0 ||
          ptr_sym.localeCompare('\\') === 0 || ptr_sym.includes('#') || ptr_sym.includes('%')))
          data = this.parseDataline(newPos, synset_offset, '', depth - 1);

        ptrs.push({pointer_symbol: ptr_sym, synset_offset: synset_offset,
          pos: newPos, source: src, target: trgt, data: data});
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

<style scoped>
footer {
    padding: 10px;
}

#lightFooter a {
  font-weight: bold;
  color: #2c3e50;
}

#darkFooter a {
  font-weight: bold;
  color: #f8f1f1;
}

.darkInputForm {
  background-color: #303131;
  border: 1px solid #111;
  color: #f8f1f1;
}

.darkInputForm::placeholder {
  color: #888;
}

.graphComp {
  width:100%;
  height: 100%;
}

</style>
