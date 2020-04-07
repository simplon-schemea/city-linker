import { Point } from "@model/point";
import React, { CSSProperties } from "react";

interface Props {
    center: Point;
    radius: number;
    style?: CSSProperties;
    className?: string;
    fill?: string;
}

export function DistanceVisualizeComponent(props: Props) {

    console.log(props);

    const { x, y } = props.center;

    const style: CSSProperties = {
        fill: props.fill || "transparent",
        stroke: "#333",
        strokeWidth: 3,
        ...props.style,
    };
    console.log(style);

    return (
        <circle className={ props.className } cx={ x } cy={ y } r={ props.radius } style={ style }/>
    );
}
