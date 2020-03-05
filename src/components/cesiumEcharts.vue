<template>
    <div id="cesiumContainer">
        <div id="main"
             style="height: 300px;width: 500px;position: absolute;z-index: 1">
        </div>
        <!--<div ref="chart" style="height: 300px;width: 500px;position: absolute;z-index: 1"
             class="highcharts-container">
        </div>-->
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

    //var echarts = require('echarts');

    var g_viewer = null;
    export default {
        name: "cesiumEcharts",
        mounted:function () {
            buildModuleUrl.setBaseUrl("../cesium/");
            this.initMap();
            //this.yscChart();
            //this.initHightChart();
            this.initChart();
        },
        methods:{
            //初始化地图
            initMap:function () {
                let viewerOption = {
                    imageryProvider: new Cesium.UrlTemplateImageryProvider({
                        url: 'http://localhost:9999/china/{z}/{x}/{y}.png',
                        tilingScheme: new Cesium.WebMercatorTilingScheme(),
                        minimumLevel: 0,
                        maximumLevel: 8
                    }),
                    terrainProvider:new Cesium.CesiumTerrainProvider({
                        url: 'http://localhost:9999/hongshuiDEM',
                        requestVertexNormals: true
                    }),
                    /*imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
                        url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=3b6e1ded5e34e4a985ce9167106c62a0",
                        layer: "tdtBasicLayer",
                        style: "default",
                        format: "image/jpeg",
                        tileMatrixSetID: "GoogleMapsCompatible",
                        maximumLevel: 18
                    }),*/
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

                /*g_viewer.imageryLayers.addImageryProvider(
                    new Cesium.UrlTemplateImageryProvider({
                    url: 'http://localhost:9999/hongshui/{z}/{x}/{y}.png',
                    tilingScheme: new Cesium.WebMercatorTilingScheme(),
                    minimumLevel: 0,
                    maximumLevel: 17
                }));*/

                g_viewer.imageryLayers.addImageryProvider(
                    new Cesium.UrlTemplateImageryProvider({
                        url: 'http://localhost:9999/gansu2/{z}/{x}/{y}.png',
                        tilingScheme: new Cesium.WebMercatorTilingScheme(),
                        minimumLevel: 0,
                        maximumLevel: 11
                    }));

                g_viewer.imageryLayers.addImageryProvider(
                    new Cesium.UrlTemplateImageryProvider({
                        url: 'http://localhost:9999/lanzhou/{z}/{x}/{y}.png',
                        tilingScheme: new Cesium.WebMercatorTilingScheme(),
                        minimumLevel: 0,
                        maximumLevel: 22
                    }));

                g_viewer.sceneModePicker.viewModel.duration = 0.0;

                //g_viewer.flyTo(lanzhou);

                /*g_viewer.scene.camera.setView({
                    // 摄像头的位置
                    destination: Cesium.Cartesian3.fromDegrees(115.9216, 39.9870, 1500.0),
                    orientation: {
                        heading: Cesium.Math.toRadians(0.0),//默认朝北0度，顺时针方向，东是90度
                        pitch: Cesium.Math.toRadians(-20),//默认朝下看-90,0为水平看，
                        roll: Cesium.Math.toRadians(0)//默认0
                    }
                });*/

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
                debugger;
                let myChart = echarts.init(document.getElementById('main'));

                var chinaGeoCoordMap = {
                    '黑龙江': [127.9688, 45.368],
                    '内蒙古': [110.3467, 41.4899],
                    "吉林": [125.8154, 44.2584],
                    '北京市': [116.4551, 40.2539],
                    "辽宁": [123.1238, 42.1216],
                    "河北": [114.4995, 38.1006],
                    "天津": [117.4219, 39.4189],
                    "山西": [112.3352, 37.9413],
                    "陕西": [109.1162, 34.2004],
                    "甘肃": [103.5901, 36.3043],
                    "宁夏": [106.3586, 38.1775],
                    "青海": [101.4038, 36.8207],
                    "新疆": [87.9236, 43.5883],
                    "西藏": [91.11, 29.97],
                    "四川": [103.9526, 30.7617],
                    "重庆": [108.384366, 30.439702],
                    "山东": [117.1582, 36.8701],
                    "河南": [113.4668, 34.6234],
                    "江苏": [118.8062, 31.9208],
                    "安徽": [117.29, 32.0581],
                    "湖北": [114.3896, 30.6628],
                    "浙江": [119.5313, 29.8773],
                    "福建": [119.4543, 25.9222],
                    "江西": [116.0046, 28.6633],
                    "湖南": [113.0823, 28.2568],
                    "贵州": [106.6992, 26.7682],
                    "云南": [102.9199, 25.4663],
                    "广东": [113.12244, 23.009505],
                    "广西": [108.479, 23.1152],
                    "海南": [110.3893, 19.8516],
                    '上海': [121.4648, 31.2891]
                };
                var chinaDatas = [
                    [{
                        name: '黑龙江',
                        value: 0
                    }],	[{
                        name: '内蒙古',
                        value: 0
                    }],	[{
                        name: '吉林',
                        value: 0
                    }],	[{
                        name: '辽宁',
                        value: 0
                    }],	[{
                        name: '河北',
                        value: 0
                    }],	[{
                        name: '天津',
                        value: 0
                    }],	[{
                        name: '山西',
                        value: 0
                    }],	[{
                        name: '陕西',
                        value: 0
                    }],	[{
                        name: '甘肃',
                        value: 0
                    }],	[{
                        name: '宁夏',
                        value: 0
                    }],	[{
                        name: '青海',
                        value: 0
                    }],	[{
                        name: '新疆',
                        value: 0
                    }],[{
                        name: '西藏',
                        value: 0
                    }],	[{
                        name: '四川',
                        value: 0
                    }],	[{
                        name: '重庆',
                        value: 0
                    }],	[{
                        name: '山东',
                        value: 0
                    }],	[{
                        name: '河南',
                        value: 0
                    }],	[{
                        name: '江苏',
                        value: 0
                    }],	[{
                        name: '安徽',
                        value: 0
                    }],	[{
                        name: '湖北',
                        value: 0
                    }],	[{
                        name: '浙江',
                        value: 0
                    }],	[{
                        name: '福建',
                        value: 0
                    }],	[{
                        name: '江西',
                        value: 0
                    }],	[{
                        name: '湖南',
                        value: 0
                    }],	[{
                        name: '贵州',
                        value: 0
                    }],[{
                        name: '广西',
                        value: 0
                    }],	[{
                        name: '海南',
                        value: 0
                    }],	[{
                        name: '上海',
                        value: 1
                    }]
                ];

                var convertData = function(data) {
                    var res = [];
                    for(var i = 0; i < data.length; i++) {
                        var dataItem = data[i];
                        var fromCoord = chinaGeoCoordMap[dataItem[0].name];
                        var toCoord = [116.4551,40.2539];
                        if(fromCoord && toCoord) {
                            res.push([{
                                coord: fromCoord,
                                value: dataItem[0].value
                            }, {
                                coord: toCoord,
                            }]);
                        }
                    }
                    return res;
                };

                var series = [];
                [['北京市', chinaDatas]].forEach(function(item, i) {
                    series.push(
                        {
                            type: 'lines',
                            coordinateSystem: 'GLMap',
                            zlevel: 2,
                            effect: {
                                show: true,
                                period: 4, //箭头指向速度，值越小速度越快
                                trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
                                symbol: 'arrow', //箭头图标
                                symbolSize: 5, //图标大小
                            },
                            lineStyle: {
                                normal: {
                                    width: 1, //尾迹线条宽度
                                    opacity: 1, //尾迹线条透明度
                                    color: '#00EAFF',//线的颜色
                                    curveness: .3 //尾迹线条曲直度
                                }
                            },
                            data: convertData(item[1])
                        },
                        {
                            type: 'effectScatter',
                            coordinateSystem: 'GLMap',
                            zlevel: 2,
                            rippleEffect: { //涟漪特效
                                period: 4, //动画时间，值越小速度越快
                                brushType: 'stroke', //波纹绘制方式 stroke, fill
                                scale: 4 //波纹圆环最大限制，值越大波纹越大
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right', //显示位置
                                    offset: [5, 0], //偏移设置
                                    formatter: function(params){//圆环显示文字
                                        return params.data.name;
                                    },
                                    fontSize: 13
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            symbol: 'circle',
                            symbolSize: function(val) {
                                return 5+ val[2] * 5; //圆环大小
                            },
                            itemStyle: {
                                normal: {
                                    show: false,
                                    color: '#32ff9d'//颜色
                                }
                            },
                            data: item[1].map(function(dataItem) {
                                return {
                                    name: dataItem[0].name,
                                    value: chinaGeoCoordMap[dataItem[0].name].concat([dataItem[0].value])
                                };
                            }),
                        },
                        //被攻击点
                        {
                            type: 'scatter',
                            coordinateSystem: 'GLMap',
                            zlevel: 2,
                            rippleEffect: {
                                period: 4,
                                brushType: 'stroke',
                                scale: 4
                            },
                            itemStyle: {
                                normal: {
                                    color: '#ff0617'//颜色
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right',
                                    //offset:[5, 0],
                                    color: '#0f0',
                                    formatter: '{b}',
                                    textStyle: {
                                        color: "#0f0"
                                    }
                                },
                                emphasis: {
                                    show: true,
                                    color: "#f60"
                                }
                            },
                            symbol: 'pin',
                            symbolSize: 50,
                            data: [{
                                name: item[0],
                                value: chinaGeoCoordMap[item[0]].concat([10]),
                            }],
                        }
                    );
                });

                let option = {
                    animation: !1,
                    GLMap: {},
                    series: series
                };
                debugger;
                ysc.echarts = echarts;
                ysc.echartsCombineCesium(g_viewer,option);

                g_viewer.camera.setView({
                    destination : Cesium.Cartesian3.fromDegrees(117.16, 32.71, 15000000.0)
                });

                /*myChart.setOption({
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
                });*/
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
            },
            //和ECharts结合
            yscChart:function () {
                var chinaGeoCoordMap = {
                    '黑龙江': [127.9688, 45.368],
                    '内蒙古': [110.3467, 41.4899],
                    "吉林": [125.8154, 44.2584],
                    '北京市': [116.4551, 40.2539],
                    "辽宁": [123.1238, 42.1216],
                    "河北": [114.4995, 38.1006],
                    "天津": [117.4219, 39.4189],
                    "山西": [112.3352, 37.9413],
                    "陕西": [109.1162, 34.2004],
                    "甘肃": [103.5901, 36.3043],
                    "宁夏": [106.3586, 38.1775],
                    "青海": [101.4038, 36.8207],
                    "新疆": [87.9236, 43.5883],
                    "西藏": [91.11, 29.97],
                    "四川": [103.9526, 30.7617],
                    "重庆": [108.384366, 30.439702],
                    "山东": [117.1582, 36.8701],
                    "河南": [113.4668, 34.6234],
                    "江苏": [118.8062, 31.9208],
                    "安徽": [117.29, 32.0581],
                    "湖北": [114.3896, 30.6628],
                    "浙江": [119.5313, 29.8773],
                    "福建": [119.4543, 25.9222],
                    "江西": [116.0046, 28.6633],
                    "湖南": [113.0823, 28.2568],
                    "贵州": [106.6992, 26.7682],
                    "云南": [102.9199, 25.4663],
                    "广东": [113.12244, 23.009505],
                    "广西": [108.479, 23.1152],
                    "海南": [110.3893, 19.8516],
                    '上海': [121.4648, 31.2891]
                };
                var chinaDatas = [
                    [{
                        name: '黑龙江',
                        value: 0
                    }],	[{
                        name: '内蒙古',
                        value: 0
                    }],	[{
                        name: '吉林',
                        value: 0
                    }],	[{
                        name: '辽宁',
                        value: 0
                    }],	[{
                        name: '河北',
                        value: 0
                    }],	[{
                        name: '天津',
                        value: 0
                    }],	[{
                        name: '山西',
                        value: 0
                    }],	[{
                        name: '陕西',
                        value: 0
                    }],	[{
                        name: '甘肃',
                        value: 0
                    }],	[{
                        name: '宁夏',
                        value: 0
                    }],	[{
                        name: '青海',
                        value: 0
                    }],	[{
                        name: '新疆',
                        value: 0
                    }],[{
                        name: '西藏',
                        value: 0
                    }],	[{
                        name: '四川',
                        value: 0
                    }],	[{
                        name: '重庆',
                        value: 0
                    }],	[{
                        name: '山东',
                        value: 0
                    }],	[{
                        name: '河南',
                        value: 0
                    }],	[{
                        name: '江苏',
                        value: 0
                    }],	[{
                        name: '安徽',
                        value: 0
                    }],	[{
                        name: '湖北',
                        value: 0
                    }],	[{
                        name: '浙江',
                        value: 0
                    }],	[{
                        name: '福建',
                        value: 0
                    }],	[{
                        name: '江西',
                        value: 0
                    }],	[{
                        name: '湖南',
                        value: 0
                    }],	[{
                        name: '贵州',
                        value: 0
                    }],[{
                        name: '广西',
                        value: 0
                    }],	[{
                        name: '海南',
                        value: 0
                    }],	[{
                        name: '上海',
                        value: 1
                    }]
                ];

                var convertData = function(data) {
                    var res = [];
                    for(var i = 0; i < data.length; i++) {
                        var dataItem = data[i];
                        var fromCoord = chinaGeoCoordMap[dataItem[0].name];
                        var toCoord = [116.4551,40.2539];
                        if(fromCoord && toCoord) {
                            res.push([{
                                coord: fromCoord,
                                value: dataItem[0].value
                            }, {
                                coord: toCoord,
                            }]);
                        }
                    }
                    return res;
                };

                var series = [];
                [['北京市', chinaDatas]].forEach(function(item, i) {
                    series.push(
                        {
                            type: 'lines',
                            coordinateSystem: 'GLMap',
                            zlevel: 2,
                            effect: {
                                show: true,
                                period: 4, //箭头指向速度，值越小速度越快
                                trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
                                symbol: 'arrow', //箭头图标
                                symbolSize: 5, //图标大小
                            },
                            lineStyle: {
                                normal: {
                                    width: 1, //尾迹线条宽度
                                    opacity: 1, //尾迹线条透明度
                                    color: '#00EAFF',//线的颜色
                                    curveness: .3 //尾迹线条曲直度
                                }
                            },
                            data: convertData(item[1])
                        },
                        {
                            type: 'effectScatter',
                            coordinateSystem: 'GLMap',
                            zlevel: 2,
                            rippleEffect: { //涟漪特效
                                period: 4, //动画时间，值越小速度越快
                                brushType: 'stroke', //波纹绘制方式 stroke, fill
                                scale: 4 //波纹圆环最大限制，值越大波纹越大
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right', //显示位置
                                    offset: [5, 0], //偏移设置
                                    formatter: function(params){//圆环显示文字
                                        return params.data.name;
                                    },
                                    fontSize: 13
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            symbol: 'circle',
                            symbolSize: function(val) {
                                return 5+ val[2] * 5; //圆环大小
                            },
                            itemStyle: {
                                normal: {
                                    show: false,
                                    color: '#32ff9d'//颜色
                                }
                            },
                            data: item[1].map(function(dataItem) {
                                return {
                                    name: dataItem[0].name,
                                    value: chinaGeoCoordMap[dataItem[0].name].concat([dataItem[0].value])
                                };
                            }),
                        },
                        //被攻击点
                        {
                            type: 'scatter',
                            coordinateSystem: 'GLMap',
                            zlevel: 2,
                            rippleEffect: {
                                period: 4,
                                brushType: 'stroke',
                                scale: 4
                            },
                            itemStyle: {
                                normal: {
                                    color: '#ff0617'//颜色
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right',
                                    //offset:[5, 0],
                                    color: '#0f0',
                                    formatter: '{b}',
                                    textStyle: {
                                        color: "#0f0"
                                    }
                                },
                                emphasis: {
                                    show: true,
                                    color: "#f60"
                                }
                            },
                            symbol: 'pin',
                            symbolSize: 50,
                            data: [{
                                name: item[0],
                                value: chinaGeoCoordMap[item[0]].concat([10]),
                            }],
                        }
                    );
                });

                let option = {
                    animation: !1,
                    GLMap: {},
                    series: series
                };
                debugger;
                ysc.echartsCombineCesium(g_viewer,option);

                g_viewer.camera.setView({
                    destination : Cesium.Cartesian3.fromDegrees(117.16, 32.71, 15000000.0)
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
