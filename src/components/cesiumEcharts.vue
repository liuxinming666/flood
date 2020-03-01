<template>
    <div id="cesiumContainer">
        <div id="main"
             style="height: 500px;width: 500px;position: absolute;z-index: 1">
        </div>
    </div>
</template>

<script>
    import Cesium from "cesium/Source/Cesium";
    import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
    import buildModuleUrl from "cesium/Source/Core/buildModuleUrl";
    import "cesium/Source/Widgets/widgets.css";
    var echarts = require('echarts');

    var g_viewer = null;
    export default {
        name: "cesiumEcharts",
        mounted:function () {
            buildModuleUrl.setBaseUrl("../cesium/");
            this.initMap();
            this.initChart();
        },
        methods:{
            //初始化地图
            initMap:function () {
                let viewerOption = {
                    imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
                        url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=3b6e1ded5e34e4a985ce9167106c62a0",
                        layer: "tdtBasicLayer",
                        style: "default",
                        format: "image/jpeg",
                        tileMatrixSetID: "GoogleMapsCompatible",
                        maximumLevel: 18
                    }),
                    /*terrainProvider:new Cesium.CesiumTerrainProvider({
                        url:"https://lab.earthsdk.com/terrain/577fd5b0ac1f11e99dbd8fd044883638",
                        requestVertexNormals: true,
                        requestWaterMask: true
                    }),*/
                    geocoder: true,
                    baseLayerPicker: false,
                    fullscreenButton: false,
                    homeButton: false,
                    infoBox: false,
                    selectionIndicator: false,
                    timeline: false,
                    navigationHelpButton: false,
                    navigationInstructionsInitiallyVisible: false,
                    animation: false,
                    sceneMode: Cesium.SceneMode.SCENE3D//SCENE3D
                };
                g_viewer = new Cesium.Viewer('cesiumContainer', viewerOption);

                g_viewer.sceneModePicker.viewModel.duration = 0.0;

                g_viewer.scene.camera.setView({
                    // 摄像头的位置
                    destination: Cesium.Cartesian3.fromDegrees(115.9216, 39.9870, 1500.0),
                    orientation: {
                        heading: Cesium.Math.toRadians(0.0),//默认朝北0度，顺时针方向，东是90度
                        pitch: Cesium.Math.toRadians(-20),//默认朝下看-90,0为水平看，
                        roll: Cesium.Math.toRadians(0)//默认0
                    }
                });

                /*let rectangle = new Cesium.Rectangle(Cesium.Math.toRadians(113.59863),Cesium.Math.toRadians(34.738766),Cesium.Math.toRadians(113.88431),Cesium.Math.toRadians(34.89258));

                g_viewer.scene.camera.flyTo({destination: rectangle});*/

                /*g_viewer.screenSpaceEventHandler.setInputAction(
                    this.onCesiumLeftClick,
                    Cesium.ScreenSpaceEventType.LEFT_CLICK);

                g_viewer.screenSpaceEventHandler.setInputAction(
                    this.onCesiumRightClick,
                    Cesium.ScreenSpaceEventType.RIGHT_CLICK);*/

                g_viewer._cesiumWidget._creditContainer.style.display = "none";// 隐藏版权
            },
            //初始化图表
            initChart:function () {
                let myChart = echarts.init(document.getElementById('main'));

                myChart.setOption({
                    title: {
                        text: 'ECharts 入门示例',
                        textStyle:{
                            'color': '#FFFFFF'
                        }
                    },
                    tooltip: {},
                    xAxis: {
                        axisLabel:{color:'rgb(255,255,255)'},
                        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                    },
                    yAxis: {
                        axisLabel:{color:'rgb(255,255,255)'}
                    },
                    series: [{
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20]
                    }]
                });
            }
        }
    }
</script>

<style scoped>

</style>
