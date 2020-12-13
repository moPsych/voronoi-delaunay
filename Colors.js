
// these functions are used to generate colors for each element
// use these function as they are "using values from dom controller" or use your own algorithms

// the color of the voronoi polygons
function colorVoronoiPolygon() {
    strokeWeight(0.5);
    stroke(voronoiStrokeColor.value);
    fill(voronoiFillColor.value);
    if (parseInt(voronoiStrokeToggle.value) === 0) {
        noStroke();
    }
    if (!parseInt(voronoiFillToggle.value)) {
        noFill();
    }
}

// the color of the delaunay triangles
function colorDelaunayTriangle() {
    strokeWeight(0.5);
    stroke(delaunayStrokeColor.value);
    fill(delaunayFillColor.value);
    if (parseInt(delaunayStrokeToggle.value) === 0) {
        noStroke();
    }
    if (!parseInt(delaunayFillToggle.value)) {
        noFill();
    }
}

// the color of cell points
function colorCellPoint() {
    let colorPoints = true;
    stroke(pointColor.value);
    strokeWeight(res / 15);
    return (parseInt(pointToggle.value));
}

// the color of the base grid lines
function colorGrid() {
    let showGrid = parseInt(gridToggle.value);
    noFill();
    strokeWeight(0.2);
    stroke(gridColor.value);
    return showGrid;
}
