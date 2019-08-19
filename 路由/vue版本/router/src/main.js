// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false


const routes = {
  '/home': {
    template: '<h2>Home</h2>'
  },
  '/about': {
    template: '<h2>About</h2>'
  }
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {
    App,
   },
  template: '<App/>',
  created () {
    this.$routes = routes
    this.boundPopState = this.onPopState.bind(this)
  },
  beforeMount () {
    window.addEventListener('popstate', this.boundPopState)
  },
  beforeDestroy () {
    window.removeEventListener('popstate', this.boundPopState)
  },
  methods: {
    onPopState (...args) {
      this.$emit('popstate', ...args)
    }
  }
})
