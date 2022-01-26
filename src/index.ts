import { Color, createDisplay, display, DrawObject } from "./DOM";
import { gravitationAcceleration } from "./math/physics";

createDisplay(() => Update());

// last end time [ms]
let frameTime: number = Date.now();
// time difference between frames [s]
let deltaTime: number;
function Update(): void {
    deltaTime = (Date.now() - frameTime) / 1000;
    // start
    
    star.property.acceleration += .2;
    star.y(star.y() - star.property.acceleration * deltaTime);

    // end
    frameTime = Date.now();
}

let star = new DrawObject({type: "circle", options: {
    radius: 30,
    position: {
        x: display.width() / 2,
        y: display.height() / 2
    },
    fillColor: new Color(255, 255, 255)
}}, {
    acceleration: 0
});

display.addDrawObject(star);