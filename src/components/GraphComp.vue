<template>
  <div>
    <!-- from https://codepen.io/emilio/pen/QOaQjP -->
    <d3-network :net-nodes="nodes" :net-links="links" :options="options" :link-cb="lcb" />
    <svg style="position: absolute; margin-top: -100px; margin-left: -100px;">
      <defs>
      <marker id="m-end" markerWidth="10" markerHeight="10" refX="6" refY="4" orient="auto" markerUnits="strokeWidth" >
      <path d="M0,2 L0,2 L0,6 L5,4 z"></path>
      </marker>
      </defs>
    </svg>

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
  },
  components: {
    D3Network,
  },
  data() {
    return {
      options:
      {
        force: 20000,
        nodeSize: 20,
        nodeLabels: true,
        linkLabels: true,
        linkWidth:5,
        strLinks: true,
      },
      reloadColors: false,
    }
  },
  computed: {
    nodes: function() {
      if(!this.data)
        return [];
      let nodes = [];
      let currId = 1;
      nodes.push({id: currId++, name: this.formatWord(this.data.keyWord)});
      this.data.data.forEach(arr => {
        nodes.push({id: currId++, name: this.formatWord(arr[0].words[0].word)})});
      nodes.forEach(el => el._color = this.darkTheme ? '#6a6868' : '#2c3e4f');

      return nodes;
    },
    links: function() {
      if(!this.data)
        return [];
      let links = [];
      this.data.data.forEach((arr, label) => {
        let tid = this.getNodeId(arr[0].words[0].word);
        if(tid === -1)
          return;
        links.push({sid: 1, tid: tid, name: label});
      });
      links.forEach(el => el._color = this.darkTheme ? '#303131' : '#d0d0d0');

      return links;
    }
  },
  methods: {
    lcb (link) {
      link._svgAttrs = { 'marker-end': 'url(#m-end)',
                       'marker-start': 'url(#m-start)'}
      return link
    },
    formatWord: function(word) {
      return word.replace(/_/g, " ");
    },
    getNodeId: function(name) {
      this.reloadColors = true;
      for(let el of this.nodes){
        if(el.name.localeCompare(this.formatWord(name)) === 0)
          return el.id;
      }
      return -1;
    },
    setStyle: function() {
      if(this.darkTheme)
      {
        document.getElementById("m-end").childNodes[0].style.fill = "#303131"; 
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
        document.getElementById("m-end").childNodes[0].style.fill = "#d0d0d0"; 
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
    reloadColors() {
      this.reloadColors = false;
      this.setStyle();
    },
    nodes() {
      this.setStyle();
    },
    links() {
      this.setStyle();
    },
    data() {
      this.setStyle();
    }
  },
  mounted()
  {
    this.setStyle();
  }
  
}
</script>

<style src="vue-d3-network/dist/vue-d3-network.css"></style>
<style>
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
}
.link-label  {
  font-size: 0.7em; 
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
</style>
