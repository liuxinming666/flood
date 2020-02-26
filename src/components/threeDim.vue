<template>
    <div id="cesiumContainer" @mousemove="onCesiumMouseMove($event)">
        <div class="location-bar">
            <button style="margin: 5px;" @click="onFloodAnalyBtnClick">淹没分析</button>
            <br/>
            <button style="margin: 5px;" @click="onBtnDraw">手动绘制面</button>
            <br/>
            <button style="margin: 5px;" @click="onBtnHeatmapClick">热力图</button>
        </div>
        <div class="sub_ana_container" v-if="bShowFloodAnaly">
            <label>最大高度:</label>
            <input type="number" v-model="height_max">
            <label>最小高度:</label>
            <input type="number" v-model="height_min">
            <label>淹没速度:</label>
            <input type="number" v-model="speed">
            <button class="btn" @click="start()">开始</button>
            <button class="btn" v-on:click="clear()">清除</button>
            <input type="radio" name="type_map" v-on:click="changeType" v-bind:checked="map_type">
            <label>范围图</label>
            <input type="radio" name="type_map" v-on:click="changeType" v-bind:checked="!map_type">
            <label>深度图</label>
        </div>
        <div id="div_location_jwd" class="location-bar no-print" style="left: 2px; bottom: 2px;color: white;">
            {{coordShow}}
        </div>
    </div>
</template>

