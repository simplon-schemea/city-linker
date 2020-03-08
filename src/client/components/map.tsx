import "./map.scss";
import React, { MouseEvent, useCallback, useState, WheelEvent } from "react";
import { Point } from "../model/point";

function createCityElement(cursor: Cursor) {
    return <circle cx={ cursor.x } cy={ cursor.y } r={ cursor.radius } opacity={ 0.25 }/>;
}

interface Cursor extends Point {
    radius: number
}

export function Map() {
    const [ cursor, setCursor ] = useState<Cursor>();

    const onMouseMove = useCallback(function (event: MouseEvent) {
        setCursor({
            x: event.clientX,
            y: event.clientY,
            radius: cursor?.radius || 10,
        });
    }, [ cursor ]);

    const onMouseLeave = useCallback(function () {
        setCursor(undefined);
    }, [ cursor ]);

    const onWheel = useCallback(function (event: WheelEvent) {
        if (cursor) {
            console.log(event.deltaX, event.deltaY, event.deltaZ);
            setCursor({
                ...cursor,
                radius: Math.max(cursor.radius - event.deltaY / 100, 1),
            });
        }
    }, [ cursor ]);

    return (
        <svg className="map-container" onMouseLeave={ onMouseLeave } onMouseMove={ onMouseMove } onWheel={ onWheel }>
            { cursor && createCityElement(cursor) }
        </svg>
    );
}
