import { ViewBox } from "./viewbox";
import { Point } from "@model/point";
import { useContext, useEffect, useMemo, useState } from "react";
import { SVGContext } from "@components/core/svg-context";
import { hookAttribute } from "./hook";

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

export function useSVGCoordinateMapper() {
    const svg = useContext(SVGContext) as SVGSVGElement;

    if (!svg) {
        throw new Error("SVGContext not provided");
    }

    const [ viewBox, setViewBox ] = useState(() => new ViewBox(svg.viewBox));
    const [ bounds, setSVGBounds ] = useState(() => svg.getBoundingClientRect());

    useEffect(function () {
        function listener() {
            setSVGBounds(svg.getBoundingClientRect());
        }

        const observer = hookAttribute(svg, "viewBox", (oldValue, newValue) => {
            setViewBox(new ViewBox(newValue));
        });

        addEventListener("resize", listener);

        return () => {
            observer.disconnect();
            svg.removeEventListener("resize", listener);
        };
    }, [ svg, setSVGBounds, setViewBox ]);

    return useMemo(function () {
        const mapper = createSvgCoordinateMapper(bounds, viewBox);
        return Object.assign(mapper, { bounds, viewBox, svg });
    }, [ bounds, viewBox ]);

}
