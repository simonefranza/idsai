<template>
  <div id="legendBlock" :class="['legendContainer', !showLegend ? 'hiddenCard' : '']" >
    <div>
      <div class="legendTip" 
           @click="showLegend = !showLegend"
           :class="[darkTheme ? 'darkTip' : 'lightTip']">
        <b-icon icon="arrow-right-circle" :class="[showLegend ? 'pointLeft' : '', darkTheme ? 'iconDark' : 'iconLight', 'iconEnabled']"/>
      </div>
    <b-card title="WordNet Legend" 
            :bg-variant="darkTheme ? 'dark' : 'light'" 
            :text-variant="darkTheme ? 'white' : ''"
            :class="['legendCard', darkTheme ? 'legendCardBorderDark' : 'legendCardBorderLight']"
            @click="closeLegendMessage(false)"
            >
            <b-card-body>
              <b-card-text :class="[darkTheme ? 'darkText' : 'lightText', 'legend']">
                <span v-for="el in ptrLegend" :key="el.symbol">
                  <b>{{el.symbol}}</b> = {{el.meaning}} ({{el.definition}})<br/>
                </span><br/>
                <p>To get more accurate definitions of these terms and many others visit 
                <a href="https://globalwordnet.github.io/gwadoc/">this page</a>.</p>
              </b-card-text>
            </b-card-body>
    </b-card>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    darkTheme: {required: true,
      type: Boolean,
    },
    value : { required: true} 
  },
  data() {
    return {
      showLegend: false,
    }

  },
  computed: {
    ptrLegend() {
      let arr = [];
      arr.push({symbol: 'Hyper',  meaning: 'Hypernym',          definition: 'a word that is more general than a given word'});
      arr.push({symbol: 'iHyper', meaning: 'Instance Hypernym', definition: 'the type of an instance'});
      arr.push({symbol: 'Hypo',   meaning: 'Hyponym',           definition: 'a word that is more specific than a given word'});
      arr.push({symbol: 'iHypo',  meaning: 'Instance Hyponym',  definition: 'an occurrence of something'});
      arr.push({symbol: 'MH',     meaning: 'Member Holonym',    definition: 'concept B is a member of concept A'});
      arr.push({symbol: 'SH',     meaning: 'Substance Holonym', definition: 'concept-B is a substance of concept-A'});
      arr.push({symbol: 'PH',     meaning: 'Part Holonym',      definition: 'concept B is the whole where concept A is a part'});
      arr.push({symbol: 'MM',     meaning: 'Member Meronym',    definition: 'concept A is a member of concept B'});
      arr.push({symbol: 'SM',     meaning: 'Substance Meronym', definition: 'concept A is made of concept B'});
      arr.push({symbol: 'PM',     meaning: 'Part Meronym',      definition: 'concept A is a component of concept B'});
      return arr;
    }
  },
  methods: {
    closeLegendMessage(isParent)
    {
      this.$emit('closeLegend', isParent);
    }
  },
  model: {
    event: 'hideLegend'
  },
  watch: {
    value() {
      this.showLegend = this.value;
    },
    showLegend() {
      this.$emit('hideLegend', this.showLegend);
    }
  },

  
}
</script>

<style scoped lang="scss">
.legendContainer {
  transition: .7s $slow-in-bezier;
  position: fixed;
  z-index: 2000;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 50%;
  transform: translate(0,-50%);
}

.legendContainer.hiddenCard {
  transform: translate(-100%,-50%);
}

.legendCard {
  position:relative;
  max-width: 45rem;
  z-index: 2500;
  transition: opacity 2s;
  border-top-right-radius: 0;
}

.legendCardBorderDark{
  border : 1px solid rgba($text-primary-dark, 0.125);
}
.legendCardBorderLight{
  border : 1px solid rgba(#000, 0.125);
}

.legend, .legendSubtitle{
  text-align: left;
}

.legendCard p {
  line-height: 1.6em;
}

$tip-size: 2em;

.legendTip {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: $tip-size;
  width: $tip-size;
  z-index: 5000;
  right: -99.85%;
  top: $tip-size;
}

.darkTip, .lightTip {
  border-radius: 0 50% 50% 0;
}
.darkTip {
  background: $bootstrap-card-dark;
  border-right: 1px solid rgba($text-primary-dark, 0.125);
  border-top: 1px solid rgba($text-primary-dark, 0.125);
  border-bottom: 1px solid rgba($text-primary-dark, 0.125);
}
.lightTip {
  background: $bootstrap-card-light;
  border-right: 1px solid rgba(#000, 0.125);
  border-top: 1px solid rgba(#000, 0.125);
  border-bottom: 1px solid rgba(#000, 0.125);
}

.pointLeft {
  transform: rotate(-180deg);
}

.legendTip > svg {
transition: 1s;
}
</style>
