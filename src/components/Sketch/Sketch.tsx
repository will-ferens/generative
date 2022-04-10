import React from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import { setupSketch } from "../../lib/p5/sketch";

export const Sketch = () => {
  return <ReactP5Wrapper sketch={setupSketch} />;
}