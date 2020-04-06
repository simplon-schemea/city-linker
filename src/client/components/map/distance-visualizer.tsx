import { Point } from "@model/point";
import React from "react";

interface Props {
    center: Point;
    radius: number;
}

export function DistanceVisualizeComponent(props: Props) {

    const { x, y } = props.center;

    return (
        <circle cx={ x } cy={ y } r={ props.radius } style={ { fill: "transparent", stroke: "black" } }/>
    );
}
