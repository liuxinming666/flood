<template>
    <div id="cesiumContainer">
        <!--<div id="main"
             style="height: 300px;width: 500px;position: absolute;z-index: 1">
        </div>-->
        <div ref="chart" style="height: 300px;width: 500px;position: absolute;z-index: 1"
             class="highcharts-container">
        </div>
    </div>
</template>

<script>
    import Cesium from "cesium/Source/Cesium";
    import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
    import buildModuleUrl from "cesium/Source/Core/buildModuleUrl";
    import "cesium/Source/Widgets/widgets.css";

    import Highcharts from 'highcharts/highstock';
    import HighchartsMore from 'highcharts/highcharts-more';
    import HighchartsDrilldown from 'highcharts/modules/drilldown';
    import Highcharts3D from 'highcharts/highcharts-3d';
    import Highmaps from 'highcharts/modules/map';

    HighchartsMore(Highcharts)
    HighchartsDrilldown(Highcharts);
    Highcharts3D(Highcharts);
    Highmaps(Highcharts);

    var echarts = require('echarts');

    var g_viewer = null;
    export default {
        name: "cesiumEcharts",
        mounted:function () {
            buildModuleUrl.setBaseUrl("../cesium/");
            this.initMap();
            this.initHightChart();
            //this.initChart();
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
            },
            //初始化hightChart图表
            initHightChart:function () {
                let options = {
                    chart:{
                        backgroundColor: 'rgba(0,0,0,0)'
                    },
                    title: {
                        text: '2010 ~ 2016 年太阳能行业就业人员发展情况'
                    },
                    subtitle: {
                        text: '数据来源：thesolarfoundation.com'
                    },
                    yAxis: {
                        title: {
                            text: '就业人数'
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle'
                    },
                    plotOptions: {
                        series: {
                            label: {
                                connectorAllowed: false
                            },
                            pointStart: 2010
                        }
                    },
                    series: [{
                        name: '安装，实施人员',
                        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
                    }, {
                        name: '工人',
                        data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
                    }, {
                        name: '销售',
                        data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
                    }, {
                        name: '项目开发',
                        data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
                    }, {
                        name: '其他',
                        data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
                    }],
                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    layout: 'horizontal',
                                    align: 'center',
                                    verticalAlign: 'bottom'
                                }
                            }
                        }]
                    }
                };
                let chart = new Highcharts.Chart(this.$refs.chart,{
                    chart: {
                        type: 'gauge',
                        backgroundColor: 'rgba(0,0,0,0)',
                        plotBackgroundColor: null,
                        plotBackgroundImage: null,
                        plotBorderWidth: 0,
                        plotShadow: false
                    },
                    title: {
                        text: '速度仪'
                    },
                    pane: {
                        startAngle: -150,
                        endAngle: 150,
                        background: [{
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                stops: [
                                    [0, '#FFF'],
                                    [1, '#333']
                                ]
                            },
                            borderWidth: 0,
                            outerRadius: '109%'
                        }, {
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                stops: [
                                    [0, '#333'],
                                    [1, '#FFF']
                                ]
                            },
                            borderWidth: 1,
                            outerRadius: '107%'
                        }, {
                            // default background
                        }, {
                            backgroundColor: '#DDD',
                            borderWidth: 0,
                            outerRadius: '105%',
                            innerRadius: '103%'
                        }]
                    },
                    // the value axis
                    yAxis: {
                        min: 0,
                        max: 200,
                        minorTickInterval: 'auto',
                        minorTickWidth: 1,
                        minorTickLength: 10,
                        minorTickPosition: 'inside',
                        minorTickColor: '#666',
                        tickPixelInterval: 30,
                        tickWidth: 2,
                        tickPosition: 'inside',
                        tickLength: 10,
                        tickColor: '#666',
                        labels: {
                            step: 2,
                            rotation: 'auto'
                        },
                        title: {
                            text: 'km/h'
                        },
                        plotBands: [{
                            from: 0,
                            to: 120,
                            color: '#55BF3B' // green
                        }, {
                            from: 120,
                            to: 160,
                            color: '#DDDF0D' // yellow
                        }, {
                            from: 160,
                            to: 200,
                            color: '#DF5353' // red
                        }]
                    },
                    series: [{
                        name: 'Speed',
                        data: [80],
                        tooltip: {
                            valueSuffix: ' km/h'
                        }
                    }]
                }, function (chart) {
                    if (!chart.renderer.forExport) {
                        setInterval(function () {
                            var point = chart.series[0].points[0],
                                newVal,
                                inc = Math.round((Math.random() - 0.5) * 20);
                            newVal = point.y + inc;
                            if (newVal < 0 || newVal > 200) {
                                newVal = point.y - inc;
                            }
                            point.update(newVal);
                        }, 3000);
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .highcharts-container {
        width: 100%;
        height: 100%;
    }
</style>
