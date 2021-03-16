<template>
  <div>
    {{force}}
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
    <input type="range" min="1" max="100" v-model="lightnessVar" class="slider" id="myRange"><br/>
    <d3-network :net-nodes="nodes" :net-links="links" :options="options" />
  </div>
</template>

<script>
import D3Network from 'vue-d3-network'
export default {
  data() {
    return { 
      numNodes: 150,
      force: 5700,
      nodeSizeBase: 45,
      nodeSizeVar: 30,
      hueBase: 260,
      hueVar: 26,
      saturationBase: 71,
      saturationVar: 50,
      lightnessBase: 64,
      lightnessVar: 20,
    }
  },
  components: {
    D3Network,
  },
  computed: {
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
        if(i === 0)
        {
          nodes.push({id: i, _color: 'red', _size:500, pinned: true, fx: 200, fy:500});

          continue;
        }
        let size = Math.floor(this.nodeSizeBase * (Math.random() * this.nodeSizeVar * 2 / 100 + 1 - this.nodeSizeVar / 100));
        let hue = Math.floor(this.hueBase* (Math.random() * this.hueVar* 2 / 100 + 1 - this.hueVar / 100));
        let saturation = Math.floor(this.saturationBase* (Math.random() * this.saturationVar* 2 / 100 + 1 - this.saturationVar / 100));
        let lightness = Math.floor(this.lightnessBase* (Math.random() * this.lightnessVar* 2 / 100 + 1 - this.lightnessVar / 100));
        if(i < 10)
          console.log(size);
        nodes.push({id: i, _color: 'hsl(' + hue + ', ' + saturation.toString() + '%, ' +
          lightness.toString() + '%)', _size: size});
      }
      return nodes;
    },
    makeLinks() {
      let links = [];
      for(let i = 0; i < this.numNodes; i++) 
      {
        links.push({sid: Math.floor(Math.random() * this.numNodes), tid: Math.floor(Math.random() * this.numNodes)});
      }
      return links;
    }
  }
  
}
</script>

<style src="vue-d3-network/dist/vue-d3-network.css"></style>
<style lang="scss">
.link {
  stroke: $text-secondary-dark;
}
</style>