<script>
    import Cesium from "cesium/Source/Cesium";
    import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
    import buildModuleUrl from "cesium/Source/Core/buildModuleUrl";
    import "cesium/Source/Widgets/widgets.css";

    var g_viewer = null;
    export default {
        name: "threeDim",
        data(){
            return{
                bDraw:true,
                polygonPts:[],
                entity:null,
                coordShow:'',
                /*手动自动分隔符*/
                bShowFloodAnaly:false,
                linePositionList:[],
                handler:null,
                polygonEntities:[],
                height_max:800,
                height_min:300,
                extrudedHeight:this.height_min,
                polygon_degrees:[
                    115.8784, 40.0198,
                    115.9473, 40.0381,
                    115.9614, 40.0073,
                    115.9042, 39.9912
                ],
                timer:null,
                speed: 20,
                map_type:true
            }
        },
        mounted:function(){
            buildModuleUrl.setBaseUrl("../cesium/");
            this.initMap();
        },
        methods:{
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
                    terrainProvider:new Cesium.CesiumTerrainProvider({
                        url:"https://lab.earthsdk.com/terrain/577fd5b0ac1f11e99dbd8fd044883638",
                        requestVertexNormals: true,
                        requestWaterMask: true
                    }),
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

                g_viewer.screenSpaceEventHandler.setInputAction(
                    this.onCesiumLeftClick,
                    Cesium.ScreenSpaceEventType.LEFT_CLICK);

                g_viewer.screenSpaceEventHandler.setInputAction(
                    this.onCesiumRightClick,
                    Cesium.ScreenSpaceEventType.RIGHT_CLICK);

                g_viewer._cesiumWidget._creditContainer.style.display = "none";// 隐藏版权
            },
            onFloodAnalyBtnClick:function () {
                this.bShowFloodAnaly = !this.bShowFloodAnaly;
            },
            start:function () {
                debugger;
                this.extrudedHeight = Number(this.height_min);
                if((this.polygonPts.length / 2) >= 3){
                    this.polygon_degrees = this.polygonPts;
                    g_viewer.entities.remove(this.entity);
                }
                this.initViewStatus();
                this.addDisListener();

                this.timer = window.setInterval(() => {
                    if ((this.height_max > this.extrudedHeight) && (this.extrudedHeight >= this.height_min)) {
                        this.extrudedHeight = this.extrudedHeight + this.speed
                    } else {
                        this.extrudedHeight = Number(this.height_min);
                    }
                }, 500);
                //this.drawPoly(this.polygon_degrees)
            },
            initViewStatus:function () {
                let scene = g_viewer.scene;
                scene.globe.depthTestAgainstTerrain = true;
                /*scene.camera.setView({
                    // 摄像头的位置
                    destination: Cesium.Cartesian3.fromDegrees(115.9216, 39.9870, 1500.0),
                    orientation: {
                        heading: Cesium.Math.toRadians(0.0),//默认朝北0度，顺时针方向，东是90度
                        pitch: Cesium.Math.toRadians(-20),//默认朝下看-90,0为水平看，
                        roll: Cesium.Math.toRadians(0)//默认0
                    }
                });*/
                g_viewer.skyAtmosphere = false;
            },
            addDisListener:function () {
                let scene = g_viewer.scene;
                let linePositionList = this.linePositionList;
                g_viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
                this.handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

                // 绘制线
                this.drawLine(linePositionList);
                //this.loadGrandCanyon();

                this.drawPoly(this.polygon_degrees);
            },
            // 绘制线
            drawLine:function (linePositionList) {
                let lineStyle = {
                    width: 2,
                    material: Cesium.Color.CHARTREUSE
                };

                let entity = g_viewer.entities.add({
                    polyline: lineStyle,
                });

                entity.polyline.positions = new Cesium.CallbackProperty(function () {
                    return linePositionList
                }, false);

                this.polygonEntities.push(entity)
            },
            // 切割一部分地形
            loadGrandCanyon:function () {
                let globe = g_viewer.scene.globe;
                let position = Cesium.Cartographic.toCartesian(
                    new Cesium.Cartographic.fromDegrees(115.9165534, 40.0139345, 100)
                );
                let distance = 3000.0;
                let boundingSphere = new Cesium.BoundingSphere(position, distance);

                globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
                    modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(position),
                    planes: [
                        new Cesium.ClippingPlane(new Cesium.Cartesian3(1.0, 0.0, 0.0), distance),
                        new Cesium.ClippingPlane(new Cesium.Cartesian3(-1.0, 0.0, 0.0), distance),
                        new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 1.0, 0.0), distance),
                        new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, -1.0, 0.0), distance)
                    ],
                    unionClippingRegions: true
                });
                globe.clippingPlanes.enabled = true;
                g_viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0.5, -0.5, boundingSphere.radius * 5.0));
                g_viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
            },
            //绘制面
            drawPoly:function (degrees) {debugger;
                let entity = g_viewer.entities.add({
                    polygon: {
                        hierarchy: {},
                        material: new Cesium.Color.fromBytes(64, 157, 253, 100),
                        perPositionHeight: true,
                    }
                });

                entity.polygon.hierarchy = new Cesium.PolygonHierarchy(
                    Cesium.Cartesian3.fromDegreesArray(degrees)
                );
                entity.polygon.extrudedHeight = new Cesium.CallbackProperty(
                    () => this.extrudedHeight, false
                );
                this.polygonEntities.push(entity);
            },
            onBtnDraw:function () {
                //g_viewer.scene.morphTo2D(0);
                //this.initViewStatus();
                g_viewer.entities.removeAll();
                this.entity = null;
                this.bDraw = true;
                this.polygonPts = [];
            },
            onCesiumLeftClick:function (movement) {
                //屏幕坐标
                var wp = g_viewer.scene.globe.pick(
                    g_viewer.camera.getPickRay(movement.position),
                    g_viewer.scene);
                var screenPt = new Cesium.Cartesian2(movement.position.x, movement.position.y);
                //世界坐标
                var carPt = g_viewer.scene.globe.pick(g_viewer.camera.getPickRay(screenPt), g_viewer.scene);
                var catG = g_viewer.scene.globe.ellipsoid.cartesianToCartographic(carPt);
                var xx = Cesium.Math.toDegrees(catG.longitude);
                var yy = Cesium.Math.toDegrees(catG.latitude);
                var hh = catG.height;

                if(this.bDraw){
                    if(this.entity == null){
                        //this.polygonPts.push(xx,yy,hh);
                        this.polygonPts.push(xx,yy);

                        this.entity = g_viewer.entities.add({
                            polygon:{
                                hierarchy : new Cesium.CallbackProperty(this.updateHierarchy, false),//Cesium.Cartesian3.fromDegreesArray(this.polygonPts),
                                material: new Cesium.Color.fromBytes(64, 157, 253, 100),
                                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
                                //perPositionHeight: true,
                                //extrudedHeight:250
                            }
                        });
                        //this.entity.polygon.hierarchy._value.positions = new Cesium.CallbackProperty(this.updateHierarchy, false);
                    }
                    else{
                        this.polygonPts.push(xx,yy);
                        if((this.polygonPts.length / 2) == 2){
                            this.polygonPts.push(xx,yy);
                        }
                    }
                }
            },
            updateHierarchy:function(time, result){
                return new Cesium.PolygonHierarchy(
                    //Cesium.Cartesian3.fromDegreesArrayHeights(this.polygonPts),
                    Cesium.Cartesian3.fromDegreesArray(this.polygonPts),
                    []);
            },
            onCesiumRightClick:function(movement){
                this.bDraw = false;
                //g_viewer.scene.morphTo3D(0);
            },
            onCesiumMouseMove:function (e) {
                //屏幕坐标
                let screenPt = new Cesium.Cartesian2(e.clientX, e.clientY);

                //世界坐标
                let carPt = g_viewer.scene.globe.pick(g_viewer.camera.getPickRay(screenPt), g_viewer.scene);
                let catG = g_viewer.scene.globe.ellipsoid.cartesianToCartographic(carPt);
                let xx = Cesium.Math.toDegrees(catG.longitude);
                let yy = Cesium.Math.toDegrees(catG.latitude);
                let hh = catG.height;

                if(this.bDraw){
                    if((this.polygonPts.length / 2)  >= 3){
                        /*this.polygonPts[this.polygonPts.length - 3] = xx;
                        this.polygonPts[this.polygonPts.length - 2] = yy;
                        this.polygonPts[this.polygonPts.length - 1] = hh;*/
                        this.polygonPts[this.polygonPts.length - 2] = xx;
                        this.polygonPts[this.polygonPts.length - 1] = yy;
                    }
                }

                this.coordShow = "经度:" + xx + "  纬度:" + yy + "  高程:" + parseInt(hh) + "米"
            },
            clear:function () {
                if(this.timer){
                    window.clearInterval(this.timer);
                    this.timer = null;
                }
                this.extrudedHeight = this.height_min;

                for (let eTmp of this.polygonEntities) {
                    g_viewer.entities.remove(eTmp)
                }
                g_viewer.skyAtmosphere = true
                g_viewer.scene.globe.clippingPlanes = null;
            },
            onBtnHeatmapClick:function () {
                let bounds = {
                    west: 93.412690,
                    east: 108.709382,
                    south: 32.596075,
                    north: 42.793593
                };

// init heatmap
                let heatMap = CesiumHeatmap.create(
                    g_viewer, // your cesium viewer
                    bounds, // bounds for heatmap layer
                    {
                        // heatmap.js options go here
                        // maxOpacity: 0.3
                    }
                );

// random example data
                //let data = [{"x":147.1383442264,"y":-41.4360048372,"value":76},{"x":147.1384363011,"y":-41.4360298848,"value":63},{"x":147.138368102,"y":-41.4358360603,"value":1},{"x":147.1385627739,"y":-41.4358799123,"value":21},{"x":147.1385138501,"y":-41.4359327669,"value":28},{"x":147.1385031219,"y":-41.4359730105,"value":41},{"x":147.1384127393,"y":-41.435928255,"value":75},{"x":147.1384551136,"y":-41.4359450132,"value":3},{"x":147.1384927196,"y":-41.4359158649,"value":45},{"x":147.1384938639,"y":-41.4358498311,"value":45},{"x":147.1385183299,"y":-41.4360213794,"value":93},{"x":147.1384007925,"y":-41.4359860133,"value":46},{"x":147.1383604844,"y":-41.4358298672,"value":54},{"x":147.13851025,"y":-41.4359098303,"value":39},{"x":147.1383874733,"y":-41.4358511035,"value":34},{"x":147.1384981796,"y":-41.4359355403,"value":81},{"x":147.1384504107,"y":-41.4360332348,"value":39},{"x":147.1385582664,"y":-41.4359788335,"value":20},{"x":147.1383967364,"y":-41.4360581999,"value":35},{"x":147.1383839615,"y":-41.436016316,"value":47},{"x":147.1384082712,"y":-41.4358423338,"value":36},{"x":147.1385092651,"y":-41.4358577623,"value":69},{"x":147.138360356,"y":-41.436046789,"value":90},{"x":147.138471893,"y":-41.4359184292,"value":88},{"x":147.1385605689,"y":-41.4360271359,"value":81},{"x":147.1383585714,"y":-41.4359362476,"value":32},{"x":147.1384939114,"y":-41.4358844253,"value":67},{"x":147.138466724,"y":-41.436019121,"value":17},{"x":147.1385504355,"y":-41.4360614056,"value":49},{"x":147.1383883832,"y":-41.4358733544,"value":82},{"x":147.1385670669,"y":-41.4359650236,"value":25},{"x":147.1383416534,"y":-41.4359310876,"value":82},{"x":147.138525285,"y":-41.4359394661,"value":66},{"x":147.1385487719,"y":-41.4360137656,"value":73},{"x":147.1385496029,"y":-41.4359187277,"value":73},{"x":147.1383989222,"y":-41.4358556562,"value":61},{"x":147.1385499424,"y":-41.4359149305,"value":67},{"x":147.138404523,"y":-41.4359563326,"value":90},{"x":147.1383883675,"y":-41.4359794855,"value":78},{"x":147.1383967187,"y":-41.435891185,"value":15},{"x":147.1384610005,"y":-41.4359044797,"value":15},{"x":147.1384688489,"y":-41.4360396127,"value":91},{"x":147.1384431875,"y":-41.4360684409,"value":8},{"x":147.1385411067,"y":-41.4360645847,"value":42},{"x":147.1385237178,"y":-41.4358843181,"value":31},{"x":147.1384406464,"y":-41.4360003831,"value":51},{"x":147.1384679169,"y":-41.4359950456,"value":96},{"x":147.1384194314,"y":-41.4358419739,"value":22},{"x":147.1385049792,"y":-41.4359574813,"value":44},{"x":147.1384097378,"y":-41.4358598672,"value":82},{"x":147.1384993219,"y":-41.4360352975,"value":84},{"x":147.1383640499,"y":-41.4359839518,"value":81}];
                let bbox = [93.412690,32.596075,108.709382,42.793593];
                let data = [];
                for(let i = 0;i < 2000;i++){
                    let pos = turf.randomPosition(bbox);
                    data.push({
                        "x":pos[0],
                        "y":pos[1],
                        "value":Math.random()*100
                    });
                }
                let valueMin = 0;
                let valueMax = 100;

// add data to heatmap
                heatMap.setWGS84Data(valueMin, valueMax, data);
                g_viewer.zoomTo(g_viewer.entities);
                /*g_viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(147.1383442264,-41.4360048372, 1000)//(108.56211031535, 37.35117012468, 2000000)
                });*/
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

    .sub_ana_container {
        position: absolute;
        z-index: 1;
        left: 100px;
        width: auto;
        height: auto;
        border: solid 1px;
        color: rgb(221, 218, 218);
    }
    .btn {
        color: white;
        background-color: #555758;
        border: #555758;
        margin: 6px;
    }
    input {
        width: 100px;
    }
    label {
        margin: 8px;
        color: rgb(221, 218, 218);
    }
    input[type="radio"] {
        width: 30px;
    }
</style>
