<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/info-ret">Information Retrieval</router-link> | 
      <router-link to="/rec-sys">Recommender System</router-link>
    </div>
    <transition name="slide-fade" mode="out-in">
    <router-view/>
    </transition>
  </div>
</template>

<style>
.slide-fade-enter-active, .slide-fade-leave-active  {
 transition-duration: 0.3s;
  transition-property: height, opacity, transform;
  overflow: hidden;
}
.slide-fade-enter
/* .slide-fade-leave-active below version 2.1.8 */ {
transform: translateY(100%);
}
.slide-fade-leave-to{
opacity: 0;
  transform: translateY(100%);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
