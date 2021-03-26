<template>
  <div class="homeNetwork">
<!--    {{force}}
    <input type="range" min="1" max="500" v-model="force" class="slider" id="myRange"><br/>
    hue Base {{hueBase}}
    <input type="range" min="0" max="360" v-model="hueBase" class="slider" id="myRange"><br/>
    {{hueVar}}
    <input type="range" min="0" max="100" v-model="hueVar" class="slider" id="myRange"><br/>
    Sat {{saturationBase}}
    <input type="range" min="0" max="100" v-model="saturationBase" class="slider" id="myRange"><br/>
    {{saturationVar}}
    <input type="range" min="0" max="100" v-model="saturationVar" class="slider" id="myRange"><br/>
    light {{lightnessBase}}
    <input type="range" min="1" max="100" v-model="lightnessBase" class="slider" id="myRange"><br/>
    {{lightnessVar}}
    <input type="range" min="1" max="100" v-model="lightnessVar" class="slider" id="myRange"><br/>-->
    <d3-network :net-nodes="nodes" :net-links="links" :options="options" />
  </div>
</template>

<script>
import D3Network from 'vue-d3-network'
export default {
  data() {
    return { 
      numNodes: 150,
      force: 5000,
      nodeSizeBase: 45,
      nodeSizeVar: 30,
      hueBase: 260,
      hueVar: 26,
      saturationBase: 71,
      saturationVar: 50,
      lightnessBase: 64,
      lightnessVar: 20,
      breatheInterval: null,
    }
  },
  components: {
    D3Network,
  },
  computed: {
    darkTheme() {
      return this.$store.state.darkTheme;
    },
    options() {
      let options = {
        force: this.force,
        nodeSize: 20,
        nodeLabels: false,
        linkLabels: false,
        linkWidth:5,
        strLinks: true,
        offset: { x: 0, y: 0},
      };
      return options;
    },
    nodes() {
      return this.makeNodes();
    },
    links() {
      this.nodes;
      return this.makeLinks();
    }
  },
  methods: {
    makeNodes() {
      let nodes=[];
      for(let i = 0; i < this.numNodes; i++) 
      {
        let size = Math.floor(this.nodeSizeBase * (Math.random() * this.nodeSizeVar * 2 / 100 + 1 - this.nodeSizeVar / 100));
        nodes.push({id: i, _color: this.darkTheme ? '#0f0f0f' : '#e5e5e5', _size: size});
      }
      return nodes;
    },
    makeLinks() {
      let links = [];
      for(let i = 0; i < Math.floor(1.2 * this.numNodes); i++) 
      {
        links.push({sid: Math.floor(Math.random() * this.numNodes), tid: Math.floor(Math.random() * this.numNodes)});
      }
      return links;
    },
    setStyle() {
      document.styleSheets.forEach(ss => {
        ss.cssRules.forEach(rule => {
          rule;
          if(rule.selectorText && rule.selectorText.localeCompare('.node:hover') === 0)
            rule.style['stroke-width'] = 0;
          else if(rule.selectorText && rule.selectorText.localeCompare('.node') === 0)
            rule.style['stroke-width'] = 0;
          else if(rule.selectorText && rule.selectorText.localeCompare('.link') === 0)
            rule.style['stroke'] = this.darkTheme ? '#0f0f0f' : '#e5e5e5';
        });
      });
    }
  },
  watch: {
    darkTheme() {
      this.setStyle();
    },
  },
  created() {
    this.setStyle();
    let forceMax = this.force * 1.1;
    let forceMin = this.force;
    let increase = 0.01;
    this.breatheInterval = window.setInterval( () => {
      if(this.upTrend && this.force < forceMax)
        this.force += increase;
      else if(this.upTrend && this.force > forceMax)
      {
        this.upTrend = false;
        this.force -= increase;
      }
      else if(!this.upTrend && this.force > forceMin)
        this.force -= increase;
      else {
        this.upTrend = true;
        this.force+= increase; 
      }
    }, 20);
  },
  beforeDestroy() {
    clearInterval(this.breatheInterval);
  }
}
</script>

<style scoped src="vue-d3-network/dist/vue-d3-network.css"></style>
<style lang="scss">
.link{
  stroke: #0f0f0f;
}
.node {
  stroke-width: 0px;
  &:hover {
    stroke-width: 0px;
  }
}
.homeNetwork {
  position:absolute;
  height: 100%;
  width: 100%;
  z-index : 0;
  overflow: hidden;
}
</style>
