<template>
  <div id="graphComp">
    <!-- from https://codepen.io/emilio/pen/QOaQjP -->
    <d3-network :selection="selection" :net-nodes="nodesAndLinks.nodes" :net-links="nodesAndLinks.links" :options="options" />
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
import scssData from '@/assets/scss/jsVariables.scss'
export default {
  props: {
    darkTheme: {
      type: Boolean,
      required: true
    },
    data : { required: true },
    ptrSymbols: {required: true},
    depth: {required: true},
    value : {required: true}
  },
  components: {
    D3Network,
  },
  data() {
    return {
      lastY: 0,
    }
  },
  computed: {
    options: function() {
      let options = {
        force: 5000,
        nodeSize: 20,
        nodeLabels: true,
        linkLabels: true,
        linkWidth:5,
        strLinks: false,
        offset: { x: 0, y: this.lastY},
      };
      return options;
    },
    selection() {
      let sel = {links: {}, nodes: {}};
      if(!this.value)
        return sel;

      let id = this.getNodeId(this.nodesAndLinks.nodes, this.formatWord(this.value));
      if(id === -1)
        return sel;

      sel.nodes[id] = this.nodesAndLinks.nodes[id-1];
      return sel;
    },
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
        nodes.forEach(el => el._color = this.darkTheme ? scssData.secondaryDark : scssData.secondaryLight);
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
        let now = performance.now();
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

          if(performance.now() - now > 150)
            setTimeout(now = performance.now(), 1);
        }
      });

      nodes.forEach(el => el._color = this.darkTheme ? scssData.nodeDark : 
        scssData.vuePrimary);
      nodes[0]._color = this.darkTheme ? scssData.secondaryDark : 
        scssData.secondaryLight;
      links.forEach(el => el._color = this.darkTheme ? 
        scssData.textSecondaryDark : scssData.bgFooterLight);

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
    onScroll(e) {
      let scrollPos = e?.srcElement?.scrollingElement?.scrollTop || 0;
      let precision = 100;
      if(!(this.lastY < scrollPos + precision && this.lastY >= scrollPos - precision))
        this.lastY = scrollPos;
//      let str = 'translateY(' + (e?.srcElement?.scrollingElement?.scrollTop || 0) + 'px)';
//      document.getElementById('graphComp').style.transform = str;
    },
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
          mEndEl.childNodes[0].style.fill = scssData.textSecondaryDark; 
        document.styleSheets.forEach(ss => {
          ss.cssRules.forEach(rule => {
            if(rule.selectorText && rule.selectorText.localeCompare('.node:hover') === 0)
            {
              rule.style.stroke = scssData.secondaryDark;
              rule.style['stroke-width'] = '3px';
            }
            else if(rule.selectorText && rule.selectorText.localeCompare('.node.selected') === 0)
              rule.style.stroke = scssData.secondaryDark;
            else if(rule.selectorText && rule.selectorText.localeCompare('.link-label, .node-label') === 0)
              rule.style.fill = '#f4eeee';

          });
        });
      }
      else
      {
        let mEndEl = document.getElementById("m-end");
        if(mEndEl && mEndEl.childNodes && mEndEl.childNodes.length)
          mEndEl.childNodes[0].style.fill = scssData.bgFooterLight; 
        document.styleSheets.forEach(ss => {
          ss.cssRules.forEach(rule => {
            if(rule.selectorText && rule.selectorText.localeCompare('.node:hover') === 0)
            {
              rule.style.stroke = scssData.secondaryLight;
              rule.style['stroke-width'] = '3px';
            }
            else if(rule.selectorText && rule.selectorText.localeCompare('.node.selected') === 0)
              rule.style.stroke = scssData.secondaryLight;
            else if(rule.selectorText && rule.selectorText.localeCompare('.link-label, .node-label') === 0)
              rule.style.fill = '#272d2f';
          });
        });
      }


    },
  },
  watch: {
    value() {
    }
  },
  mounted()
  {
    window.addEventListener("scroll", this.onScroll);
    this.setStyle();
  }

}
</script>

<style src="vue-d3-network/dist/vue-d3-network.css"></style>

<style lang="scss">
.link-label, .node-label {
  fill: #f4eeee;
}

.node:hover {
  stroke: $secondary-dark;
  stroke-width: 3px;
}
.node.selected {
  stroke: $secondary-dark;
  stroke-width: 3px !important;
}

.link:hover {
  stroke: $text-secondary-dark;
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
  stroke: $text-secondary-dark;
}

.node {
  stroke-width: 0;
}

#m-end path{
  fill: $text-secondary-dark;
}

.net-svg {
  height: 100%;
}

#graphComp {
  height: 100%;
  transition: all .5s;
  transition-timing-function: ease-out;
}
</style>
