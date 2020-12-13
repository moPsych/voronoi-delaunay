class Cell {
    constructor(x, y, l, type) {
        // length of the cell
        this.l = l;
        // minimum coordinates of the cell
        this.sx = x;
        this.sy = y;
        // maximum coordinates of the cell
        this.ex = this.sx + this.l;
        this.ey = this.sy + this.l;
        // random point in the cell (the voronoi site)
        this.s = createVector(random(this.sx, this.ex), random(this.sy, this.ey));
        // voronoi or delaunay or both
        this.type = type;
        // voronoi edges list
        this.edges = [];
        // voronoi polygon vertices list
        this.voronoiVertices = [];
        // delaunay triangle vertices list
        this.delaunayVertices = [];
    }

    makeVoronoiEdge(v1, v2) {
        // this function finds the mid point between two cell sites and create a voronoi edge (side) from this point
        // this edge is thin added to the edges array to use it to make the final polygon
        // notice the "site" variable. it is the cell (site) that caused this edge to happen
        // this "site" will be used later to create the delaunay diagram
        let site = v2.copy();
        let mid = createVector((v1.x + v2.x) / 2, (v1.y + v2.y) / 2);
        let dir1 = p5.Vector.sub(v1, v2).rotate(PI / 2);
        let dir2 = p5.Vector.sub(v2, v1).rotate(PI / 2);
        dir1.normalize().setMag(width);;
        dir2.normalize().setMag(height);;
        let l1 = mid.copy().add(dir1);
        let l2 = mid.copy().add(dir2);
        this.edges.push(new Line(l1, l2, site));
    }

    makeVoronoiPolygon() {
        // all potential edges are tested here to determine which one would be the edge of the cell
        // the below loop finds the intersection points between all the edges and push them to the vertices array
        // and the site properties of the two intersecting lines are passed to this vertex as properties of it
        for (let i = 0; i < this.edges.length; i++) {
            let l1 = this.edges[i];
            for (let j = 0; j < this.edges.length; j++) {
                let l2 = this.edges[j];
                if (i !== j) {
                    let p = intersect(l1, l2, true);
                    if (p) {
                        p.site1 = l1.site;
                        p.site2 = l2.site;
                        this.voronoiVertices.push(p);
                    }
                }
            }
        }

        // to determine the vertices of the voronoi polygon we make a line between cell's site and each vertex
        // if this line does not intersect with any of the `this.edges` lines we include this vertex and push it to temp array
        // if it does intersect we do not include this vertex
        // after this process is finished we make `this.voronoiVertices = tempArray`
        let tmpVecs = [];
        for (let p of this.voronoiVertices) {
            let tempLine = new Line(this.s, p);
            let includePoint = true;
            for (let ln of this.edges) {
                let intrsection = intersect(ln, tempLine, true);
                if (intrsection) {
                    // the `> .000001` is used here to eliminate floating point precision problems
                    if (p5.Vector.dist(intrsection, p) > .000001) {
                        includePoint = false;
                        break;
                    }
                }
            }
            if (includePoint) {
                tmpVecs.push(p);
            }
        }
        this.voronoiVertices = tmpVecs;

        // this array now have duplicate vertices (2 copies of each vertex)
        // we sort these vertices by their distance from cell's site
        // after they are sorted we filter out each element with odd index to remove duplicates
        // then we sort them again by their angle according to cell's site
        // this sort will make them in order to connect them with lines without intersections
        this.voronoiVertices.sort((a, b) => p5.Vector.dist(this.s, a) - p5.Vector.dist(this.s, b));
        this.voronoiVertices = this.voronoiVertices.filter((value, index) => {
            return index % 2 === 0;
        });
        this.voronoiVertices.sort((a, b) => {
            return (p5.Vector.sub(this.s, a).heading() - p5.Vector.sub(this.s, b).heading());
        });
    }

    makeDelaunayTriangle() {
        // we check every vertex of the `this.voronoiVertices` array
        // each vertex has two site properties;
        // these two sites are pushed to the `this.delaunayVertices` array
        for (let v of this.voronoiVertices) {
            this.delaunayVertices.push(v.site1);
            this.delaunayVertices.push(v.site2);
        }

        // again `this.delaunayVertices` array now have duplicate vertices (2 copies of each vertex)
        // we sort these vertices by their distance from cell's site
        // after they are sorted we filter out each element with odd index to remove duplicates
        // then we sort them again by their angle according to cell's site
        // this sort will make them in order to connect them with lines without intersections
        this.delaunayVertices.sort((a, b) => p5.Vector.dist(this.s, a) - p5.Vector.dist(this.s, b));
        this.delaunayVertices = this.delaunayVertices.filter((value, index) => {
            return index % 2 === 0;
        });
        this.delaunayVertices.sort((a, b) => {
            return (p5.Vector.sub(this.s, a).heading() - p5.Vector.sub(this.s, b).heading());
        });
    }

    renderVoronoiPolygon() {
        // assign color using coloring function
        // draw a polygon through the vertices
        colorVoronoiPolygon();
        beginShape();
        for (let v of this.voronoiVertices) {
            vertex(v.x, v.y);
        }
        endShape(CLOSE);
    }

    renderDelaunayTriangle() {
        // assign color using coloring function
        // draw a triangle through the cells's site a vertex from the array and the vertex after it
        for (let i = 0; i < this.delaunayVertices.length; i++) {
            let p = this.delaunayVertices[i];
            let pNext = this.delaunayVertices[(i + 1) % this.delaunayVertices.length];
            colorDelaunayTriangle()
            beginShape();
            vertex(this.s.x, this.s.y);
            vertex(p.x, p.y);
            vertex(pNext.x, pNext.y);
            endShape(CLOSE);
        }
    }

    render() {
        // this function simply combines the above two functions
        if (this.type === 0) {
            this.renderVoronoiPolygon();
        } else if (this.type === 1) {
            this.renderDelaunayTriangle();
        } else if (this.type === 2) {
            this.renderVoronoiPolygon();
            this.renderDelaunayTriangle();
        }
        // draw the site of the cell as a point if needed
        if (colorCellPoint()) point(this.s.x, this.s.y);
    }
}

