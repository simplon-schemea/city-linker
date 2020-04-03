import { ReferencePoint } from "@model/reference-point";
import { Point } from "@model/point";

export function trilaterize(...references: [ ReferencePoint, ReferencePoint, ReferencePoint ]): Point {
    const [ A, B, C ] = references;

    const r1 = A.distance ** 2 - B.distance ** 2 - A.x ** 2 + B.x ** 2 - A.y ** 2 + B.y ** 2;
    const r2 = B.distance ** 2 - C.distance ** 2 - B.x ** 2 + C.x ** 2 - B.y ** 2 + C.y ** 2;

    const e11 = 2 * (B.x - A.x);
    const e12 = 2 * (B.y - A.y);

    const e21 = 2 * (C.x - B.x);
    const e22 = 2 * (C.y - B.y);

    const det = e11 * e22 - e12 * e21;

    return {
        x: (r1 * e22 - e12 * r2) / det,
        y: (e11 * r2 - r1 * e21) / det,
    };
}
