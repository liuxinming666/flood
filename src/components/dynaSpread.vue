<template>
    <div id="cesiumContainer">
        <div class="location-bar">
            <button style="margin: 5px;" @click="onLineSpreadBtnClick">沿线扩散</button>
            <br/>
            <button style="margin: 5px;" @click="onStopBtnClick">停止扩散</button>
            <br/>
            <button style="margin: 5px;" @click="onAddGifBtnClick">随机添加动图</button>
            <br/>
            <span ref="spanShow" style="color: white;"></span>
            <br/>
            <button style="margin: 5px;" @click="onAddMulGifBtnClick">随机添加多个动图</button>
        </div>
        <img ref="imgGif" v-show="bGifShow"
             style="position: absolute; z-index: 1;top: -20px;left: -20px;" src="/red.gif">
        <img v-for="(item,index) in gifAry"
             :ref="'imgGif' + index"
             src="/red.gif"
             style="position: absolute; z-index: 1;top: -30px;left: -30px;">
    </div>
</template>

<script>
    //动态扩散
    import Cesium from "cesium/Source/Cesium";
    import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
    import buildModuleUrl from "cesium/Source/Core/buildModuleUrl";
    import "cesium/Source/Widgets/widgets.css";


    var g_viewer = null;
    export default {
        name: "dynaSpread",
        data(){
            return{
                bbox:[93.412690,32.596075,108.709382,42.793593],//生成数据的边界
                linePts:[],      //随机生成线的坐标集合
                routePts:[],     //播放路径的坐标点集合
                curRouteIndex:1,        //当前路径走到的点
                timer:null,
                polyPositions:null,     //当前路径的坐标点
                bGifShow:false,     //gif图片是否显示
                gifAryLength:10,     //多个gif图片数组的长度
                gifAry: new Array(10),       //多个gif图片的数组
            }
        },
        mounted:function () {
            buildModuleUrl.setBaseUrl("../cesium/");
            this.initMap();
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
            //沿着线进行扩散
            onLineSpreadBtnClick:function () {
                this.randomLineString();

                this.timer = window.setInterval(() => {
                    if (this.curRouteIndex <= this.routePts.length) {
                        if((this.curRouteIndex - 100) > 0){
                            this.polyPositions = Cesium.Cartesian3.fromDegreesArray(
                                _.flatten(_.slice(this.routePts,this.curRouteIndex - 100,this.curRouteIndex))
                            );
                        }
                        else{
                            this.polyPositions = Cesium.Cartesian3.fromDegreesArray(
                                _.flatten(_.slice(this.routePts,0,this.curRouteIndex))
                            );
                        }
                        this.curRouteIndex = this.curRouteIndex + 1;
                    } else {
                        this.curRouteIndex = 1;
                        this.polyPositions = Cesium.Cartesian3.fromDegreesArray(
                            _.flatten(_.slice(this.routePts,0,this.curRouteIndex))
                        );
                    }
                }, 10);
            },
            //随机绘制线
            randomLineString:function () {
                g_viewer.entities.removeAll();
                let lineStrings = turf.randomLineString(
                    1,
                    {
                        bbox: this.bbox,
                        num_vertices:1000,
                        max_length:0.01,
                        max_rotation:Math.PI/100
                    }
                );
                this.linePts = lineStrings.features[0].geometry.coordinates;

                //起点绘制动态图标
                let htmlOverlay = this.$refs.imgGif;
                let spanHtml = this.$refs.spanShow;
                let pos = this.linePts[0];

                g_viewer.scene.preRender.addEventListener(function () {
                    let position = Cesium.Cartesian3.fromDegrees(
                        pos[0],
                        pos[1]);

                    let scratch = new Cesium.Cartesian2();
                    let canvasPosition = g_viewer.cesiumWidget.scene.cartesianToCanvasCoordinates(position);

                    if (Cesium.defined(canvasPosition)){
                        htmlOverlay.style.top = canvasPosition.y + 'px';
                        htmlOverlay.style.left = canvasPosition.x + 'px';
                        spanHtml.innerHTML = htmlOverlay.style.top + "--" + htmlOverlay.style.left;
                    }
                });
                this.bGifShow = true;

                let entity = g_viewer.entities.add({
                    polyline:{
                        positions:Cesium.Cartesian3.fromDegreesArray(
                            _.flatten(lineStrings.features[0].geometry.coordinates)
                        ),
                        width:10,
                        clampToGround:true
                    }
                });

                g_viewer.flyTo(entity);

                this.routePts = [];
                this.routePts.push(this.linePts[0]);
                for(let i = 1;i < this.linePts.length;i++){
                    let pt1Tmp = turf.point(this.linePts[i-1]);
                    let pt2Tmp = turf.point(this.linePts[i]);
                    //这两个点之间的距离
                    let pt1ToPt2Dis = turf.distance(
                        pt1Tmp,
                        pt2Tmp,
                        {units: 'kilometers'});
                    let totalDis = 0;   //当前两点之间路径距离的总和
                    while(true){
                        let bearing = turf.bearing(pt1Tmp, pt2Tmp);

                        let distance = 500 / 1000;  //两点间隔为10米
                        let options = {units: 'kilometers'};

                        let destination = turf.destination(
                            pt1Tmp,
                            distance,
                            bearing,
                            options);
                        this.routePts.push(destination.geometry.coordinates);

                        totalDis =  totalDis + distance;
                        if(totalDis >= pt1ToPt2Dis){
                            break;
                        }
                    }

                }
                debugger;

                let entity2 = g_viewer.entities.add({
                    polyline:{
                        positions:new Cesium.CallbackProperty(
                            () => this.polyPositions, false
                        ),
                        material:Cesium.Color.CRIMSON,
                        clampToGround:true,
                        width:8,
                        zIndex:99
                    }
                });
            },
            //点击了停止扩散按钮
            onStopBtnClick:function () {
                if(this.timer){
                    g_viewer.entities.removeAll();
                    window.clearInterval(this.timer);
                    this.timer = null;
                    this.bGifShow = false;
                }
            },
            //点击了随机添加gif图片按钮
            onAddGifBtnClick:function () {
                let htmlOverlay = this.$refs.imgGif;
                let spanHtml = this.$refs.spanShow;
                let pos = turf.randomPosition(this.bbox);


                /*let scratch = new Cesium.Cartesian2();
                let canvasPosition = g_viewer.scene.cartesianToCanvasCoordinates(position, scratch);

                if (Cesium.defined(canvasPosition)){
                    htmlOverlay.style.top = canvasPosition.y + 'px';
                    htmlOverlay.style.left = canvasPosition.x + 'px';
                }

                g_viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(pos[0], pos[1], 1200)//(108.56211031535, 37.35117012468, 2000000)
                });*/

                g_viewer.scene.preRender.addEventListener(function () {
                    let position = Cesium.Cartesian3.fromDegrees(
                        pos[0],
                        pos[1]);

                    let scratch = new Cesium.Cartesian2();
                    let canvasPosition = g_viewer.cesiumWidget.scene.cartesianToCanvasCoordinates(position);

                    if (Cesium.defined(canvasPosition)){
                        htmlOverlay.style.top = canvasPosition.y + 'px';
                        htmlOverlay.style.left = canvasPosition.x + 'px';
                        spanHtml.innerHTML = htmlOverlay.style.top + "--" + htmlOverlay.style.left;
                    }
                });
                this.bGifShow = true;
                g_viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(pos[0], pos[1], 1200)//(108.56211031535, 37.35117012468, 2000000)
                });
            },
            //点击随机添加多个gif图片按钮
            onAddMulGifBtnClick:function () {
                //let htmlOverlay = this.$refs.imgGif;
                //let spanHtml = this.$refs.spanShow;
                this.gifAryLength = 100;
                this.gifAry = new Array(this.gifAryLength);
                let posAry = [];
                for(let i=0;i<this.gifAryLength;i++)
                {
                    posAry.push(turf.randomPosition(this.bbox));
                }
                //let pos = turf.randomPosition(this.bbox);
                let gifAryLength = this.gifAryLength;
                debugger;
                let refs = this.$refs;
                g_viewer.scene.preRender.addEventListener(function () {
                    for(let i=0;i<gifAryLength;i++){
                        let position = Cesium.Cartesian3.fromDegrees(
                            posAry[i][0],
                            posAry[i][1]);

                        let canvasPosition = g_viewer.cesiumWidget.scene.cartesianToCanvasCoordinates(position);

                        if (Cesium.defined(canvasPosition)){
                            let htmlOverlay = refs['imgGif' + i][0];
                            htmlOverlay.style.top = canvasPosition.y + 'px';
                            htmlOverlay.style.left = canvasPosition.x + 'px';
                        }
                    }

                });
                this.bGifShow = true;
                g_viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(posAry[0][0], posAry[0][1], 1200)//(108.56211031535, 37.35117012468, 2000000)
                });
            }
        }
    }
</script>

<style scoped>
    .location-bar {
        position: absolute;
        z-index: 1;
        /*        padding: 3px 10px;
                font-size: 13px;
                color: #fff;
                text-shadow: 5px 2px 6px #000;*/
    }
</style>
