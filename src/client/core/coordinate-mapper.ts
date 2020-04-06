import { ViewBox } from "./viewbox";
import { Point } from "@model/point";

export function createSvgCoordinateMapper(bounds: DOMRect, viewBox: ViewBox) {
    const aspect = bounds.width / bounds.height;

    let offset: Point;
    let scale: number;

    if (aspect < viewBox.aspect) {
        scale = viewBox.width / bounds.width;
        offset = {
            x: 0,
            y: (viewBox.width / viewBox.aspect / scale - bounds.height) / 2,
        };
    } else if (aspect > viewBox.aspect) {
        scale = viewBox.height / bounds.height;
        offset = {
            x: (viewBox.height * viewBox.aspect / scale - bounds.width) / 2,
            y: 0,
        };
    } else {
        scale = viewBox.width / bounds.width;
        offset = { x: 0, y: 0 };
    }

    return {
        coordinates(position: Point) {
            let newPoint = position;
            newPoint = Point.add(newPoint, offset);
            newPoint = Point.multiply(newPoint, scale);
            return newPoint;
        },
        scale(distance: number) {
            return distance * scale;
        },
    };
}
