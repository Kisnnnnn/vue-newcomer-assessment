<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import AV from 'leancloud-storage';
import { mapMutations } from 'vuex';
export default {
  name: 'app',
  components: {},
  created() {
    var currentUser = AV.User.current();

    if (!currentUser) {
      this.$router.replace({
        path: '/login'
      });
    } else {
      this.setUser(currentUser);
    }
  },
  methods: {
    ...mapMutations({
      setUser: 'setUser'
    })
  }
};
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  overflow: auto;
}
*::-webkit-scrollbar {
  display: none !important;
}
</style>
