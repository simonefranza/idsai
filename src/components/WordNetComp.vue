<template>
  <div class="wordNetComp">

    <b-form-input v-model="searched" placeholder="Input something"></b-form-input>
    <div v-if="nounFound !== ''">Noun:<br/>
      <div v-for="data in nounFound" :key="data.synset_offset">
        {{data.words}} 
      </div>
    </div>
    <div v-if="verbFound !== ''">Verb:<br/>
      <div v-for="data in verbFound" :key="data.synset_offset">
        {{data.words}} 
      </div>
    </div>

    <footer>
      Princeton University "About WordNet." 
      <a href="https://wordnet.princeton.edu">WordNet</a>. 
      Princeton University. 2010.
    </footer>
  </div>
</template>

<script>

import nounIndex from '!raw-loader!./../data/dict/index.noun';
import verbIndex from '!raw-loader!./../data/dict/index.verb';
import adjIndex from '!raw-loader!./../data/dict/index.adj';
import advIndex from '!raw-loader!./../data/dict/index.adv';

import nounData from '!raw-loader!./../data/dict/data.noun';
import verbData from '!raw-loader!./../data/dict/data.verb';
import adjData from '!raw-loader!./../data/dict/data.adj';
import advData from '!raw-loader!./../data/dict/data.adv';

import nounExc from '!raw-loader!./../data/dict/noun.exc';
import verbExc from '!raw-loader!./../data/dict/verb.exc';
import adjExc from '!raw-loader!./../data/dict/adj.exc';
import advExc from '!raw-loader!./../data/dict/adv.exc';

import adjAll from '!raw-loader!./../data/dict/dbfiles/adj.all';
import adjPert from '!raw-loader!./../data/dict/dbfiles/adj.pert';
import advAll from '!raw-loader!./../data/dict/dbfiles/adv.all';
import nounTops from '!raw-loader!./../data/dict/dbfiles/noun.Tops';
import nounAct from '!raw-loader!./../data/dict/dbfiles/noun.act';
import nounAnimal from '!raw-loader!./../data/dict/dbfiles/noun.animal';
import nounArtifact from '!raw-loader!./../data/dict/dbfiles/noun.artifact';
import nounAttribute from '!raw-loader!./../data/dict/dbfiles/noun.attribute';
import nounBody from '!raw-loader!./../data/dict/dbfiles/noun.body';
import nounCognition from '!raw-loader!./../data/dict/dbfiles/noun.cognition';
import nounCommuncation from '!raw-loader!./../data/dict/dbfiles/noun.communication';
import nounEvent from '!raw-loader!./../data/dict/dbfiles/noun.event';
import nounFeeling from '!raw-loader!./../data/dict/dbfiles/noun.feeling';
import nounFood from '!raw-loader!./../data/dict/dbfiles/noun.food';
import nounGroup from '!raw-loader!./../data/dict/dbfiles/noun.group';
import nounLocation from '!raw-loader!./../data/dict/dbfiles/noun.location';
import nounMotive from '!raw-loader!./../data/dict/dbfiles/noun.motive';
import nounObject from '!raw-loader!./../data/dict/dbfiles/noun.object';
import nounPerson from '!raw-loader!./../data/dict/dbfiles/noun.person';
import nounPhenomenon from '!raw-loader!./../data/dict/dbfiles/noun.phenomenon';
import nounPlant from '!raw-loader!./../data/dict/dbfiles/noun.plant';
import nounPossession from '!raw-loader!./../data/dict/dbfiles/noun.possession';
import nounProcess from '!raw-loader!./../data/dict/dbfiles/noun.process';
import nounQuantity from '!raw-loader!./../data/dict/dbfiles/noun.quantity';
import nounRelation from '!raw-loader!./../data/dict/dbfiles/noun.relation';
import nounShape from '!raw-loader!./../data/dict/dbfiles/noun.shape';
import nounState from '!raw-loader!./../data/dict/dbfiles/noun.state';
import nounSubstance from '!raw-loader!./../data/dict/dbfiles/noun.substance';
import nounTime from '!raw-loader!./../data/dict/dbfiles/noun.time';
import verbBody from '!raw-loader!./../data/dict/dbfiles/verb.body';
import verbChange from '!raw-loader!./../data/dict/dbfiles/verb.change';
import verbCognition from '!raw-loader!./../data/dict/dbfiles/verb.cognition';
import verbCommunication from '!raw-loader!./../data/dict/dbfiles/verb.communication';
import verbCompetition from '!raw-loader!./../data/dict/dbfiles/verb.competition';
import verbConsumption from '!raw-loader!./../data/dict/dbfiles/verb.consumption';
import verbContact from '!raw-loader!./../data/dict/dbfiles/verb.contact';
import verbCreation from '!raw-loader!./../data/dict/dbfiles/verb.creation';
import verbEmotion from '!raw-loader!./../data/dict/dbfiles/verb.emotion';
import verbMotion from '!raw-loader!./../data/dict/dbfiles/verb.motion';
import verbPerception from '!raw-loader!./../data/dict/dbfiles/verb.perception';
import verbPossession from '!raw-loader!./../data/dict/dbfiles/verb.possession';
import verbSocial from '!raw-loader!./../data/dict/dbfiles/verb.social';
import verbStative from '!raw-loader!./../data/dict/dbfiles/verb.stative';
import verbWeather from '!raw-loader!./../data/dict/dbfiles/verb.weather';
import adjPpl from '!raw-loader!./../data/dict/dbfiles/adj.ppl';

