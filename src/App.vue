<template>
  <div :id="!darkTheme ? 'lightApp' : 'darkApp'" class="bodyScrollbar" >
    <div id="pageContainer" :class="[!darkTheme ? 'page-light' : 'page-dark']">
      <div :id="!darkTheme ? 'lightNav' : 'darkNav'" :class="[!darkTheme ? 'light-theme' : 'dark-theme', 'navBar']" v-if="isWideDevice">

        <div class="menuDiv" :key="reload"></div>

        <div id="menu" class="menuDiv">
          <span v-for="(el, index) in titles" :key="el.name">
            <span v-if="index !== 0"> | </span><div class="menuEl"><router-link :to="'/' +el.path">{{el.name}}</router-link></div>
          </span>
        </div>

        <div class="dark-light-switch menuDiv" >
          <b-icon icon="sun" aria-hidden="true" class="nav-icon">  </b-icon>
          <ToggleSwitch v-model="darkTheme" />
          <b-icon icon="moon" aria-hidden="true" class="nav-icon"></b-icon>
        </div>

      </div>
      <transition :name="myTransition" mode="out-in">
      <router-view class="router-view" @clicked="openMenu" :class="!darkTheme ? 'rv-light' : 'rv-dark'" />
      </transition>
    </div>
    <Footer :dark-theme="darkTheme" />
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import scssData from '@/assets/scss/jsVariables.scss'

export default {
  data() {
    return {
      tempDarkTheme: true,
      lastTheme: 0,
      reload: 0,
      slideLeft : 'slide-left',
      slideRight : 'slide-right',
      myTransition: 'slide-right',
      componentsName: ['Home', 'Rules', 'Graphs', 'Information Retrieval', 'Recommender System', 'About'],
      componentsPaths: ['', 'rules', 'graphs', 'info-ret', 'rec-sys', 'about'],
    }
  },
  computed: {
    isWideDevice() {
      return this.$store.state.isWideDevice;
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },
    titles() {
      let titles = [];
      this.componentsName.forEach((name, index) => {
        titles.push({name: name, path: this.componentsPaths[index]});
      });
      return titles;
    },
    darkTheme:  {
      get: function() {
        return this.$store.state.darkTheme;
      },
      set: function(newVal) {
        this.$store.dispatch('updateDarkTheme', newVal);
      }
    }

  },
  components: {
    Footer,
    ToggleSwitch,
  },
  methods: {
    openMenu() {
      console.log("menu");
    },
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

    },
    resized(e) {
      this.$store.dispatch('updateWindowWidth', e.currentTarget.outerWidth); 
    },
  },
  watch: {
    darkTheme() {
      this.setStyle();
    },
  },
  mounted() {
    let cookies = document.cookie.split(";");
    let isDark = true;
    cookies.forEach(pair => {
      let splitty = pair.split("=");
      if(!splitty[0].localeCompare('dark_theme'))
        isDark = splitty[1].localeCompare('true') == 0;
    });
    this.$store.dispatch('updateDarkTheme', isDark);

    this.$store.dispatch('updateWindowWidth', window.outerWidth); 
    window.addEventListener('resize', this.resized);

    setTimeout(() => {
      this.reload = Math.random();
      this.setStyle();
    }, 200);
    this.$router.beforeEach((to, from, next) => {
      this.myTransition = this.componentsPaths.indexOf(from.path.substring(1)) > 
        this.componentsPaths.indexOf(to.path.substring(1)) ? this.slideRight :
        this.slideLeft;
      next()
    });
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Dancing+Script');


/* router change animation */
.slide-right-enter-active, .slide-right-leave-active,
.slide-left-enter-active, .slide-left-leave-active  {
  transition-duration: .5s;
  transition-property: height, opacity, transform;
}

.slide-left-enter-active, .slide-right-enter-active {
  transition-timing-function: $bounce-bezier;
}

.slide-left-leave-active, .slide-right-leave-active  {
  transition-timing-function: $slow-in-bezier;
}

.slide-left-enter, .slide-right-enter {
  opacity: 0;
}

.slide-left-enter {
  transform: translateX(100%);
}

.slide-right-enter {
  transform: translateX(-100%);
}

.slide-left-leave-to, .slide-right-leave-to{
  opacity: 0;
}

.slide-left-leave-to{
  transform: translateX(-100%);
}

.slide-right-leave-to{
  transform: translateX(100%);
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
  overflow-x: hidden;
}

#lightApp
{
  background-color: $text-primary-dark;
  color: $vue-primary;
}

#darkApp {
  background-color: #171313;
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
  padding: 1.9em 0.7em;
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
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 2.5rem;
  min-height:100vh;
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
  background-color: #171313;
}

#menu {
  display: block;
  min-width: 50vw;
  flex-grow: 10;
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
