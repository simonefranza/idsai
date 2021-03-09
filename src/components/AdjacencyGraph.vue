<template>
  <div class="graphComp">
    <d3-network :net-nodes="nodesAndLinks.nodes" :net-links="nodesAndLinks.links" :options="options" />
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
    matrix: { required: true },
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
        strLinks: true,
      },
    }
  },
  computed: {
    nodesAndLinks: function() {
      if(!this.matrix || !this.matrix.length)
        return {nodes: [], links: []};
      let nodes = [];
      let links = [];
      for(let i = 0; i < this.matrix.length; i++)
      {
        nodes.push({id: i + 1, name: i + 1});
      }
      for(let row = 0; row < this.matrix.length; row++)
      {
        for(let col = row + 1; col < this.matrix.length; col++)
        {
          if(this.matrix[row][col])
            links.push({sid: col + 1, tid: row + 1});
        }
      }

      nodes.forEach(el => el._color = this.darkTheme ? '#6a6868' : '#2c3e4f');
      links.forEach(el => el._color = this.darkTheme ? '#303131' : '#d0d0d0');
      this.reloadColors();

      return {nodes: nodes, links: links};
    },
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
    getNodeId: function(arr, name) {
      this.reloadColors = true;
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
    },
    reloadColors() {
      this.setStyle();
    },
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
