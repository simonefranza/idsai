<template>
  <div v-bind:id="!darkTheme ? 'app' : 'darkApp'">
    <div id="pageContainer" v-bind:class="!darkTheme ? 'page-light' : 'page-dark'">
      <div v-bind:id="!darkTheme ? 'nav' : 'darkNav'" v-bind:class="!darkTheme ? 'light-theme' : 'dark-theme'">
        <div class="menuDiv"/>
        <div id="menu" class="menuDiv">
          <router-link to="/">Home</router-link> |
          <router-link v-bind:dark-theme="darkTheme" to="/rules">Rules</router-link> | 
          <router-link v-bind:dark-theme="darkTheme" to="/info-ret">Information Retrieval</router-link> | 
          <router-link v-bind:dark-theme="darkTheme" to="/rec-sys">Recommender System</router-link> |
          <router-link v-bind:dark-theme="darkTheme" to="/word-net">Word Net</router-link>
        </div>
        <div class="dark-light-switch menuDiv">
          <b-input-group class="inputGroup">
            <template #prepend>
            <b-icon icon="sun" aria-hidden="true" class="nav-icon">  </b-icon>
            </template>
             <b-form-checkbox v-model="darkTheme" name="check-button" class="dark-light-switch" switch >
             </b-form-checkbox>
             <template #append>
               <b-icon icon="moon" aria-hidden="true" class="nav-icon"></b-icon>
             </template>
          </b-input-group>
        </div>
      </div>
      <transition name="slide-fade" mode="out-in">
      <router-view class="router-view" v-bind:dark-theme="darkTheme" v-bind:class="!darkTheme ? 'rv-light' : 'rv-dark'" />
      </transition>
      <Footer v-bind:dark-theme="darkTheme" />
    </div>
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue'

export default {
  data() {
    return {
      tempDarkTheme: null
    }
  },
  computed: {
    darkTheme:  {
      get: function() {
        if(this.tempDarkTheme != null)
        {
          return this.tempDarkTheme;
        }
        console.log(document.cookie);
        let cookies = document.cookie.split(";");
        let map = new Map();
        cookies.forEach(pair => {
          let splitty = pair.split("=");
          map.set(splitty[0], splitty[1]);
        });
        return map.get('dark_theme') == "true";
      },
      set: function(newVal) {
        this.tempDarkTheme = newVal;
        document.cookie = "dark_theme=" + newVal;
      }
    }

  },
  components: {
    Footer
  },
}
</script>

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

#app, #darkApp {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  position: relative;
  min-height: 100vh;
}

#app
{
  background-color: #f8f1f1;
  color: #2c3e50;

}

#darkApp {
  background-color: #222;
  color: #f8f1f1;
}

#nav, #darkNav {
  padding: 30px;
  display: flex;
}

.menuDiv{
  flex: 1;
  display: flex;
  align-items: center;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#darkNav a {
  font-weight: bold;
  color: #f8f1f1;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#darkNav a.router-link-exact-active {
  color: #f5d782;
}

#pageContainer{
  padding-bottom: 2.5rem;
}

.light-theme {
  color: #2c3e50;
  background-color: #fafafa;
}
.dark-theme {
  background-color: #2f2f2f;
  color: #f8f1f1;
}

.dark-theme a.router-link-exact-active {
  color: #19456b;
}

.dark-light-switch {
  justify-content: flex-end;
}

.nav-icon {
  bottom: 0;
  top: 0;
  margin: auto;
  margin-right: 10px;
}

.router-view{
  height: 100%;
  margin: 20px;
}

.rv-light, .page-light {
  background-color: #f8f1f1;
}

.rv-dark, .page-dark {
  background-color: #222;
}


#menu {
  display: block;
}

.inputGroup {
  width: auto !important;
}


</style>
