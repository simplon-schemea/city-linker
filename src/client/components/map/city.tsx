import "./city.scss";
import React, { MouseEventHandler } from "react";
import { Point } from "@model/point";
import { connect } from "react-redux";
import { City } from "@model/city";
import { State } from "@store/reducer";
import { selectors } from "@store/selectors";
import { ID } from "../../math/id";

interface OuterProps {
    id: ID
    highlighted?: boolean
    position?: Point
    radius?: number
    opacity?: number
    onClick?: MouseEventHandler<SVGGElement>
}

interface InnerProps {
    city: City
    position: Point
    radius: number
    opacity?: number
    onClick?: MouseEventHandler<SVGGElement>
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
        });
    },
)(
    function City(props: InnerProps) {
        if (!props.city) {
            debugger;
        }

        return (
            <g opacity={ props.opacity } className="city-container" onClick={ props.onClick }>
                <text x={ props.position.x } textAnchor="middle" y={ props.position.y - 15 }>
                    { props.city.name }
                </text>
                <circle cx={ props.position.x } cy={ props.position.y } r={ props.radius }/>
            </g>
        );
    },
);
