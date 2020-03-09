import React, { Fragment, useCallback } from "react";
import { Point } from "@model/point";
import { connect } from "react-redux";
import { City } from "@model/city";
import { State } from "@store/reducer";
import { store } from "@store/index";
import { actions } from "@store/actions";

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
    cursorMode?: boolean
}

export const CityElement = connect(
    (state: State, props: OuterProps): InnerProps => {
        const city = state.cities[props.id];

        return ({
            city,
            position: props.position || {} as Point,
            radius: props.radius || 7,
        });
    },
)(
    function (props: InnerProps) {
        const onClick = useCallback(function (event: React.MouseEvent) {
            if (props.cursorMode) {
                store.dispatch(actions.updateCoordinates(props.city.id, {
                    x: event.clientX,
                    y: event.clientY,
                }));
            }
        }, [ props.cursorMode, props.city.id ]);

        return (
            <Fragment>
                <g opacity={ props.cursorMode ? 0.5 : undefined }>
                    <text x={ props.position.x } textAnchor="middle" y={ props.position.y - 15 }>
                        { props.city.name }
                    </text>
                    <circle cx={ props.position.x } cy={ props.position.y } r={ props.radius } onClick={ onClick }/>
                </g>
            </Fragment>
        );
    },
);
