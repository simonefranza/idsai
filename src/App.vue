<template>
  <div v-bind:id="!darkTheme ? 'app' : 'darkApp'">
    <div id="pageContainer" v-bind:class="!darkTheme ? 'page-light' : 'page-dark'">
      <div v-bind:id="!darkTheme ? 'nav' : 'darkNav'" v-bind:class="!darkTheme ? 'light-theme' : 'dark-theme'">
        <div class="menuDiv"></div>
        <div id="menu" class="menuDiv">
          <router-link :darkTheme="darkTheme" to="/">Home</router-link> |
          <router-link :dark-theme="darkTheme" to="/rules">Rules</router-link> | 
          <router-link :dark-theme="darkTheme" to="/graphs">Graphs</router-link> |
          <router-link :dark-theme="darkTheme" to="/info-ret">Information Retrieval</router-link> | 
          <router-link :dark-theme="darkTheme" to="/rec-sys">Recommender System</router-link> | 
          <router-link :dark-theme="darkTheme" to="/about">About</router-link>
        </div>
        <div class="dark-light-switch menuDiv">
          <b-icon icon="sun" aria-hidden="true" class="nav-icon">  </b-icon>
          <ToggleSwitch :darkTheme="darkTheme" v-model="darkTheme" />
          <b-icon icon="moon" aria-hidden="true" class="nav-icon"></b-icon>
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
import ToggleSwitch from '@/components/ToggleSwitch.vue'

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
    Footer,
    ToggleSwitch
  },
  methods: {
    setStyle() {
      if(this.darkTheme)
      {
        document.styleSheets.forEach(ss => {
          ss.cssRules.forEach(rule => {
            if(rule.selectorText && rule.selectorText.localeCompare('body') === 0)
              rule.style.setProperty('background','#2f2f2f', 'important');
          });
        });
      }
      else
      {
        document.styleSheets.forEach(ss => {
          ss.cssRules.forEach(rule => {
            if(rule.selectorText && rule.selectorText.localeCompare('body') === 0)
              rule.style.setProperty('background','#fafafa', 'important');
          });
        });
      }

    }
  },
  watch: {
    darkTheme() {
      this.setStyle();
    }
  },
  created() {
    this.setStyle();
  }
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
  align-items:center;
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
  margin: 10px;
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

body {
  background: #2f2f2f !important;
}


</style>
