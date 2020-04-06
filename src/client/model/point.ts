export interface Point {
    x: number;
    y: number;
}

export namespace Point {
    export function distance(a: Point, b: Point) {
        return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    }

    export function multiply(point: Point, scalar: number) {
        return {
            x: point.x * scalar,
            y: point.y * scalar,
        };
    }

    export function add(...points: Point[]) {
        return points.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }));
    }
}
