
// controller dom elements are in Event.js
// color controls are in Color.js
// cell class is in Cell.js
// line class is in Line.js
// styles are in styles.css

// this is an algorithm that uses a grid-based approach not the fortune's algorithm
// this algorithm still needs some optimization improvements and some other improvements especially in the delaunay part
// each step is commented on to make things quite clear

// pseudocode summary:

// we start by dividing the canvas into a grid that extends by an offset cells around the canvas
// we generate one random point in each cell, this point's coordinates are included in this cell "site"
// for each point:
//   a voronoi edge is calculated between this point and the points around it (the second nearest neighbor in all directions)
//   "second is determined by the offset value"
//   "a voronoi edge is a perpendicular line from the mid point between two voronoi sites"
//    after every edge is calculated, it's stored in an edges array in the vertex object
// for each edge in the edges array of each voronoi vertex:
//   we calculate the point of intersection between this edge and all the edges in the array
//   the points of intersection are pushed to the vertices array of the voronoi vertex object
//   some of these points are not valid voronoi polygon points so we then perform some processes on them to pick the valid ones
//   these processes are described as detailed comments in the code
// after validating these points, each cell is drawn as a polygon through these points
// this was the voronoi part
// for the delaunay diagram, a quite similar algorithm is used to generate the triangles
// the deluanay generation process is described as detailed comments in the code
// coloring is controlled by the dom input elements but any other agorithm can be used

let c, cn;
// the number of columns and rows
let w, h;
// the cells array
let cells;
// regenerate the cells
let regenerate = true;
// redraw the cells
let redraw = true;

// voronoi only: 0 | delaunay only: 1 | both: 2
let cellType = 0;
// average distance between points
let res = 100;
// offset outside the canvas
let offset = 2;

function setup() {
  c = createCanvas(windowHeight - 50, windowHeight - 50);
  // getting the color from the background dom element
  background(backgroundColor.value);
  // set the value for the resolution dom element
  resInput.value = 8;
}

function draw() {

  // initializing event listeners for the controllers
  initEvents();

  if (regenerate) {
    // regenerate the cells array
    regenerate = false;
    // the average number of points per width
    w = ceil((width + 2 * offset * res) / res);
    // the average number of points per height
    h = ceil((height + 2 * offset * res) / res);

    // initializing the empty cells array
    cells = [];

    // populating the cells array with cells
    initCells();
    // calculate the initial edge for each voronoi cell
    initVoronoiEdges();

    for (let cell of cells) {
      // voronoi polygons are calculated for each case
      cell.makeVoronoiPolygon();
      if (cellType === 1 || cellType === 2) {
        // calculate delaunay triangles
        cell.makeDelaunayTriangle();
      }
    }
  }

  if (redraw) {
    // redraw the cells

    // getting the color from the background dom element
    background(backgroundColor.value);
    for (let cell of cells) {
      // draw the cells
      cell.render();
    }
    if (colorGrid()) {
      for (let cell of cells) {
        // draw base grid lines if needed
        rect(cell.sx, cell.sy, res, res);
      }
    }
  }
}

function initCells() {
  // populating the cells array cells, each cell has a random point (site)
  // adding offset around the canvas to avoid empty regions
  for (let y = -offset * res; y < height + offset * res; y += res) {
    for (let x = -offset * res; x < width + offset * res; x += res) {
      cells.push(new Cell(x, y, res, cellType));
    }
  }
}

function initVoronoiEdges() {
  // basically, a voronoi edge is a perpendicular line from the mid point of two voronoi points
  // in the next loops, for each point we calculate voronoi edges between this point and the points around it.
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let index1 = x + y * w;
      for (let v = y - offset; v <= y + offset; v++) {
        for (let u = x - offset; u <= x + offset; u++) {
          if (u >= 0 && u < w && v >= 0 && v < h) {
            let index2 = u + v * w;
            // the function that calculates the voronoi edge between this cell and another cell
            cells[index1].makeVoronoiEdge(cells[index1].s, cells[index2].s);
          }
        }
      }
    }
  }
}

// the below functions are for resizing the canvas
function windowResized() {
  c = resizeCanvas(windowHeight, windowHeight);
  calcCanvas();
  regenerate = true;
}

function calcCanvas() {
  cn = document.querySelector('canvas');
  cn.style.width = '100vv';
  cn.style.height = '100vh';
}