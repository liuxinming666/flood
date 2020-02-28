<template>
  <div id="app">
    <CesiumMap v-if="bShow"></CesiumMap>
    <ThreeDim v-if="!bShow"></ThreeDim>
    <!--<three-dim v-if="!bShow"></three-dim>-->
      </div>
</template>

<script>
import CesiumMap from "./components/CesiumMap.vue"
import ThreeDim from "./components/threeDim";
import DynaSpread from "./components/dynaSpread";
export default {
    name: 'App',
    components : {
        DynaSpread,
        ThreeDim,
      'CesiumMap' : CesiumMap
    },
    data(){
        return {
            bShow:false
        }
    },
}
</script>

<style>
html, body {
 width: 100%;
 height: 100%;
 margin: 0;
 padding: 0;
 overflow: hidden;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
