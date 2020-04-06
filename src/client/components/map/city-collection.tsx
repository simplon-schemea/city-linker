import React, { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { State } from "@store/reducer";
import { CityElement } from "./city";
import { ReferencePoint } from "@model/reference-point";
import { DataService } from "@services/data.service";
import { trilaterize } from "../../math/trilaterize";
import { store } from "@store/index";
import { actions } from "@store/actions";

interface InnerProps {
    coordinates: State["coordinates"]
    cities: State["cities"]
}

export const CityCollectionComponent = connect(
    (state: State): InnerProps => ({
        coordinates: state.coordinates,
        cities: state.cities,
    }),
)(function (props: InnerProps) {
    const cities = useMemo(function () {
        return Object.keys(props.coordinates).map(id => (
            <CityElement id={ parseInt(id) } key={ id }/>
        ));
    }, [ props.coordinates ]);

    useEffect(function () {
        const coordinatesKeys = Object.keys(props.coordinates);

        if (coordinatesKeys !== Object.keys(props.cities)) {
            if (coordinatesKeys.length < 3) {
                throw new Error("At least three cities must be placed");
            }

            const references = coordinatesKeys.map(idString => {
                const id = parseInt(idString);

                return {
                    id,
                    coordinates: props.coordinates[id],
                };
            });

            Object.values(props.cities).forEach(({ id }) => {
                if (!props.coordinates[id]) {
                    const refs = references.map(value => {
                        const distance = DataService.getDistance(id, value.id) / DataService.getScale();

                        return {
                            ...value.coordinates,
                            distance,
                        };
                    }) as [ ReferencePoint, ReferencePoint, ReferencePoint ];

                    const trilaterizedCoordinates = trilaterize(...refs);

                    store.dispatch(actions.updateCoordinates(id, trilaterizedCoordinates));
                }
            });
        }

    }, [ props.coordinates, props.cities ]);

    return (
        <>
            { cities }
        </>
    );
});
