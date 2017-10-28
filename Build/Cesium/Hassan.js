
// var viewer = new Cesium.Viewer('cesiumContainer');

var farm = viewer.entities.add({
    name: 'The Farm',
    polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray([
          150.1519192877745,-33.52206853028731,
          150.1522517091402,-33.52233013600113,
          150.1528145934834,-33.52288767352387,
          150.1579383270273,-33.52163416962293,
          150.158342882107,-33.5210849693267,
          150.1607866818846,-33.51988610569899,
          150.16161707915,-33.51963527578112,
          150.1627991049549,-33.51895855507399,
          150.1647522797186,-33.51841527013251,
          150.1629824572579,-33.51812845788713,
          150.163534101927,-33.5143216361253,
          150.1622740915446,-33.51410697788266,
          150.1548990650152,-33.51309014490439,
          150.1542096109254,-33.51685011908559,
          150.1518694280316,-33.51651387670302,
          150.1507940816415,-33.52137789620466,
          150.1519192877745,-33.52206853028731]),
        height: 110,
        material: Cesium.Color.RED.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.BLACK
    }
});

// viewer.zoomTo(farm);
