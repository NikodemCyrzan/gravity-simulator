import { Color, createDisplay, display, DrawObject } from "./DOM";
import { gravitationAcceleration, Vector2 } from "./math/physics";

createDisplay(() => Update());

// last end time [ms]
let frameTime: number = Date.now();
// time difference between frames [s]
let deltaTime: number;
function Update(): void {
    deltaTime = (Date.now() - frameTime) / 1000 * 15;
    // start
    
    // planet
    let direction = planet.settings.options.position.normalize(star.settings.options.position);
    let acceleration = gravitationAcceleration(1e19, planet.settings.options.position.distance(star.settings.options.position) * 3e2, direction);
    planet.property.acceleration.x += acceleration.x * deltaTime;
    planet.property.acceleration.y += acceleration.y * deltaTime;

    planet.x(planet.x() + planet.property.acceleration.x / 3e2);
    planet.y(planet.y() + planet.property.acceleration.y / 3e2);

    // star
    let direction2 = star.settings.options.position.normalize(planet.settings.options.position);
    let acceleration2 = gravitationAcceleration(1e19, star.settings.options.position.distance(planet.settings.options.position) * 3e2, direction2);
    star.property.acceleration.x += acceleration2.x * deltaTime;
    star.property.acceleration.y += acceleration2.y * deltaTime;

    star.x(star.x() + star.property.acceleration.x / 3e2);
    star.y(star.y() + star.property.acceleration.y / 3e2);

    // end
    frameTime = Date.now();
}

let star = new DrawObject({type: "circle", options: {
    radius: 10,
    position: new Vector2(600, 300),
    borderColor: new Color(255, 255, 255),
    borderWidth: 1
}}, {
    acceleration: new Vector2(0, -10)
});

let planet = new DrawObject({type: "circle", options: {
    radius: 10,
    position: new Vector2(300, 300),
    borderColor: new Color(255, 255, 255),
    borderWidth: 1
}}, {
    acceleration: new Vector2(0, 10)
})

display.addDrawObject(star);
display.addDrawObject(planet);