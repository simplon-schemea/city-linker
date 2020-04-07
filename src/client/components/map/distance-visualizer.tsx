import "./distance-visualizer.scss";
import { Point } from "@model/point";
import React, { CSSProperties } from "react";
import { Transition } from "react-transition-group";
import classNames from "classnames";

interface Props {
    center: Point;
    radius: number;
    duration?: number;
    in?: boolean;
    delay?: number;
    style?: CSSProperties;
    className?: string;
    fill?: string;
}

export function DistanceVisualizeComponent(props: Props) {

    const { x, y } = props.center;

    const style: CSSProperties = {
        fill: props.fill || "transparent",
        stroke: "#333",
        strokeWidth: 3,
        ...props.style,
    };

    if (props.duration) {

        Object.assign(style, {
            transformOrigin: `${ props.center.x }px ${ props.center.y }px`,
            animationDuration: `${ props.duration }ms`,
        });
        if (props.delay) {
            style.animationDelay = `${ props.delay }ms`;
        }
    }

    const circleProps = {
        cx: x,
        cy: y,
        r: props.radius,
        style,
    };

    const className = classNames(props.className, "distance-visualizer");

    return props.duration ? (
        <Transition in={ props.in } timeout={ props.duration + (props.delay || 0) }>
            { state => <circle { ...circleProps } className={ classNames(className, state) }/> }
        </Transition>
    ) : (
        <circle className={ className }/>
    );
}
