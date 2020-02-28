<template>
    <div id="cesiumContainer">
        <div class="location-bar">
            <button style="margin: 5px;" @click="onSnowBtnClick">下雪</button>
            <br/>
            <button style="margin: 5px;" @click="onRainBtnClick">下雨</button>
            <br/>
            <button style="margin: 5px;" @click="onClearBtnClick">清除</button>
            <br/>
        </div>
        <div id="creditContainer" style="display: none;"></div>
    </div>
</template>

<script>
    //天气模拟
    import Cesium from "cesium/Source/Cesium";
    import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
    import buildModuleUrl from "cesium/Source/Core/buildModuleUrl";
    import "cesium/Source/Widgets/widgets.css";

    var g_viewer = null;
    export default {
        name: "weatherSim",
        data(){
            return{
                curStage:null
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
                    contextOptions: {
                        webgl: {
                            alpha: true,
                            depth: false,
                            stencil: true,
                            antialias: true,
                            premultipliedAlpha: true,
                            preserveDrawingBuffer: true,
                            failIfMajorPerformanceCaveat: true
                        },
                        allowTextureFilterAnisotropic: true
                    },
                    creditContainer: "creditContainer",
                    selectionIndicator: false,
                    animation: false,
                    baseLayerPicker: false,
                    geocoder: false,
                    timeline: false,
                    sceneModePicker: true,
                    navigationHelpButton: false,
                    infoBox: false,
                    fullscreenButton: true
                };
                g_viewer = new Cesium.Viewer('cesiumContainer', viewerOption);

                let lat = 42.006;
                let lon = 128.055;
                //取消双击事件
                g_viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
                    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
                //设置homebutton的位置
                Cesium.Camera.DEFAULT_VIEW_RECTANGLE =
                    Cesium.Rectangle.fromDegrees(lon - 1, lat - 1, lon + 1, lat + 1);//Rectangle(west, south, east, north)
                //设置初始位置
                g_viewer.camera.setView({
                    destination: Cesium.Cartesian3.fromDegrees(lon, lat, 300000)
                });

                g_viewer._cesiumWidget._creditContainer.style.display = "none";// 隐藏版权
            },
            //定义下雪场景，着色器
            FS_Snow:function () {
                return "uniform sampler2D colorTexture;\n\
    varying vec2 v_textureCoordinates;\n\
\n\
    float snow(vec2 uv,float scale)\n\
    {\n\
        float time = czm_frameNumber / 60.0;\n\
        float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;\n\
        uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;\n\
        uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;\n\
        p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);\n\
        k=smoothstep(0.,k,sin(f.x+f.y)*0.01);\n\
        return k*w;\n\
    }\n\
\n\
    void main(void){\n\
        vec2 resolution = czm_viewport.zw;\n\
        vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
        vec3 finalColor=vec3(0);\n\
        float c = 0.0;\n\
        c+=snow(uv,30.)*.0;\n\
        c+=snow(uv,20.)*.0;\n\
        c+=snow(uv,15.)*.0;\n\
        c+=snow(uv,10.);\n\
        c+=snow(uv,8.);\n\
    c+=snow(uv,6.);\n\
        c+=snow(uv,5.);\n\
        finalColor=(vec3(c)); \n\
        gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.5); \n\
\n\
    }\n\
";
            },
            //定义下雨场景，着色器
            FS_Rain:function(){
                return "uniform sampler2D colorTexture;\n\
				varying vec2 v_textureCoordinates;\n\
			\n\
				float hash(float x){\n\
					return fract(sin(x*133.3)*13.13);\n\
			}\n\
			\n\
			void main(void){\n\
			\n\
				float time = czm_frameNumber / 60.0;\n\
			vec2 resolution = czm_viewport.zw;\n\
			\n\
			vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
			vec3 c=vec3(.6,.7,.8);\n\
			\n\
			float a=-.4;\n\
			float si=sin(a),co=cos(a);\n\
			uv*=mat2(co,-si,si,co);\n\
			uv*=length(uv+vec2(0,4.9))*.3+1.;\n\
			\n\
			float v=1.-sin(hash(floor(uv.x*100.))*2.);\n\
			float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\n\
			c*=v*b; \n\
			\n\
			gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5);  \n\
			}\n\
";
            },
            //点击了下雪按钮
            onSnowBtnClick:function () {
                this.onClearBtnClick();

                let collection = g_viewer.scene.postProcessStages;
                let fs_snow = this.FS_Snow();
                this.curStage = new Cesium.PostProcessStage({
                    name: 'czm_snow',
                    fragmentShader: fs_snow
                });
                collection.add(this.curStage);

                g_viewer.scene.skyAtmosphere.hueShift = -0.8;
                g_viewer.scene.skyAtmosphere.saturationShift = -0.7;
                g_viewer.scene.skyAtmosphere.brightnessShift = -0.33;
                g_viewer.scene.fog.density = 0.001;
                g_viewer.scene.fog.minimumBrightness = 0.8;
            },
            //点击了下雨按钮
            onRainBtnClick:function () {
                this.onClearBtnClick();

                let collection = g_viewer.scene.postProcessStages;
                let fs_rain = this.FS_Rain();
                this.curStage = new Cesium.PostProcessStage({
                    name: 'czm_rain',
                    fragmentShader: fs_rain
                });
                collection.add(this.curStage);

                g_viewer.scene.skyAtmosphere.hueShift = -0.8;
                g_viewer.scene.skyAtmosphere.saturationShift = -0.7;
                g_viewer.scene.skyAtmosphere.brightnessShift = -0.33;
                g_viewer.scene.fog.density = 0.001;
                g_viewer.scene.fog.minimumBrightness = 0.8;
            },
            onClearBtnClick:function () {
                if(this.curStage != null){
                    g_viewer.scene.postProcessStages.remove(this.curStage);
                    this.curStage = null;
                }
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
