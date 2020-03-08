import { ReferencePoint } from "./model/reference-point";
import { trilaterize } from "./trilaterize";

describe("trilaterize", function () {
    it("should return the correct coordinates", function () {
        const references: [ ReferencePoint, ReferencePoint, ReferencePoint ] = [
            { x: 5, y: 5 , distance: Math.sqrt(52) },
            { x: 5, y: 15, distance: Math.sqrt(32) },
            { x: 20, y: 10, distance: Math.sqrt(122) },
        ];

        const actual = trilaterize(...references);

        expect(actual).toStrictEqual({
            x: 9,
            y: 11,
        });
    });
});
