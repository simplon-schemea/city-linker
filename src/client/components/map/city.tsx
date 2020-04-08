import "./city.scss";
import React, { CSSProperties, MouseEventHandler, SVGProps } from "react";
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
    delay?: number
    highlighted?: boolean
    position?: Point
    radius?: number
    opacity?: number
    onClick?: MouseEventHandler<SVGGElement>
    animate?: boolean
}

interface InnerProps {
    city: City
    position: Point
    radius: number
    delay: number
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
            radius: props.radius || 7,
            opacity: props.opacity,
            onClick: props.onClick,
            delay: props.delay || 0,
            animate: props.animate,
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
            className: "city-container",
            onClick: props.onClick,
        };

        if (props.animate) {
            Object.assign(gProps, {
                style: {
                    ...gProps.style,
                    transformOrigin: `${ x }px ${ y }px`,
                },
            } as CSSProperties);
        }

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
            <Transition in={ true } timeout={ 1000 } mountOnEnter={ true } unmountOnExit={ true }>
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
