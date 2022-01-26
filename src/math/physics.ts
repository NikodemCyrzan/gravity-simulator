// calculates gravitational acceleration
export function gravitationAcceleration(objectMass: number, distance: number): number{
    return G * objectMass / (distance ** 2)
}

// gravitational constant
export const G = 6.674301515e-11;