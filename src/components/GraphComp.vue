<template>
  <div class="graphComp">
    <!-- from https://codepen.io/emilio/pen/QOaQjP -->
    <d3-network :net-nodes="nodesAndLinks.nodes" :net-links="nodesAndLinks.links" :options="options" />
<!--    <d3-network :net-nodes="nodesAndLinks.nodes" :net-links="nodesAndLinks.links" :options="options" :link-cb="lcb" />
      <svg style="position: absolute; z-index: -1000; margin-top: -100px; margin-left: -100px;">
        <defs>
        <marker id="m-end" markerWidth="10" markerHeight="10" refX="6" refY="4" orient="auto" markerUnits="strokeWidth" >
        <path d="M0,2 L0,2 L0,6 L5,4 z"></path>
        </marker>
        </defs>
      </svg>
      -->
  </div>

</template>

<script>
import D3Network from 'vue-d3-network'
export default {
  props: {
    darkTheme: {
      type: Boolean,
      required: true
    },
    data : { required: true },
    ptrSymbols: {required: true},
    depth: {required: true},
  },
  components: {
    D3Network,
  },
  data() {
    return {
      options:
      {
        force: 5000,
        nodeSize: 20,
        nodeLabels: true,
        linkLabels: true,
        linkWidth:5,
        strLinks: false,
      },
    }
  },
  computed: {
    nodesAndLinks: function() {
      if(!this.data || !this.data.ptrs)
        return {nodes: [], links: []};
      let nodes = [];
      let links = [];
      let addedNames = [];
      let currId = 1;
      nodes.push({id: currId++, name: this.formatWord(this.data.words[0].word)});
      if(!this.depth)
      {
        nodes.forEach(el => el._color = this.darkTheme ? '#f5d782' : '#41ba82');
        this.setStyle();
        return {nodes: nodes, links:  []};
      }
      addedNames.push(this.data.words[0].word.toUpperCase());
      let functions = [this.hypernyms, this.hyponyms, this.memberHolonym, this.substanceHolonym,
        this.partHolonym, this.memberMeronym, this.substanceMeronym, this.partMeronym];
      functions.forEach(func => {
        let currData = func(this.data);
        if(!currData.length || !currData[0].words || addedNames.includes(currData[0].words[0].word.toUpperCase()))
          return;
        nodes.push({id: currId++, name: this.formatWord(currData[0].words[0].word)});
        addedNames.push(currData[0].words[0].word.toUpperCase());
        links.push({sid: 1, tid: currId-1, name: this.abbreviationSymbols.get(currData[0].pointer_symbol) + '->'});
        if(!this.depth)
          return;
        let queue = [];
        functions.forEach(func => {
          let funcData = func(currData[0]);
          if(!funcData.length)
            return;
          queue.push({ptr: funcData[0], depth: this.depth - 1, word: currData[0].words[0].word});
        });

        let currQueueEl = null;
        while(queue.length)
        {
          currQueueEl = queue[0];
          queue.splice(0, 1);
          if(!currQueueEl.ptr.words)
            continue;
          if(!currQueueEl.ptr.words.length)
              continue;
          if(!addedNames.includes(currQueueEl.ptr.words[0].word.toUpperCase()))
          {
            nodes.push({id: currId++, name: this.formatWord(currQueueEl.ptr.words[0].word)});
            addedNames.push(currQueueEl.ptr.words[0].word.toUpperCase());
          }
          let sid = this.getNodeId(nodes, currQueueEl.word);
          let tid = this.getNodeId(nodes, currQueueEl.ptr.words[0].word);
          if(sid !== -1 && tid !== -1 && !this.isLinkAlreadyPresent(links, sid, tid))
          {
            links.push({sid: sid, tid: tid, name: this.abbreviationSymbols.get(currQueueEl.ptr.pointer_symbol) + '->'});
            if(this.abbreviationSymbols.get(currQueueEl.ptr.pointer_symbol) === undefined)
            {
              console.log("undefined", currQueueEl.ptr.pointer_symbol);
            }
          }
          if(currQueueEl.depth - 1)
          {
            functions.forEach(func => {
              let funcData = func(currQueueEl.ptr);
              if(!funcData.length)
                return;
              queue.push({ptr: funcData[0], depth: currQueueEl.depth - 1, word: currQueueEl.ptr.words[0].word});
            });
          }

        }
      });

      

      nodes.forEach(el => el._color = this.darkTheme ? '#6a6868' : '#2c3e4f');
      nodes[0]._color = this.darkTheme ? '#f5d782' : '#41ba82';
      links.forEach(el => el._color = this.darkTheme ? '#303131' : '#d0d0d0');


      this.setStyle();
      return {nodes: nodes, links: links};

    },
    abbreviationSymbols: function() {
      let map = new Map();
      map.set('@', 'Hyper');
      map.set('@i', 'iHyper');
      map.set('~', 'Hypo');
      map.set('~i', 'iHypo');
      map.set('#m', 'MH');
      map.set('#s', 'SH');
      map.set('#p', 'PH');
      map.set('%m', 'MM');
      map.set('%s', 'SM');
      map.set('%p', 'PM');
      return map;
    }
  },
  methods: {
    isLinkAlreadyPresent: function(links, sid, tid) {
      for(let link in links)
      {
        if(link.sid === sid && link.tid === tid)
          return true;
      }
      return false;
    },
    hypernyms : function(arr) {
      if(!arr || !arr.ptrs)
        return [];
      return arr.ptrs.filter(a => a.pointer_symbol.includes('@'));
    },
    hyponyms : function(arr) {
      if(!arr || !arr.ptrs)
        return [];
      return arr.ptrs.filter(a => a.pointer_symbol.includes('~'));
    },
    memberHolonym: function(arr) {
      if(!arr || !arr.ptrs)
        return [];
      return arr.ptrs.filter(a => a.pointer_symbol.includes('#m'));
    },
    substanceHolonym: function(arr) {
      if(!arr || !arr.ptrs)
        return [];
      return arr.ptrs.filter(a => a.pointer_symbol.includes('#s'));
    },
    partHolonym: function(arr) {
      if(!arr || !arr.ptrs)
        return [];
      return arr.ptrs.filter(a => a.pointer_symbol.includes('#p'));
    },
    memberMeronym: function(arr) {
      if(!arr || !arr.ptrs)
        return [];
      return arr.ptrs.filter(a => a.pointer_symbol.includes('%m'));
    },
    substanceMeronym: function(arr) {
      if(!arr || !arr.ptrs)
        return [];
      return arr.ptrs.filter(a => a.pointer_symbol.includes('%s'));
    },
    partMeronym: function(arr) {
      if(!arr || !arr.ptrs)
        return [];
      return arr.ptrs.filter(a => a.pointer_symbol.includes('%p'));
    },
    lcb (link) {
      link._svgAttrs = { 'marker-end': 'url(#m-end)',
        'marker-start': 'url(#m-start)'}
      return link
    },
    formatWord: function(word) {
      if(!word)
        return '';
      return word.replace(/_/g, " ");
    },
    getNodeId: function(arr, name) {
      for(let el of arr){
        if(el.name.toUpperCase().localeCompare(this.formatWord(name).toUpperCase()) === 0)
          return el.id;
      }
      return -1;
    },
    setStyle: function() {
      if(this.darkTheme)
      {
        let mEndEl = document.getElementById("m-end");
        if(mEndEl && mEndEl.childNodes && mEndEl.childNodes.length)
          mEndEl.childNodes[0].style.fill = "#303131"; 
        document.styleSheets.forEach(ss => {
          ss.cssRules.forEach(rule => {
            if(rule.selectorText && rule.selectorText.localeCompare('.node:hover') === 0)
              rule.style.stroke = '#f5d782';
            else if(rule.selectorText && rule.selectorText.localeCompare('.link-label, .node-label') === 0)
              rule.style.fill = '#f4eeee';
          });
        });
      }
      else
      {
        let mEndEl = document.getElementById("m-end");
        if(mEndEl && mEndEl.childNodes && mEndEl.childNodes.length)
          mEndEl.childNodes[0].style.fill = "#d0d0d0"; 
        document.styleSheets.forEach(ss => {
          ss.cssRules.forEach(rule => {
            if(rule.selectorText && rule.selectorText.localeCompare('.node:hover') === 0)
              rule.style.stroke = '#41ba82';
            else if(rule.selectorText && rule.selectorText.localeCompare('.link-label, .node-label') === 0)
              rule.style.fill = '#272d2f';
          });
        });
      }


    }
  },
  watch: {
  },
  mounted()
  {
    this.setStyle();
  }

}
</script>

<style src="vue-d3-network/dist/vue-d3-network.css"></style>

<style >
.link-label, .node-label {
  fill: #f4eeee;
}

.node:hover {
  stroke: #f5d782 ;
  stroke-width: 3px;
}

.link:hover {
  stroke: #303131;
}

.node-label {
  font-size: 1em; 
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.link-label  {
  font-size: 0.8em; 
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.link {
  stroke: #303131;
}

.node {
  stroke-width: 0;
}

#m-end path{
  fill: #303131;
}

.net-svg {
  height: 100%;
}

.graphComp {
  height: 100%;
}
</style>
