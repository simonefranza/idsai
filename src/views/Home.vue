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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  props: {
    darkTheme: { required: true },

  }
}
</script>

<style scoped lang="scss">
.introText {
  width: 33%;
  height: 60%;
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translate(0, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;
}
</style>
