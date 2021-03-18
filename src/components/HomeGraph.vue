<template>
  <div id="homeGraph">
    <div v-if="testing">
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
    </div>
    <d3-network :net-nodes="savedNodes" :net-links="[]" :options="options" :custom-forces="customForces"/>
  </div>
</template>

<script>
import D3Network from 'vue-d3-network'
export default {
  data() {
    return { 
      numNodes: 400,
      force: 200,
      nodeSizeBase: 35,
      nodeSizeVar: 70,
      hueBase: 203,
      hueVar: 15,
      saturationBase: 71,
      saturationVar: 35,
      lightnessBase: 57,
      lightnessVar: 4,
      testing: false,
      Xforce : 1,
      Yforce: 1,
      upTrend: true,
      center:[500,200], 
      collide: 50,
      savedNodes : [],
      rectX: 0,
      rectY: 0,
      firstNodeColor: 'rgba(0,0,0,0)',
      breatheInterval: null,
      mousePositionInterval: null,
      relativeMouseX: -100,
      relativeMouseY: -100,
    }
  },
  props: {
    darkTheme: {required: true},
    mouseX : {required:true},
    mouseY : {required:true},
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
//        offset: { x: 0, y: 0},
//        forces: {Center: true, X:this.Xforce, Y:this.Yforce, ManyBody: true, Link: false},
      };
      return options;
    },
    nodes() {
      return this.makeNodes();
    },
    customForces() {
      return {
        Collide: [(d) => {return !d._color.localeCompare(this.firstNodeColor) ? d._size / 2 + 1 : d._size / 2}],
      }
    }
  },
  methods: {
    makeNodes() {
      let nodes =[];
      for(let i = 0; i < this.numNodes; i++) 
      {
        if(i === 0)
        {
          nodes.push({id: i, _color: this.firstNodeColor, _size: 125, pinned:true,
            fx: this.relativeMouseX, fy: this.relativeMouseY, _cssClass: 'firstNode'});
          continue;
        }
        let size = Math.floor(this.nodeSizeBase * (Math.random() * this.nodeSizeVar * 2 / 100 + 1 - this.nodeSizeVar / 100));
        let hue = Math.floor(this.hueBase* (Math.random() * this.hueVar* 2 / 100 + 1 - this.hueVar / 100));
        let saturation = Math.floor(this.saturationBase* (Math.random() * this.saturationVar* 2 / 100 + 1 - this.saturationVar / 100));
        let lightness = Math.floor(this.lightnessBase* (Math.random() * this.lightnessVar* 2 / 100 + 1 - this.lightnessVar / 100));
        nodes.push({id: i, _color: 'hsl(' + hue + ', ' + saturation.toString() + '%, ' +
          lightness.toString() + '%)', _size: size});
      }

      this.savedNodes = [...nodes];
    },
    setStyle() {
      document.styleSheets.forEach(ss => {
        ss.cssRules.forEach(rule => {
          if(rule.selectorText && rule.selectorText.localeCompare('.node:hover') === 0)
            rule.style['stroke-width'] = 0;
        });
      });
    },
    updateMousePosition() {
      let rect = document.getElementById('homeGraph')?.getBoundingClientRect() || {x: -100, y: -100};
      this.rectX = rect.x;
      this.rectY = rect.y;
      if(this.savedNodes.length)
      {
        this.savedNodes[0].fx = this.mouseX - this.rectX;
        this.savedNodes[0].fy = this.mouseY - this.rectY;
      }
    },
  },
  created() {
    this.setStyle();
    this.makeNodes();

    let increase = .3;
    let forceMax = this.force * 1.1;
    let forceMin = this.force;
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
  watch: {
    mouseX() {
      this.updateMousePosition();
    },
    mouseY() {
      this.updateMousePosition();
    },
  },
  beforeDestroy() {
    clearInterval(this.breatheInterval);
    clearInterval(this.mousePositionInterval);
  }
  
}
</script>

<style lang="scss">
.link {
  stroke: $text-secondary-dark;
}
.net-svg, .net {
  overflow: visible;
}
.node:hover {
  stroke-width: 0px;
}
.node {
  stroke: rgba($vue-primary,.2);
  stroke-width: 2px;
}
.firstNode {
  stroke-width: 0;
}
</style>
