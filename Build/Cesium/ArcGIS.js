var viewer = new Cesium.Viewer('cesiumContainer');

// set lighting to true
viewer.scene.globe.enableLighting = true;

var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
    url : 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
    requestWaterMask : true,
    requestVertexNormals : true
});
viewer.terrainProvider = cesiumTerrainProviderMeshes;

// setup alternative terrain providers
var ellipsoidProvider = new Cesium.EllipsoidTerrainProvider();

var vrTheWorldProvider = new Cesium.VRTheWorldTerrainProvider({
    url : 'http://www.vr-theworld.com/vr-theworld/tiles1.0.0/73/',
    credit : 'Terrain data courtesy VT MÄK'
});

Sandcastle.addToolbarMenu([{
    text : 'CesiumTerrainProvider - STK World Terrain',
    onselect : function() {
        viewer.terrainProvider = cesiumTerrainProviderMeshes;
        viewer.scene.globe.enableLighting = true;
    }
}, {
    text : 'CesiumTerrainProvider - STK World Terrain - no effects',
    onselect : function() {
        viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
            url : 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles'
        });
    }
}, {
    text : 'CesiumTerrainProvider - STK World Terrain w/ Lighting',
    onselect : function() {
        viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
            url : 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
            requestVertexNormals : true
        });
        viewer.scene.globe.enableLighting = true;
    }
}, {
    text : 'CesiumTerrainProvider - STK World Terrain w/ Water',
    onselect : function() {
        viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
            url : 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
            requestWaterMask : true
        });
    }
}, {
    text : 'EllipsoidTerrainProvider',
    onselect : function() {
        viewer.terrainProvider = ellipsoidProvider;
    }
}, {
    text : 'VRTheWorldTerrainProvider',
    onselect : function() {
        viewer.terrainProvider = vrTheWorldProvider;
    }
}], 'terrainMenu');

Sandcastle.addDefaultToolbarMenu([{
    text : 'Mount Everest',
    onselect : function() {
        lookAtMtEverest();
    }
}, {
    text : 'Half Dome',
    onselect : function() {
        var target = new Cesium.Cartesian3(-2489625.0836225147, -4393941.44443024, 3882535.9454173897);
        var offset = new Cesium.Cartesian3(-6857.40902037546, 412.3284835694358, 2147.5545426812023);
        viewer.camera.lookAt(target, offset);
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    }
}, {
    text : 'San Francisco Bay',
    onselect : function() {
        var target = new Cesium.Cartesian3(-2708814.85583248, -4254159.450845907, 3891403.9457429945);
        var offset = new Cesium.Cartesian3(70642.66030209465, -31661.517948317807, 35505.179997143336);
        viewer.camera.lookAt(target, offset);
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    }
}], 'zoomButtons');

var terrainSamplePositions;

function lookAtMtEverest() {
    var target = new Cesium.Cartesian3(300770.50872389384, 5634912.131394585, 2978152.2865545116);
    var offset = new Cesium.Cartesian3(6344.974098678562, -793.3419798081741, 2499.9508860763162);
    viewer.camera.lookAt(target, offset);
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
}

function sampleTerrainSuccess(terrainSamplePositions) {
    var ellipsoid = Cesium.Ellipsoid.WGS84;

    //By default, Cesium does not obsure geometry
    //behind terrain. Setting this flag enables that.
    viewer.scene.globe.depthTestAgainstTerrain = true;

    viewer.entities.suspendEvents();
    viewer.entities.removeAll();

    for (var i = 0; i < terrainSamplePositions.length; ++i) {
        var position = terrainSamplePositions[i];

        viewer.entities.add({
            name : position.height.toFixed(1),
            position : ellipsoid.cartographicToCartesian(position),
            billboard : {
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                scale : 0.7,
                image : '../images/facility.gif'
            },
            label : {
                text : position.height.toFixed(1),
                font : '10pt monospace',
                horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
                pixelOffset : new Cesium.Cartesian2(0, -14),
                fillColor : Cesium.Color.BLACK,
                outlineColor : Cesium.Color.BLACK,
                showBackground : true,
                backgroundColor : new Cesium.Color(0.9, 0.9, 0.9, 0.7),
                backgroundPadding : new Cesium.Cartesian2(4, 3)
            }
        });
    }
    viewer.entities.resumeEvents();
}

function createGrid(rectangleHalfSize) {
    var gridWidth = 41;
    var gridHeight = 41;
    var everestLatitude = Cesium.Math.toRadians(27.988257);
    var everestLongitude = Cesium.Math.toRadians(86.925145);
    var e = new Cesium.Rectangle(everestLongitude - rectangleHalfSize, everestLatitude - rectangleHalfSize, everestLongitude + rectangleHalfSize, everestLatitude + rectangleHalfSize);
    var terrainSamplePositions = [];
    for (var y = 0; y < gridHeight; ++y) {
        for (var x = 0; x < gridWidth; ++x) {
            var longitude = Cesium.Math.lerp(e.west, e.east, x / (gridWidth - 1));
            var latitude = Cesium.Math.lerp(e.south, e.north, y / (gridHeight - 1));
            var position = new Cesium.Cartographic(longitude, latitude);
            terrainSamplePositions.push(position);
        }
    }
    return terrainSamplePositions;
}

Sandcastle.addToggleButton('Enable Lighting', viewer.scene.globe.enableLighting, function(checked) {
    viewer.scene.globe.enableLighting = checked;
});

Sandcastle.addToggleButton('Enable fog', viewer.scene.fog.enabled, function(checked) {
    viewer.scene.fog.enabled = checked;
});

Sandcastle.addToolbarButton('Sample Everest Terrain at Level 9', function() {
    var terrainSamplePositions = createGrid(0.005);
    Cesium.when(Cesium.sampleTerrain(viewer.terrainProvider, 9, terrainSamplePositions), sampleTerrainSuccess);
    lookAtMtEverest();
}, 'sampleButtons');

Sandcastle.addToolbarButton('Sample Most Detailed Everest Terrain', function() {
    var terrainSamplePositions = createGrid(0.0005);
    Cesium.when(Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, terrainSamplePositions), sampleTerrainSuccess);
    lookAtMtEverest();
}, 'sampleButtons');
