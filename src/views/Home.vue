<template>
  <div :class="isWideDevice ? 'home' : 'home-small'">
    <div :class="['smallNav', darkTheme ? 'dark-theme' : 'light-theme']" v-if="!isWideDevice">
      <MenuIcon  class="menuIcon" />
      <h1 >.idsai</h1>
      <div/>
    </div>
    <div :class="isWideDevice ? 'introText' : 'introText-small'">
      <span>
        <h1 id="exploreTitle">Explore <br v-if="!isWideDevice" /><span style="font-weight: bold">Data Science</span><br v-if="!isWideDevice" /> and <span style="font-weight: bold">AI</span></h1>
        <div id="separator" :class="[darkTheme ? 'separatorDark' : 'separatorLight']"/>
        <p id="titleDescr" :class="[darkTheme ? 'darkText' : 'lightText']">
        Play with important and exciting topics
        like rule based systems, graphs, information retrieval, recommender systems. <br/>
        Have fun!
        </p> 
      </span>
      <!--  <input type="checkbox" v-model="graph" />-->
    </div>
    <HomeGraph v-if="isWideDevice"/>
    <HomeNetwork v-else />
  </div>
</template>

<script>
import MenuIcon from '@/components/MenuIcon.vue'
import HomeGraph from '@/components/HomeGraph.vue'
import HomeNetwork from '@/components/HomeNetwork.vue'

export default { 
  data() {
    return {
      graph: true,
    }
  },
  computed: {
    darkTheme() {
      return this.$store.state.darkTheme;
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },
    isWideDevice() {
      return this.$store.state.isWideDevice;
    }
  },
  components: {
    MenuIcon,
    HomeGraph,
    HomeNetwork,
  },
  mounted() {
    let title = document.getElementById('exploreTitle');
    let subtitle = document.getElementById('titleDescr');
    let separator = document.getElementById('separator');
    title.style.clipPath = 'polygon(0 0, 100% 0, 100% 0, 0 0)';
    title.style.transition = "all .1s";
    title.style.opacity = 0;
    subtitle.style.clipPath = 'polygon(0 0, 100% 0, 100% 0, 0 0)';
    separator.style.clipPath = 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)';
    window.setTimeout(() => {
      title.style.transition = "";
      title.style.clipPath = '';
      window.setTimeout(() => {
        title.style.opacity = 1;
        window.setTimeout(() => {
          subtitle.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
          window.setTimeout(() => {
            separator.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
          }, 1000);
        }, 900);
      }, 700);
7   }, 700);
  }

}
</script>

<style lang="scss">
.home {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
  overflow: hidden;
  @at-root &-small {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    flex-direction: column;
    overflow: hidden;
    margin: 0;
    h1 {
      font-size: 2.1em;
    }
  }
}
.introText {
  max-width: 33vw;
  height: 60%;
  position: relative;
  top: 20%;
  right: 4%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;
  z-index: 1000;
  @at-root &-small {
    z-index: 1000;
    max-width: 15rem;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.separatorLight, .separatorDark {
  width: 100%;
  height: .1em;
  margin: 1em 0;
}
.separatorDark {
  background: $secondary-dark;
}
.separatorLight {
  background: $secondary-light;
}
.smallNav{
  font-family: 'Dancing Script', handwriting;
  padding: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  top: 0;
  width: 100%;
  height: 6em;
  background: transparent;
  z-index : 1000;
}
.menuIcon {
  position: absolute;
  z-index: 10000;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
}
.temp {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  top: 0;
  bottom: 0;
}
#exploreTitle{
  transition: opacity 1.5s ease-in;
}
#titleDescr {
  transition: clip-path 2s ease-in;
}
#separator {
  transition: clip-path 1.5s $slow-in-bezier;
}
</style>
