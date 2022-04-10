import { P5Instance } from "react-p5-wrapper";

export const setupSketch = (p5: P5Instance) => {
  p5.setup = () => p5.createCanvas(600, 400);

  p5.draw = () => {

  }
}