import { Vector } from 'p5';
import { OpenSimplexNoise } from './simplex';
import { P5Instance } from 'react-p5-wrapper';

export const setupSketch = (p5: P5Instance) => {
  // https://discourse.processing.org/t/2d-topographical-map/19260
  // https://editor.p5js.org/solub/sketches/I3V99NXlX
  // https://blog.bruce-hill.com/meandering-triangles

  const field : any = [];
  const width = 680
  const height = 500;

  let rez = 3;
  let cols = 1 + width / rez;
  let rows = 1 + height / rez;
  let increment = 0.1;
  let zoff = 0;
  let noise: any;

  


  p5.setup = () => {
    p5.createCanvas(680, 500);

    noise = new OpenSimplexNoise(Date.now());
    cols = 1 + width / rez;
    rows = 1 + height / rez;
    for(let i = 0; i < cols; i++) {
      let k = [];
      for(let j = 0; j < rows; j++) {
        k.push(0);
      }
      // @ts-ignore
      field.push(k);
    }
  };

  p5.mousePressed = ( ) => {
    
  }

  p5.draw = () => {
     p5.background(0); 
    let xoff = 0;
    for (let i = 0; i < cols; i++) {
      xoff += increment;
      let yoff = 0;
      for (let j = 0; j < rows; j++) {
        field[i][j] = p5.float(noise.noise3D(xoff, yoff, zoff));
        yoff += increment;
      }
    }
    zoff += 0.03;

   
     for (let i = 0; i < cols - 1; i++) {
      for (let j = 0; j < rows - 1; j++) {
        let x = i * rez;
        let y = j * rez;
        let a = p5.createVector(x + rez * 0.5, y);
        let b = p5.createVector(x + rez, y + rez * 0.5);
        let c = p5.createVector(x + rez * 0.5, y + rez);
        let d = p5.createVector(x, y + rez * 0.5);
        let state = getState(
          p5.ceil(field[i][j]),
          p5.ceil(field[i + 1][j]),
          p5.ceil(field[i + 1][j + 1]),
          p5.ceil(field[i][j + 1])
        );
        p5.stroke(255);
        p5.strokeWeight(1);
        switch (state) {
          case 1:
            drawLine(c, d, p5);
            break;
          case 2:
            drawLine(b, c, p5);
            break;
          case 3:
            drawLine(b, d, p5);
            break;
          case 4:
            drawLine(a, b, p5);
            break;
          case 5:
            drawLine(a, d, p5);
            drawLine(b, c, p5);
            break;
          case 6:
            drawLine(a, c, p5);
            break;
          case 7:
            drawLine(a, d, p5);
            break;
          case 8:
            drawLine(a, d, p5);
            break;
          case 9:
            drawLine(a, c, p5);
            break;
          case 10:
            drawLine(a, b, p5);
            drawLine(c, d, p5);
            break;
          case 11:
            drawLine(a, b, p5);
            break;
          case 12:
            drawLine(b, d, p5);
            break;
          case 13:
            drawLine(b, c, p5);
            break;
          case 14:
            drawLine(c, d, p5);
            break;
        }
      }
    }
  }
}

const drawLine = (v1: Vector, v2: Vector, p5: P5Instance) => {
  p5.line(v1.x, v1.y, v2.x, v2.y);
}

const getState = (a:number, b:number, c:number, d:number) => {
  return a * 8 + b * 4 + c * 2 + d * 1;
}