export default {
  data() {
    return {
      searched: '',
      poss: ['n', 'v', 'a', 'r']

    }
  },
  computed: {
    posIndex : function() {
      let map = new Map();
      map.set('n', nounIndex);
      map.set('v', verbIndex);
      map.set('a', adjIndex);
      map.set('r', advIndex);
      return map;
    },
    posData: function() {
      let map = new Map();
      map.set('n', nounData);
      map.set('v', verbData);
      map.set('a', adjData);
      map.set('r', advData);
      return map;
    },
    excFiles: function() {
      let map = new Map();
      map.set('n', nounExc);
      map.set('v', verbExc);
      map.set('a', adjExc);
      map.set('r', advExc);
      return map;
    },
    lexicographerFiles: function() {
      let map = new Map();
      map.set(0, adjAll);
      map.set(1, adjPert);
      map.set(2, advAll);
      map.set(3, nounTops);
      map.set(4, nounAct);
      map.set(5, nounAnimal);
      map.set(6, nounArtifact);
      map.set(7, nounAttribute);
      map.set(8, nounBody);
      map.set(9, nounCognition);
      map.set(10, nounCommuncation);
      map.set(11, nounEvent);
      map.set(12, nounFeeling);
      map.set(13, nounFood);
      map.set(14, nounGroup);
      map.set(15, nounLocation);
      map.set(16, nounMotive);
      map.set(17, nounObject);
      map.set(18, nounPerson);
      map.set(19, nounPhenomenon);
      map.set(20, nounPlant);
      map.set(21, nounPossession);
      map.set(22, nounProcess);
      map.set(23, nounQuantity);
      map.set(24, nounRelation);
      map.set(25, nounShape);
      map.set(26, nounState);
      map.set(27, nounSubstance);
      map.set(28, nounTime);
      map.set(29, verbBody);
      map.set(30, verbChange);
      map.set(31, verbCognition);
      map.set(32, verbCommunication);
      map.set(33, verbCompetition);
      map.set(34, verbConsumption);
      map.set(35, verbContact);
      map.set(36, verbCreation);
      map.set(37, verbEmotion);
      map.set(38, verbMotion);
      map.set(39, verbPerception);
      map.set(40, verbPossession);
      map.set(41, verbSocial);
      map.set(42, verbStative);
      map.set(43, verbWeather);
      map.set(44, adjPpl);
      return map;
    },
    wnCont: function() {
      let word = this.searched.trim();
      if(!word)
        return '';
      console.log(word);
      word = word.replace(/ /g, "_");
      console.log(word);

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
        }
        let split = res.split(' ');
        console.log(split);
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

          dataFile.set(pos+synset_offset[i], this.parseDataline(pos, synset_offset[i]));
        }
        indexFile.push({lemma: lemma, pos: pos, synset_cnt: synset_cnt, p_cnt: p_cnt,
          ptr_symbol: [...ptr_symbol], tagsense_cnt: tagsense_cnt, synset_offset: [...synset_offset]});

      });

      let ret = {index: indexFile, data: dataFile};
      console.log(ret);
      return ret; 
    },
    nounFound: function() {
      const {index, data} = this.wnCont;
      if(!index)
        return '';

      let arr = [];
      let nouns = index.filter(el => !el.pos.localeCompare('n'));
      if(nouns.length === 0 || nouns[0].synset_cnt === 0)
        return '';
      nouns.forEach(noun => {
        noun.synset_offset.forEach(off =>
          arr.push(data.get(noun.pos + off)))});

      return arr;
    },
    verbFound: function() {
      const {index, data} = this.wnCont;
      if(!index)
        return '';

      let arr = [];
      let nouns = index.filter(el => !el.pos.localeCompare('v'));
      if(nouns.length === 0 || nouns[0].synset_cnt === 0)
        return '';
      nouns.forEach(noun => {
        noun.synset_offset.forEach(off =>
          arr.push(data.get(noun.pos + off)))});

      return arr;
    }
  },
  methods: {
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
    parseDataline: function(pos, offset) {
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
        ptrs.push({pointer_symbol: split[5 + 2 * w_cnt + 4 * i],
          synset_offset: parseInt(split[6 + 2 * w_cnt + 4 * i]),
          pos: split[7 + 2 * w_cnt + 4 * i], source: src, target: trgt});
      }
      data = {synset_offset: synset_offset, lex_filenum: lex_filenum, ss_type: ss_type,
        w_cnt: w_cnt, words: [...words], p_cnt: p_cnt, ptrs: [...ptrs]};
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
      data['gloss'] = line.slice(glossIdx + 2, -1).trim();
      return data;
    },
    findBaseWord: function(pos, word) {
      let line = this.binSearch(word, this.excFiles.get(pos));
      if(line == -1)
        return -1;
      return line.split(' ')[1];
    }
  }

}
</script>
