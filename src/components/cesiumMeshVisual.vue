<template>
    <div id="cesiumContainer">

    </div>
</template>

<script>
    import Cesium from "cesium/Source/Cesium";
    import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
    import buildModuleUrl from "cesium/Source/Core/buildModuleUrl";
    import "cesium/Source/Widgets/widgets.css";

    var g_viewer = null;
    export default {
        name: "cesiumMeshVisual",
        mounted:function () {
            buildModuleUrl.setBaseUrl("../cesium/");
            this.initMap();
            this.useCesiumMeshVisual();
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

                /*g_viewer.screenSpaceEventHandler.setInputAction(
                    this.onCesiumLeftClick,
                    Cesium.ScreenSpaceEventType.LEFT_CLICK);

                g_viewer.screenSpaceEventHandler.setInputAction(
                    this.onCesiumRightClick,
                    Cesium.ScreenSpaceEventType.RIGHT_CLICK);*/

                g_viewer._cesiumWidget._creditContainer.style.display = "none";// 隐藏版权
            },
            useCesiumMeshVisual:function () {
                MeshVisualizer = Cesium.MeshVisualizer;
                Mesh = Cesium.Mesh;
                MeshMaterial = Cesium.MeshMaterial;
                FramebufferTexture = Cesium.FramebufferTexture;
                GeometryUtils = Cesium.GeometryUtils;
                LOD = Cesium.LOD;

                //init();

                var center = Cesium.Cartesian3.fromDegrees(homePosition[0], homePosition[1], 5000);
                var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);

                var meshVisualizer = new MeshVisualizer({
                    modelMatrix: modelMatrix,
                    up: { z: 1 }
                });
                viewer.scene.primitives.add(meshVisualizer);
                meshVisualizer.showReference = true;//显示坐标轴

                var material = new MeshMaterial({
                    defaultColor: "rgba(200,0,0,1.0)",
                    wireframe: true,
                    side: MeshMaterial.Sides.FRONT
                });
                var geometry = new Cesium.SphereGeometry({
                    radius: 50000.0,
                    vertexFormat: Cesium.VertexFormat.POSITION_ONLY
                });
                var mesh = new Mesh(geometry, material);
                mesh.position.z += 50000  ;
                meshVisualizer.add(mesh);

                setInterval(function () {
                    mesh.rotation.angle += 1;
                    mesh.modelMatrixNeedsUpdate = true;
                }, 20);
            }
        }
    }
</script>

<style scoped>

</style>
