class Line {
    // just a line object that can save its data
    constructor(p1, p2, site) {
        this.p1 = p1;
        this.p2 = p2;
        if (site) {
            this.site = site;
        } else {
            // the voronoi point this line is generated from
            this.site = null;
        }
    }

    getLength() {
        // the length of the line
        return p5.Vector.dist(this.p1, this.p2);
    }

    getMid() {
        // the mid point of the line
        return createVector((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
    }

    render() {
        // draws the line
        line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    }
}

function intersect(ln1, ln2, bounds = false) {
    // it's just the interpretation of the line-line intersection
    // wikipedia: https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    let x1, x2, x3, x4, y1, y2, y3, y4, x, y;
    x1 = ln1.p1.x;
    y1 = ln1.p1.y;
    x2 = ln1.p2.x;
    y2 = ln1.p2.y;
    x3 = ln2.p1.x;
    y3 = ln2.p1.y;
    x4 = ln2.p2.x;
    y4 = ln2.p2.y;
    let dominator = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));
    let tNumerator = ((x1 - x3) * (y3 - y4)) - ((y1 - y3) * (x3 - x4));
    let uNumerator = ((x1 - x2) * (y1 - y3)) - ((y1 - y2) * (x1 - x3));
    let t = tNumerator / dominator;
    let u = -uNumerator / dominator;
    if (bounds) {
        if (t > 0 && t < 1 && u > 0 && u < 1) {
            x = x1 + (t * (x2 - x1));
            y = y1 + (t * (y2 - y1));
            let v = createVector(x, y);
            return v;
        } else {
            return null;
        }
    } else {
        if (t > 0 && t < 1 && u > 0 && u < 1) {
            x = x1 + (t * (x2 - x1));
            y = y1 + (t * (y2 - y1));
            let v = createVector(x, y);
            return v;
        } else {
            return null;
        }
    }
}