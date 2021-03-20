<template>
  <div :id="!darkTheme ? 'lightApp' : 'darkApp'" class="bodyScrollbar" >
    <div id="pageContainer" :class="[!darkTheme ? 'page-light' : 'page-dark']">
      <div :id="!darkTheme ? 'lightNav' : 'darkNav'" :class="[!darkTheme ? 'light-theme' : 'dark-theme', 'navBar']">

        <div class="menuDiv" :key="reload"></div>
        <div id="menu" class="menuDiv">
          <div class="menuEl"><router-link to="/">Home</router-link></div> |
          <div class="menuEl"><router-link to="/rules">Rules</router-link></div> | 
          <div class="menuEl"><router-link to="/graphs">Graphs</router-link></div> |
          <div class="menuEl"><router-link to="/info-ret">Information Retrieval</router-link></div> | 
          <div class="menuEl"><router-link to="/rec-sys">Recommender System</router-link></div> | 
          <div class="menuEl"><router-link to="/about">About</router-link></div>
        </div>
        <div class="dark-light-switch menuDiv" >
          <b-icon icon="sun" aria-hidden="true" class="nav-icon">  </b-icon>
          <ToggleSwitch :darkTheme="darkTheme" v-model="darkTheme" />
          <b-icon icon="moon" aria-hidden="true" class="nav-icon"></b-icon>
        </div>
      </div>
      <transition name="slide-fade" mode="out-in">
      <router-view class="router-view" :dark-theme="darkTheme" :class="!darkTheme ? 'rv-light' : 'rv-dark'" />
      </transition>
      <Footer :dark-theme="darkTheme" />
    </div>
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import scssData from '@/assets/scss/jsVariables.scss'

export default {
  data() {
    return {
      tempDarkTheme: null,
      lastTheme: 0,
      reload: 0,
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
        var date = new Date();
        date.setTime(date.getTime()+(30*24*60*60*1000));
        let expire = '; expires=' + date.toGMTString();
        let secure = window.location.href.includes('localhost') || window.location.href.includes('127.0.0.1') ? '' : "; Secure";

        document.cookie = "dark_theme=" + newVal + expire + secure;
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
              rule.style.setProperty('background', scssData.bgBodyDark, 'important');
            else if(rule.selectorText && rule.selectorText.includes('::-webkit-scrollbar-track:hover'))
              rule.style.setProperty('background', scssData.nodeDark);
            else if(rule.selectorText && rule.selectorText.includes('::-webkit-scrollbar-thumb'))
              rule.style.setProperty('background', scssData.secondaryDark);

          });
        });
      }
      else
      {
        document.styleSheets.forEach(ss => {
          ss.cssRules.forEach(rule => {
            if(rule.selectorText && rule.selectorText.localeCompare('body') === 0)
              rule.style.setProperty('background', scssData.bgBodyLight, 'important');
            else if(rule.selectorText && rule.selectorText.includes('::-webkit-scrollbar-track:hover'))
              rule.style.setProperty('background', '#bababa');
            else if(rule.selectorText && rule.selectorText.includes('::-webkit-scrollbar-thumb'))
              rule.style.setProperty('background', scssData.vuePrimary);
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
  mounted() {
    setTimeout(() => {
      this.reload = Math.random();
      this.setStyle();
    }, 200);
  },
}
</script>

<style lang="scss">
/* router change animation */
.slide-fade-enter-active, .slide-fade-leave-active  {
  transition-duration: 0.3s;
  transition-property: height, opacity, transform;
  overflow: hidden;
}

.slide-fade-enter {
  transform: translateY(100%);
}

.slide-fade-leave-to{
  opacity: 0;
  transform: translateY(100%);
}
/* end */

#lightApp, #darkApp {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  position: relative;
  min-height: 100vh;
  overflow-y: auto;
}

#lightApp
{
  background-color: $text-primary-dark;
  color: $vue-primary;
}

#darkApp {
  background-color: #222;
  color: $text-primary-dark;
}

.menuDiv{
  flex: 1;
  display: flex;
  align-items: center;
}

.menuEl {
  display: inline;
  position: relative;
  margin-inline: .5em;
}

#lightNav, #darkNav {
  padding: 30px;
  display: flex;
  align-items:center;
  a {
    font-weight: bold;
    text-decoration: none;
  }
}

#lightNav a {
  color: $vue-primary;
  @include mx-link($color : $vue-primary);

  &.router-link-exact-active {
    color: $secondary-light;
    @include mx-link($color : $secondary-light);
  }
}

#darkNav a {
  color: $text-primary-dark;
  @include mx-link($color : $text-primary-dark);

  &.router-link-exact-active {
    color: $secondary-dark;
    @include mx-link($color : $secondary-dark);
  }
}

#pageContainer{
  padding-bottom: 2.5rem;
}

.light-theme {
  color: $vue-primary;
  background-color: $bg-body-light;
}

.dark-theme {
  color: $text-primary-dark;
  background-color: $bg-body-dark;
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
  background-color: $text-primary-dark;
}

.rv-dark, .page-dark {
  background-color: #222;
}

#menu {
  display: block;
  min-width: 50vw;
}

.inputGroup {
  width: auto !important;
}

body {
  background: $bg-body-dark !important;
}

.navBar {
  position: relative;
  z-index: 1000;
}
</style>
