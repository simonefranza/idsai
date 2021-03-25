import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    darkTheme : true,
    windowWidth : 0,
    isWideDevice : true,
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
    SET_IS_WIDE_DEVICE(state, isWide) {
      state.isWideDevice = isWide;
    }
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
      context.commit('SET_IS_WIDE_DEVICE', newValue > 960);
    },
  },
  modules: {
  }
})
