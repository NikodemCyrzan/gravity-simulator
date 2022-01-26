import { v4 as uuidv4} from "uuid";
import { Vector2 } from "./math/physics";

export let display: Display = null;

// creates new display instance
export function createDisplay(updateLoop: () => void): void {
    display = new Display(updateLoop);
}

// options for DrawObject for circle
type CircleOptions = {
    radius: number,
    position: Vector2,
    fillColor?: Color, 
    borderWidth?: number, 
    borderColor?: Color
}

// options for DrawObject for rectangle
type RectangleOptions = {
    width: number,
    height: number,
    position: Vector2,
    fillColor?: Color,
    borderWidth?: number,
    borderColor?: number
}

// options for DrawObject for path
type PathOptions = {
    points: Array<Vector2>,
    fillColor?: Color,
    width?: number,
    position?: Vector2
}

export class DrawObject {
    // id of object in display buffer
    bufferId: string = uuidv4();
    // draw settings
    settings: {type: "circle", options: CircleOptions} | {type: "rectangle", options: RectangleOptions} | {type: "path", options: PathOptions};
    // custom property
    property: any | undefined;

    constructor(settings: {type: "circle", options: CircleOptions} | {type: "rectangle", options: RectangleOptions} | {type: "path", options: PathOptions}, property?: any) {
        this.settings = settings;
        this.property = property;
    }

    // changes x position
    x(x?: number): number {
        if (x !== undefined)
            this.settings.options.position.x = x;
        return this.settings.options.position.x;
    }

    // changes y position
    y(y?: number): number {
        if (y !== undefined)
            this.settings.options.position.y = y;
        return this.settings.options.position.y;
    }

    // draws object
    draw(context: CanvasRenderingContext2D): void {
        switch (this.settings.type) {
            case "circle":
                {
                    context.beginPath();
                    const { position, fillColor, radius, borderWidth, borderColor } = this.settings.options;

                    context.arc(position.x, position.y, radius, 0, 2 * Math.PI);
                    if (fillColor !== undefined){
                        context.fillStyle = fillColor.toString();
                        context.fill();
                    }
                    else
                        context.fillStyle = "#000";
                    context.lineWidth = borderWidth ?? 0;
                    if (borderColor !== undefined){
                        context.strokeStyle = borderColor.toString();
                        context.stroke();
                    }
                    else
                        context.strokeStyle = "#000";
                    context.closePath();
                }
                break;
            case "path":
                {
                    const { points, width, fillColor } = this.settings.options;

                    context.lineWidth = width;
                    if (fillColor !== undefined)
                        context.strokeStyle = fillColor.toString();
                    else
                        context.fillStyle = "#000";
                    
                    context.beginPath();
                    context.moveTo(points[0].x, points[0].y);
                    for (let i = 1; i < points.length; i++)
                        context.lineTo(points[i].x, points[i].y);

                    context.stroke();
                    context.closePath();
                }
                break;
            default:
                break;
        }
    }
}

export class Color {
    red: number; 
    green: number; 
    blue: number;
    alpha: number | undefined;

    constructor(red: number, green: number, blue: number, alpha?: number) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    toString(): string {
        return `rgb(${this.red}, ${this.green}, ${this.blue}${this.alpha === undefined ? "" : ", " + this.alpha})`;
    }
};

class Display {
    // canvas DOM instance
    canvas: HTMLCanvasElement = document.getElementById("display") as HTMLCanvasElement;
    // canvas context
    context: CanvasRenderingContext2D = this.canvas.getContext("2d");
    // gets canvas width
    width: () => number = () => this.canvas.width;
    // gets canvas height
    height: () => number = () => this.canvas.height;

    // custom update loop
    updateLoop: () => void;
    // things that will be displayed in next frame
    private displayBuffer = {};

    constructor(updateLoop: () => void) {
        window.addEventListener("resize", () => this.resize());
        this.resize();
        this.updateLoop = updateLoop;
        setInterval(() => this.Update(), 1);
    }

    // canvas update loop
    private Update() {
        this.updateLoop();

        this.context.clearRect(0, 0, this.width(), this.height());

        const drawObjects = Object.values(this.displayBuffer);
        for (let i = 0; i < drawObjects.length; i++)
            (drawObjects[i] as DrawObject).draw(this.context);
    }
    
    // changes resolution of canvas
    resize(): void {
        this.canvas.width = document.documentElement.clientWidth;
        this.canvas.height = document.documentElement.clientHeight;
    }

    // adds draw object to display buffer
    addDrawObject(drawObject: DrawObject) {
        this.displayBuffer[drawObject.bufferId] = drawObject;
    }

    // removes draw object from display buffer
    removeDrawObject(id: string) {
        delete this.displayBuffer[id];
    }
}
