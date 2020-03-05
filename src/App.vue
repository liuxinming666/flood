<template>
  <div id="app">
    <CesiumMap v-if="bShow"></CesiumMap>
    <!--<cesium-mesh-visual></cesium-mesh-visual>-->
    <cesium-echarts></cesium-echarts>
    <!--<dyna-spread v-if="!bShow"></dyna-spread>-->
    <!--<weather-sim v-if="!bShow"></weather-sim>-->
    <!--<ThreeDim v-if="!bShow"></ThreeDim>-->
    <!--<three-dim v-if="!bShow"></three-dim>-->
      </div>
</template>

<script>
import CesiumMap from "./components/CesiumMap.vue"
import ThreeDim from "./components/threeDim";
import DynaSpread from "./components/dynaSpread";
import WeatherSim from "./components/weatherSim";
import CesiumEcharts from "./components/cesiumEcharts";
import CesiumMeshVisual from "./components/cesiumMeshVisual";
export default {
    name: 'App',
    components : {
        CesiumMeshVisual,
        CesiumEcharts,
        WeatherSim,
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
