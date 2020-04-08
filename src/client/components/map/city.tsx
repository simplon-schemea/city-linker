import "./city.scss";
import React, { MouseEventHandler, SVGProps } from "react";
import { Point } from "@model/point";
import { connect } from "react-redux";
import { City } from "@model/city";
import { State } from "@store/reducer";
import { selectors } from "@store/selectors";
import { ID } from "@model/id";
import classNames from "classnames";
import { Transition } from "react-transition-group";

interface OuterProps {
    id: ID
    cursor?: boolean
    delay?: number
    highlighted?: boolean
    position?: Point
    radius?: number
    opacity?: number
    onClick?: MouseEventHandler<SVGGElement>
    animate?: boolean
    in?: boolean
}

interface InnerProps {
    city: City
    position: Point
    radius: number
    cursor: boolean
    delay: number
    in: boolean
    highlighted: boolean
    opacity?: number
    onClick?: MouseEventHandler<SVGGElement>
    animate?: boolean
}

export const CityComponent = connect(
    (state: State, props: OuterProps): InnerProps => {
        const city = state.cities[props.id];

        return ({
            city,
            position: props.position || selectors.coordinatesWithID(props.id)(state),
            radius: props.radius || 5,
            opacity: props.opacity || props.cursor ? 0.75 : undefined,
            cursor: props.cursor || false,
            onClick: props.onClick,
            delay: props.delay || 0,
            animate: props.animate,
            in: "in" in props ? props.in as boolean : true,
            highlighted: props.highlighted || false,
        });
    },
)(
    function City(props: InnerProps) {
        if (!props.city) {
            debugger;
        }

        const { x, y } = props.position;

        const gProps: SVGProps<SVGGElement> = {
            opacity: props.opacity,
            className: classNames("city-container", props.highlighted && "highlighted", props.cursor && "cursor"),
            onClick: props.onClick,
            style: {
                transformOrigin: `${ x }px ${ y }px`,
            },
        };

        function delay(value: number) {
            return props.animate ? props.delay + value + "ms" : "";
        }

        const content = (
            <>
                <text x={ x } textAnchor="middle" y={ y - 15 } style={ { animationDelay: delay(250) } }>
                    { props.city.name }
                </text>
                <circle cx={ x } cy={ y } r={ props.radius } style={ { animationDelay: delay(0) } }/>
            </>
        );

        return props.animate ? (
            <Transition in={ props.in } timeout={ 1000 } mountOnEnter={ true } unmountOnExit={ true }>
                { state => (
                    <g  { ...gProps } className={ classNames(gProps.className, state) }>
                        { content }
                    </g>
                ) }
            </Transition>
        ) : (
            <g  { ...gProps }>
                { content }
            </g>
        );
    },
);
