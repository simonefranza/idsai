<template>
  <div :id="!darkTheme ? 'lightApp' : 'darkApp'" class="bodyScrollbar" >
    <span class="mobileMenuContainer" v-if="!isWideDevice">
      <div :class="[darkTheme ? ['mobileMenuDark'] : ['mobileMenuLight']]">
        <span v-for="el in titles" :key="el.name">
          <div class="menuEl"><router-link :to="'/' +el.path">.{{el.name.toLowerCase().replace(' ', '_')}}</router-link></div><br/>
        </span>
        <span class="dark-light-switch darkModeSwitchBlock">
          <b-icon icon="sun" aria-hidden="true" class="nav-icon">  </b-icon>
          <ToggleSwitch v-model="darkTheme" />
          <b-icon icon="moon" aria-hidden="true" class="nav-icon"></b-icon>
        </span>
      </div>
    </span>
    <span id="mainBody" :class="{'slideBody' : isMenuOpen}">
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
      <transition appear
                  appear-class="slide-up-enter"
                  appear-active-class="slide-up-enter-active"
                  appear-to-class="slide-up-enter-to"
                  :name="myTransition" mode="out-in">
      <router-view class="router-view" :class="!darkTheme ? 'rv-light' : 'rv-dark'" />
      </transition>
    </div>
    <Footer :dark-theme="darkTheme" />
  </span>

  </div>
</template>

<script>
import Footer from '@/components/footer/Footer.vue'
import ToggleSwitch from '@/components/extra/ToggleSwitch.vue'
import scssData from '@/assets/scss/jsVariables.scss'


