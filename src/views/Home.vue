<template>
  <div class="home">
    <div class="introText">
      <span>
        <h1>Explore <span style="font-weight: bold">Data Science</span> and <span style="font-weight: bold">AI</span></h1>
        <p :class="[darkTheme ? 'darkText' : 'lightText']">
        Here you can play with important and exciting topics
        like rule based systems, graphs, information retrieval, recommender systems. <br/>
        Have fun!<br/><br/>
        This project is hosted with ❤️on 
        <a href="https://github.com/simonefranza/idsai/">Github</a>, so if you have an idea
        for a new feature or if you find a bug, feel free to open a new 
        <a href="https://github.com/simonefranza/idsai/issues">issue</a>!
        </p> 
      </span>
      <!--  <input type="checkbox" v-model="graph" />-->
    </div>
    <HomeGraph class="homeGraph" :darkTheme="darkTheme" v-if="graph"/>
    <!--    <HomeNetwork class="homeGraph" :mouseX="mouseX" :mouseY="mouseY" :darkTheme="darkTheme" v-else />-->
  </div>
</template>

<script>
import HomeGraph from '@/components/HomeGraph.vue'
//import HomeNetwork from '@/components/HomeNetwork.vue'

export default { 
  data() {
    return {
      graph: true,
    }
  },
  props: {
    darkTheme: { required: true },
  },
  components: {
    HomeGraph,
//    HomeNetwork,
  },

}
</script>

<style lang="scss">
.introText {
  width: 33%;
  height: 60%;
  position: absolute;
  top: 67%;
  left: 10%;
  transform: translate(0, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;
  z-index: 1000;
}

.homeGraph {
  position: fixed;
  right: 13em;
  z-index: 10;
  top: 15em;
}
</style>
