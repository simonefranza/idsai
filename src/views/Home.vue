<template>
  <div :class="isWideDevice ? 'home' : 'home-small'">
    <div :class="['smallNav', darkTheme ? 'dark-theme' : 'light-theme']" v-if="!isWideDevice">
      <MenuIcon  class="menuIcon"/>
      <h1 style="position: relative; top:50%; transform:translateY(-50%)">.idsai</h1>
    </div>
    <div :class="isWideDevice ? 'introText' : 'introText-small'">
      <span>
        <h1>Explore <br v-if="!isWideDevice" /><span style="font-weight: bold">Data Science</span><br v-if="!isWideDevice" /> and <span style="font-weight: bold">AI</span></h1>
        <div :class="darkTheme ? 'separatorDark' : 'separatorLight'"/>
        <p :class="[darkTheme ? 'darkText' : 'lightText']">
        Play with important and exciting topics
        like rule based systems, graphs, information retrieval, recommender systems. <br/>
        Have fun!
        </p> 
      </span>
      <!--  <input type="checkbox" v-model="graph" />-->
    </div>
    <HomeGraph v-if="isWideDevice"/>
    <!--    <HomeNetwork class="homeGraph" :mouseX="mouseX" :mouseY="mouseY" v-else />-->
  </div>
</template>

<script>
import MenuIcon from '@/components/MenuIcon.vue'
import HomeGraph from '@/components/HomeGraph.vue'
//import HomeNetwork from '@/components/HomeNetwork.vue'

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
//    HomeNetwork,
  },

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
    overflow: hidden;
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
    max-width: 15rem;
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
  position: absolute;
  top: 0;
  width: 100%;
  height: 6em;
  background: transparent;
}
.menuIcon {
  position: absolute;
  z-index: 10000;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
}
</style>
