<template>
  <div class="adjGraph">
    <d3-network :net-nodes="nodesAndLinks.nodes" :net-links="nodesAndLinks.links" :options="options" :selection="selection"/>
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
    matrix: { required: true },
    selectedRow: { required: true},
    selectedCol: { required: true },
    nodeNames: {required: true},
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
    selection: function() {
      let sel = {links:{}, nodes:{}};
      if(this.selectedRow === -1 || this.selectedCol === -1)
        return sel;
      let from = this.selectedRow;
      let to = this.selectedCol;
      let linkObj = this.findLink(to, from);
      if(linkObj.id !== -1)
        sel.links[linkObj.id] = linkObj.link;

      sel.nodes[from] = this.nodesAndLinks.nodes[from - 1];
      sel.nodes[to] = this.nodesAndLinks.nodes[to - 1];

      return sel;
    },
    nodesAndLinks: function() {
      if(!this.matrix || !this.matrix.length)
        return {nodes: [], links: []};
      let nodes = [];
      let links = [];
      for(let i = 0; i < this.matrix.length; i++)
      {
        nodes.push({id: i + 1, name: this.nodeNames[i] ? this.nodeNames[i] : i + 1});
      }
      let linkID = 0;
      for(let row = 0; row < this.matrix.length; row++)
      {
        for(let col = row + 1; col < this.matrix.length; col++)
        {
          if(this.matrix[row][col])
            links.push({id: linkID++, sid: col + 1, tid: row + 1});
        }
      }

      nodes.forEach(el => el._color = this.darkTheme ? scssData.nodeDark : scssData.vuePrimary);
      links.forEach(el => el._color = this.darkTheme ? 
        scssData.textSecondaryDark : scssData.bgFooterLight);
      this.setStyle();

      return {nodes: nodes, links: links};
    },
  },
  methods: {
    findLink: function(from, to) {
      let links = this.nodesAndLinks.links;
      let id = -1;
      let foundLink = {};
      //TODO change if directed
      links.forEach(link => {
        if((link.sid === from && link.tid === to) || (link.sid === to && link.tid === from))
        {
          id = link.id;
          foundLink = link;
        }
      });
      return {id: id, link: foundLink};
    },
    isLinkAlreadyPresent: function(links, sid, tid) {
      for(let link in links)
      {
        if(link.sid === sid && link.tid === tid)
          return true;
      }
      return false;
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
            else if(rule.selectorText && rule.selectorText.localeCompare('.link.selected') === 0)
              rule.style.setProperty('stroke',scssData.secondaryDark, 'important');
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
            else if(rule.selectorText && rule.selectorText.localeCompare('.link.selected') === 0)
              rule.style.setProperty('stroke', scssData.secondaryLight, 'important');
            else if(rule.selectorText && rule.selectorText.localeCompare('.link-label, .node-label') === 0)
              rule.style.fill = '#272d2f';
          });
        });
      }
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

<style lang="scss">
.link-label, .node-label {
  fill: #f4eeee;
}

.node:hover {
  stroke: $secondary-dark;
  stroke-width: 3px;
}

.link:hover {
  stroke: $text-secondary-dark; 
}
.node.selected {
  stroke: $secondary-dark;
  stroke-width: 3px !important;
}
.link.selected {
  stroke: $secondary-dark !important;
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

.adjGraph{
  height: 100%;
}
</style>
