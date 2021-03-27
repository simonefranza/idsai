import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    darkTheme : true,
    windowWidth : 0,
    windowHeight : 0,
    screenWidth : 0,
    screenHeight : 0,
    isRotated: 0,
    isWideDevice : true,
    isWiderThanHigher : true,
    isMenuOpen: false,
  },
  mutations: {
    SET_DARK_THEME(state, theme) {
      state.darkTheme = theme;
      var date = new Date();
      date.setTime(date.getTime()+(30*24*60*60*1000));
      let expire = '; expires=' + date.toGMTString();
      let secure = window.location.href.includes('localhost') || window.location.href.includes('127.0.0.1') ? '' : "; Secure";
      document.cookie = "dark_theme=" + theme + expire + secure;
    },
    SET_WINDOW_WIDTH(state, width) {
      state.windowWidth = width;
    },
    SET_WINDOW_HEIGHT(state, height) {
      state.windowHeight = height;
    },
    SET_IS_ROTATED(state, rotated) {
      state.isRotated = rotated;
    },
    SET_IS_WIDE_DEVICE(state, isWide) {
      state.isWideDevice = isWide;
    },
    SET_IS_WIDER_THAN_HIGHER(state, isWiderThanHigher) {
      state.isWiderThanHigher = isWiderThanHigher;
    },
    SET_MENU_OPEN(state, isOpen) {
      state.isMenuOpen = isOpen;
    },
  },
  actions: {
    updateDarkTheme(context, newValue) {
      if(typeof(newValue) !== 'boolean')
        return;
      context.commit('SET_DARK_THEME', newValue);
    },
    updateWindowWidth(context, newValue) {
      if(typeof(newValue) !== 'number')
        return;

      context.commit('SET_WINDOW_WIDTH', newValue);
      if(context.state.isRotated)
      {
        context.commit('SET_IS_WIDER_THAN_HIGHER', newValue < context.state.windowHeight);
      }
      else {
        context.commit('SET_IS_WIDE_DEVICE', newValue > 960);
        context.commit('SET_IS_WIDER_THAN_HIGHER', newValue > context.state.windowHeight);
      }
    },
    updateWindowHeight(context, newValue) {
      if(typeof(newValue) !== 'number')
        return;
      context.commit('SET_WINDOW_HEIGHT', newValue);
      if(context.state.isRotated)
      {
        context.commit('SET_IS_WIDE_DEVICE', newValue > 960);
        context.commit('SET_IS_WIDER_THAN_HIGHER', context.state.windowWidth < newValue);
      }
      else {
        context.commit('SET_IS_WIDER_THAN_HIGHER', context.state.windowWidth > newValue);
      }
    },
    updateOrientation(context, newValue) {
      if(typeof(newValue) !== 'number' || newValue === context.state.orientation)
        return;
      let isRotate = Math.cos(newValue * 2 * Math.PI / 360) < 0.0001;
      context.commit('SET_IS_ROTATED', isRotate);
      if(isRotate)
        context.commit('SET_IS_WIDER_THAN_HIGHER', context.state.windowWidth < context.state.windowHeight);
      else
        context.commit('SET_IS_WIDER_THAN_HIGHER', context.state.windowWidth > context.state.windowHeight);
    },
    updateMenuOpen(context, newValue) {
      if(typeof(newValue) !== 'boolean')
        return;
      context.commit('SET_MENU_OPEN', newValue);
    }
  },
  modules: {
  }
})
