export interface Point {
    x: number;
    y: number;
}

namespace Point {
    export function distance(a: Point, b: Point) {
        return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    }
}
