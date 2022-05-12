import { P5Instance } from "react-p5-wrapper";
import { range, pairs} from 'd3';

export const setupSketch = (p5: P5Instance) => {
  // grid dimensionts
  const width = 256
  const height = 200;
  const vertices = width * height;
  const noiseFactor = 0.014;
  const offx = 680/width;    
  const offy = 500/height;   

  const steps = [0, 1, width + 1, width];
  const path = [1, 0, 3, 1, 2, 3];

  p5.setup = () => {
    p5.createCanvas(680, 500);
    p5.background('#fff');
    p5.noiseSeed(4);
    
    p5.translate(offx * 0.5, offy * 0.5);
    console.log(`x ${offx} y ${offy}`)
    //compute noise value for each vertex
    const nvalues = range(vertices).map((vertex: number) => p5.noise((vertex % width) * noiseFactor, p5.int(vertex/width) * noiseFactor));

    // compute + draw contour lines
    const contour = new Contour(nvalues, 22, 0.5, 0.01);
    contour.display();
  };

  class Contour {
    nvals : number[];
    num : number;
    start : number;
    off : number;

    constructor(nvals: number[], num: number, start: number, off: number) {
      this.nvals = nvals;
      this.num = num;
      this.start = start;
      this.off = off;
    }

    display() {
      for (let i = 0; i < this.num; i++) {
        //noise value based on the contour index
        let noiseValue = this.start + i * this.off;
        const lines = this.contour(noiseValue);
        let strokeWeight = 0;
        
        i % 5 === 0
        ? strokeWeight = 1.4
        : strokeWeight = 1

        p5.strokeWeight(strokeWeight);
        p5.stroke(43 + i * 16, 69 + i * 6, 255 - i * 4);
        
        // @ts-ignore
        lines.forEach(([p1, p2], j) => {
          if (i % 5 === 3) {
            if (j % 2 === 0) {
              p5.line(p1.x, p1.y, p2.x, p2.y)
            }
          }
        
          else {
            p5.line(p1.x, p1.y, p2.x, p2.y)
          }
        })
      }
    }

    contour(noiseValue : number) {
      const lines = [];

      for (let i = 0; i < vertices; i++) {
        if(i % width === width - 1 || p5.floor(i / width) === height - 1) {
          continue;
        }

        // find the 4 indices and corresponding 4 noise values of the current face's vertices
        let [f_indices, f_noiseValues] = [[], []];
        
        for (const s of steps) {
          let id = i + s;
          // @ts-ignore
          f_indices.push(id);
          // @ts-ignore
          f_noiseValues.push(this.nvals[id]);
        }

        // store point when its corresponding chosen noise value lies between 1 of the current face's edges
        let points = [];

        if(noiseValue > Math.min(...f_noiseValues) && noiseValue < Math.max(...f_noiseValues)) {
          // traverse each edge of the current face (including diagonal)
          for (const [p1, p2] of pairs(path)) {
            //indices incident to a face's edge
            let [i1, i2] = [f_indices[p1], f_indices[p2]];
            //corresponding noise value
            let [n1, n2] = [this.nvals[i1], this.nvals[i2]]

            //if the chosen noise value lies between the 2 noise values currently explored
            if((noiseValue > n1 && noiseValue < n2) || (noiseValue > n2 && noiseValue < n1)) {
              //compute interpolated point and store it
              let v1 = p5.createVector((i1 % width) * offx, p5.floor(i1 / width) * offy);
              let v2 = p5.createVector((i2 % width) * offx, p5.floor(i2 / width) * offy);
              let point = p5.createVector()
              // @ts-ignore
              point.sub(v2, v1).mult(p5.norm(noiseValue, n1, n2)).add(v1);
              points.push(point);
            }
          }
        }
        if (points.length > 0 && points.length % 2 === 0) {
          
          for (let n = 0; n < points.length; n += 2) {
            // @ts-ignore
            lines.push([points[n], points[n + 1]]);
            }
            continue
          }
          
        for (const pair of pairs(points)) {
          // @ts-ignore
            lines.push(pair);
        }
      }
      return lines
    }
  }
}