export default {
  data() {
    return {
      tempDarkTheme: true,
      lastTheme: 0,
      reload: 0,
      myTransition: 'slide-up',
      componentsName: ['Home', 'Rules', 'Graphs', 'Information Retrieval', 'Recommender System', 'About'],
      componentsPaths: ['', 'rules', 'graphs', 'info-ret', 'rec-sys', 'about'],
      initialX: null,
      initialY: null,
      lastX: null,
      lastTimestamp: null,
      touchMoveCounter: 0,
    }
  },
  computed: {
    slideToPrev() {
      return this.isWideDevice ? 'slide-left' : 'slide-up';
    },
    slideToNext() {
      return this.isWideDevice ? 'slide-right' : 'slide-down';
    },
    isWideDevice() {
      return this.$store.state.isWideDevice;
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },
    isMenuOpen() {
      return this.$store.state.isMenuOpen;
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
    // from https://stackoverflow.com/questions/53192433/how-to-detect-swipe-in-javascript
    startTouch(e) {
      if(this.isWideDevice)
        return;
      this.initialX = e.touches[0].clientX;
      this.initialY = e.touches[0].clientY;
      this.lastTimestamp = e.timeStamp;
    },
    endTouch(e) {
      if(this.isWideDevice)
        return;
      if(!this.lastX)
        return;
      let doc = document.getElementById('mainBody');
      doc.style.transform = '';
      let displacement = this.lastX - this.initialX;
      this.lastX = null;
      this.initialX = null;
      this.initialY = null;
      if(Math.abs(displacement) < this.windowWidth * 0.3)
        return;
      let speed =  displacement / (e.timeStamp - this.lastTimestamp);
      if((speed >= 1.2 && !this.isMenuOpen) || (speed <= -1.2 && this.isMenuOpen))
        this.$store.dispatch('updateMenuOpen', !this.isMenuOpen);
    },
    moveTouch(e) {
      if(this.isWideDevice)
        return;

      this.lastTimestamp = e.timeStamp;
      if (this.initialX === null) {
        return;
      }

      if (this.initialY === null) {
        return;
      }

      var currentX = e.touches[0].clientX;
      var currentY = e.touches[0].clientY;

      var diffX = this.initialX - currentX;
      var diffY = this.initialY - currentY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        // sliding horizontally
        this.lastX = currentX;
//        if (diffX > 0 && this.isMenuOpen) {
//          // swiped left
//          let doc = document.getElementById('mainBody');
//          if(Math.abs(diffX) > 200)
//          {
//          console.log("dispatch left");
//            this.$store.dispatch('updateMenuOpen', false);
//            doc.style.transform = '';
//            return;
//          }
//          doc.style.transform = `translateX(${diffX}px)`;
//        } else if(diffX < 0 && !this.isMenuOpen){
//          // swiped right
//          let doc = document.getElementById('mainBody');
//          if(Math.abs(diffX) > 200)
//          {
//            console.log("dispatch right");
//            this.$store.dispatch('updateMenuOpen', true);
//            doc.style.transform = '';
//            return;
//          }
//          doc.style.transform = `translateX(${-diffX}px)`;
//
//        }  
      } else {
        // sliding vertically
        if (diffY > 0) {
          // swiped up
          console.log("swiped up");
        } else {
          // swiped down
          console.log("swiped down");
        }  
      }

    },
    openMenu() {
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
    resized() {
      //TODO mute when developing
      this.$store.dispatch('updateOrientation', window.orientation); 
      this.$store.dispatch('updateWindowWidth', screen.width); 
      this.$store.dispatch('updateWindowHeight', screen.height); 
    },
  },
  watch: {
    darkTheme() {
      this.setStyle();
    },
  },
  created() {
    window.addEventListener("touchstart", this.startTouch, false);
    window.addEventListener("touchmove", this.moveTouch, {passive: false});
    window.addEventListener("touchend", this.endTouch, false);
    let cookies = document.cookie.split(";");
    let isDark = true;
    cookies.forEach(pair => {
      let splitty = pair.split("=");
      if(!splitty[0].localeCompare('dark_theme'))
        isDark = splitty[1].localeCompare('true') == 0;
    });
    this.$store.dispatch('updateDarkTheme', isDark);

    this.$store.dispatch('updateOrientation', window.orientation); 
//    this.$store.dispatch('updateOrientation', 0); 
    this.$store.dispatch('updateWindowWidth', screen.width); 
    this.$store.dispatch('updateWindowHeight', screen.height); 
    window.addEventListener('resize', this.resized);
    window.addEventListener('orientationchange', this.resized);

    setTimeout(() => {
      this.reload = Math.random();
      this.setStyle();
    }, 200);
    this.$router.beforeEach((to, from, next) => {
      this.myTransition = this.componentsPaths.indexOf(from.path.substring(1)) > 
        this.componentsPaths.indexOf(to.path.substring(1)) ? this.slideToNext :
        this.slideToPrev;
      next()
    });
    this.$router.afterEach(() => {
      window.setTimeout(() => this.$store.dispatch('updateMenuOpen', false), 700);
    });
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Dancing+Script');
@import url('https://fonts.googleapis.com/css?family=Nunito');


/* router desktop change animation */
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
/* router mobile change animation */
.slide-down-enter-active, .slide-down-leave-active,
.slide-up-enter-active, .slide-up-leave-active  {
  transition-duration: .5s;
  transition-property: height, opacity, transform;
}

.slide-up-enter-active, .slide-down-enter-active {
  transition-timing-function: $bounce-bezier;
}

.slide-up-leave-active, .slide-down-leave-active  {
  transition-timing-function: $slow-in-bezier;
}

.slide-up-enter, .slide-down-enter {
  opacity: 0;
}

.slide-up-enter {
  transform: translateY(100%);
}

.slide-down-enter {
  transform: translateY(-100%);
}

.slide-up-leave-to, .slide-down-leave-to{
  opacity: 0;
}

.slide-up-leave-to{
  transform: translateY(-100%);
}

.slide-down-leave-to{
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
  overflow-x: hidden;
}

#lightApp
{
  background-color: $text-primary-dark;
  color: $vue-primary;
}

#darkApp {
//  background-color: #171313;
  background-color: #090808;
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
#mainBody {
  position:absolute;
  box-shadow: -2rem 0px 6em 2em #00000061;
  top: 0;
  left: 0;
  right: 0;
  transition: transform .9s $bounce-bezier;
}

$main-body-translate: 25ch;

.slideBody {
  transform: translateX($main-body-translate);
}

.mobileMenuContainer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height:100%;
  display: flex;
  align-items: flex-start;
  justify-content: left;
  text-align: left;
}
.mobileMenuDark, .mobileMenuLight {
  max-width: $main-body-translate;
  padding: 2.7em 0.7em;
  a, a:hover {
    font-family: Nunito, sans-serif;
    padding: .5em 0;
    display: inline-block;
    font-weight: bold;
    text-decoration: none;
  }
}
.mobileMenuDark a{
  color: $text-primary-dark;
  &.router-link-exact-active {
    color: $secondary-dark;
  }
  &:hover {
    color: $secondary-dark;
  }
}
.mobileMenuLight a{
  color: $vue-primary;
  &.router-link-exact-active {
    color: $secondary-light;
  }
  &:hover {
    color: $secondary-light;
  }
}
.darkModeSwitchBlock{
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: left;
}
</style>
