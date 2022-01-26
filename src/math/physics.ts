// calculates gravitational acceleration
export function gravitationAcceleration(objectMass: number, distance: number, direction: Vector2): Vector2 {
    let acceleration = G * objectMass / (distance ** 2);
    return new Vector2(acceleration * direction.x, acceleration * direction.y);
}

// gravitational constant
export const G = 6.674301515e-11;

// vector with 2 axis
export class Vector2 {
    x: number;
    y: number;
    normalized: () => Vector2 = () => {
        let distance = this.distance(new Vector2(0, 0));
        return new Vector2(this.x / distance, this.y / distance);
    };

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    distance(secondVector: Vector2): number {
        return Math.sqrt((this.x - secondVector.x)**2 + (this.y - secondVector.y)**2);
    }

    normalize(secondVector: Vector2): Vector2 {
        let distance = this.distance(secondVector);
        return new Vector2((secondVector.x - this.x) / distance, (secondVector.y - this.y) / distance);
    }

    clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }
}