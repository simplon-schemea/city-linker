import "./city.scss";
import React from "react";
import { Point } from "@model/point";
import { connect } from "react-redux";
import { City } from "@model/city";
import { State } from "@store/reducer";
import { selectors } from "@store/selectors";

interface OuterProps {
    id: number
    position?: Point
    radius?: number
    opacity?: number
}

interface InnerProps {
    city: City
    position: Point
    radius: number
    opacity?: number
}

export const CityComponent = connect(
    (state: State, props: OuterProps): InnerProps => {
        const city = state.cities[props.id];

        return ({
            city,
            position: props.position || selectors.coordinatesWithID(props.id)(state),
            radius: props.radius || 7,
            opacity: props.opacity,
        });
    },
)(
    function City(props: InnerProps) {
        if (!props.position) {
            debugger;
        }

        return (
            <g opacity={ props.opacity } className="city-container">
                <text x={ props.position.x } textAnchor="middle" y={ props.position.y - 15 }>
                    { props.city.name }
                </text>
                <circle cx={ props.position.x } cy={ props.position.y } r={ props.radius }/>
            </g>
        );
    },
);
