import React from "react";
import { Point } from "@model/point";
import { connect } from "react-redux";
import { City } from "@model/city";
import { State } from "@store/reducer";
import { If } from "../logic/if";

interface OuterProps {
    id: number
    position?: Point
    radius?: number
    cursorMode?: boolean
}

interface InnerProps {
    city: City
    position: Point
    radius: number
    opacity?: number
}

export const CityElement = connect(
    (state: State, props: OuterProps): InnerProps => {
        const city = state.cities[props.id];

        return ({
            city,
            position: props.position || state.coordinates[props.id],
            radius: props.radius || 7,
        });
    },
)(
    function (props: InnerProps) {
        return (
            <If condition={ !!props.position }>
                <g opacity={ props.opacity }>
                    <text x={ props.position.x } textAnchor="middle" y={ props.position.y - 15 }>
                        { props.city.name }
                    </text>
                    <circle cx={ props.position.x } cy={ props.position.y } r={ props.radius }/>
                </g>
            </If>
        );
    },
);
