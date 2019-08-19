<template>
  <div class="hello">
    <h1>hash</h1>
   <div>
      <ul>
        <li><router-link to="/home">home</router-link></li>
        <li><router-link to="/about">about</router-link></li>
      </ul>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import RouterLink from '@/components/hash/router-link'
import RouterView from '@/components/hash/router-view'


export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components:{
RouterLink, RouterView
  },
  computed: {
    
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
