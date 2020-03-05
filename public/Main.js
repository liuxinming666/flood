﻿define([
    'Core/RendererUtils',
    'Core/Mesh',
    'Core/MeshMaterial',
    'Core/Shaders/ShaderChunk',
    'Core/MeshVisualizer',
    'Core/FramebufferTexture',
    'Core/GeometryUtils',
    'Core/LOD',
    'Core/PlaneGeometry',
    'Core/Rotation',
    'Core/ReferenceMesh',
    'Core/BasicMeshMaterial',
    'Core/BasicGeometry',
    'Core/Shaders/ShaderLib',
    'Core/PlaneBufferGeometry',
    'Util/CSG',
    'Core/MeshPhongMaterial',
    'Core/MaterialUtils',
    'Core/ShaderUtils'
], function (
    RendererUtils,
    Mesh,
    MeshMaterial,
    ShaderChunk,
    MeshVisualizer,
    FramebufferTexture,
    GeometryUtils,
    LOD,
    PlaneGeometry,
    Rotation,
    ReferenceMesh,
    BasicMeshMaterial,
    BasicGeometry,
    ShaderLib,
    PlaneBufferGeometry,
    CSG,
    MeshPhongMaterial,
    MaterialUtils,
    ShaderUtils
) {
        if (typeof Cesium === 'undefined') {
            Cesium = {};
        } else {
            if (Cesium.Resource) {
                Cesium.loadText = Cesium.Resource.fetchText;
                Cesium.loadJson = Cesium.Resource.fetchJson;
                Cesium.loadBlob = Cesium.Resource.fetchBlob;
                Cesium.loadArrayBuffer = Cesium.Resource.fetchArrayBuffer;
                Cesium.loadImage = Cesium.Resource.fetchImage;
            }

        }
        Cesium.RendererUtils = RendererUtils;
        Cesium.Mesh = Mesh;
        Cesium.MeshMaterial = MeshMaterial;
        Cesium.ShaderChunk = ShaderChunk;
        Cesium.ShaderLib = ShaderLib;
        Cesium.MeshVisualizer = MeshVisualizer;
        Cesium.FramebufferTexture = FramebufferTexture;
        Cesium.GeometryUtils = GeometryUtils;
        Cesium.LOD = LOD;
        Cesium.PlaneGeometry = PlaneGeometry;
        Cesium.Rotation = Rotation;
        Cesium.ReferenceMesh = ReferenceMesh;
        Cesium.BasicMeshMaterial = BasicMeshMaterial;
        Cesium.BasicGeometry = BasicGeometry;
        Cesium.PlaneBufferGeometry = PlaneBufferGeometry;
        Cesium.CSG = CSG;
        Cesium.MeshPhongMaterial = MeshPhongMaterial;
        Cesium.MaterialUtils = MaterialUtils;
        Cesium.ShaderUtils = ShaderUtils;
        return Cesium;
    })