
// the controllers dom elements
const regenBtn = document.querySelector("#regen");
const typeRange = document.querySelector("#typeRange");
const resInput = document.querySelector("#res");
const gridToggle = document.querySelector("#gridColorToggle");
const gridColor = document.querySelector("#gridColor");
const pointToggle = document.querySelector("#pointColorToggle");
const pointColor = document.querySelector("#pointColor");
const voronoiStrokeToggle = document.querySelector("#voronoiStrokeToggle");
const voronoiStrokeColor = document.querySelector("#voronoiStroke");
const voronoiFillToggle = document.querySelector("#voronoiFillToggle");
const voronoiFillColor = document.querySelector("#voronoiFill");
const delaunayStrokeToggle = document.querySelector("#delaunayStrokeToggle");
const delaunayStrokeColor = document.querySelector("#delaunayStroke");
const delaunayFillToggle = document.querySelector("#delaunayFillToggle");
const delaunayFillColor = document.querySelector("#delaunayFill");
const backgroundColor = document.querySelector("#backgroundColor");

function initEvents() {
    // a function that initiate event listeners

    // resolution events
    resInput.addEventListener("change", () => {
        res = parseInt(resInput.value);
        let rm = width % res;
        let dv = width - rm;
        res = dv / res;

        regenerate = true;
    });

    // type events
    typeRange.addEventListener("change", (e) => {
        cellType = parseInt(e.target.value);
        regenerate = true;
    });

    // grid lines events
    gridToggle.addEventListener("change", () => redraw = true);
    gridColor.addEventListener("change", () => redraw = true);

    // voronoi points events
    pointToggle.addEventListener("change", () => redraw = true);
    pointColor.addEventListener("change", () => redraw = true);

    // voronoi cells events
    voronoiStrokeToggle.addEventListener("change", () => redraw = true);
    voronoiStrokeColor.addEventListener("change", () => redraw = true);
    voronoiFillToggle.addEventListener("change", () => redraw = true);
    voronoiFillColor.addEventListener("change", () => redraw = true);

    // delaunay triangles events
    delaunayStrokeToggle.addEventListener("change", () => redraw = true);
    delaunayStrokeColor.addEventListener("change", () => redraw = true);
    delaunayFillToggle.addEventListener("change", () => redraw = true);
    delaunayFillColor.addEventListener("change", () => redraw = true);

    // background color events
    backgroundColor.addEventListener("change", () => redraw = true);

    // regenerate button events
    regenBtn.addEventListener("click", () => regenerate = true);
}