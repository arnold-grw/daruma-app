
export interface PointData{
    x: number;
    y: number;
}

export class Point {
    //ggf width, color
    constructor(
        public x: number,
        public y: number
    ) {}

    distanceTo(other: Point): number {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }

    //ggf transform() (translate, rotate, scale)
}


export interface LineData{
    //id: string;
    points: PointData[];
    width?: number;
}

export class Line {
    //ggf width, origin, color
    constructor(
        public points: Point[] = [],
        public width: number = 0.5
    ) {}

    addPoint(point: Point): void {
        this.points.push(point);
    }

    //ggf transform() (translate, rotate, scale) -> für punkte anwenden
}


export interface DrawingData{
    //id: string;
    lines: LineData[];
}

export class Drawing {
    constructor(
        public lines: Line[] = []
    ) {}

    addLine(line: Line): void {
        this.lines.push(line);
    }
    //ggf transform() (translate, rotate, scale) -> für linien anwenden
}