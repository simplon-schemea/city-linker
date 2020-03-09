import "./map.scss";
import React, { Fragment, MouseEvent, useEffect, useMemo, useState } from "react";
import { Point } from "@model/point";
import { DataService } from "@services/data.service";
import { connect } from "react-redux";
import { State } from "@store/reducer";
import { Distance } from "@model/distance-data";
import { CityElement } from "./city";

interface InnerProps {
    references: [ string, string, string ]
    coordinates: State["coordinates"]
    cities: State["cities"]
}

export const MapElement = connect(
    (state: State): InnerProps => {
        return {
            references: [ "Paris", "Brest", "Toulouse" ],
            coordinates: state.coordinates,
            cities: state.cities,
        };
    },
)(
    function (props: InnerProps) {
        useEffect(DataService.loadDistances, []);

        const references = useMemo(function () {
            try {
                return props.references.map(name => Distance.find(name));
            } catch (e) {
                return null;
            }
        }, [ props.cities, props.references ]);

        const coordinates = useMemo(() => Object.entries(props.coordinates), [ props.coordinates ]);

        const [ cursor, setCursor ] = useState<{ id: number, position: Point }>();

        const callbacks = useMemo(function () {
            if (coordinates.length > 2 || !references) {
                setCursor(undefined);

                return {
                    onMouseLeave: undefined,
                    onMouseMove: undefined,
                };
            }

            return {
                onMouseMove(event: MouseEvent) {
                    setCursor({
                        position: {
                            x: event.clientX,
                            y: event.clientY,
                        },
                        id: references[coordinates.length].id,
                    });
                },

                onMouseLeave() {
                    setCursor(undefined);
                },
            };
        }, [ coordinates, references ]);

        const cursorElement = useMemo(function () {
            if (cursor) {
                return <CityElement id={ cursor?.id } position={ cursor?.position } cursorMode={ true }/>;
            } else {
                return undefined;
            }
        }, [ cursor ]);

        const cities = useMemo(function () {
            return coordinates.map(([ id, coordinates ]) => <CityElement key={ id } id={ parseInt(id) } position={ coordinates }/>);
        }, [ coordinates ]);

        if (!references) {
            return (
                <Fragment>
                    Loading...
                </Fragment>
            );
        }

        return (
            <svg className="map-container" onMouseLeave={ callbacks.onMouseLeave } onMouseMove={ callbacks.onMouseMove }>
                { cursorElement }
                { cities }
            </svg>
        );
    },
);

