import "./map.scss";
import React, { Fragment, MouseEvent, useEffect, useMemo, useState } from "react";
import { Point } from "@model/point";
import { DataService } from "@services/data.service";
import { connect } from "react-redux";
import { State } from "@store/reducer";
import { Distance } from "@model/distance-data";
import { CityElement } from "./city";
import { mapMouseToPoint } from "@utility/mouse";

interface InnerProps {
    references: [ string, string, string ]
    coordinates: State["coordinates"]
    cities: State["cities"]
}

const references: [ string, string, string ] = [ "Paris", "Brest", "Toulouse" ];

export const MapElement = connect(
    (state: State): InnerProps => {
        return {
            references,
            coordinates: state.coordinates,
            cities: state.cities,
        };
    },
)(
    function (props: InnerProps) {
        useEffect(DataService.loadDistances, []);

        const references = useMemo(function () {
            try {
                return props.references.map(name => Distance.find(name)).map(value => ({
                    ...value,
                    coordinates: props.coordinates[value.id],
                }));
            } catch (e) {
                return null;
            }
        }, [ props.cities, props.references, props.coordinates ]);

        useEffect(function () {
            if (references) {
                const [ a, b ] = references;
                if (a.coordinates && b.coordinates) {
                    const scale = DataService.computeScale(a.id, b.id);
                    if (scale) {
                        DataService.updateScale(scale);
                    }
                }
            }
        }, [ references ]);

        const coordinates = useMemo(() => Object.entries(props.coordinates), [ props.coordinates ]);
        const [ cursor, setCursor ] = useState<{ id: number, position: Point }>();

        const callbacks = useMemo(function () {
            if (coordinates.length > 2 || !references) {
                setCursor(undefined);

                return {};
            }

            return {
                onMouseMove(event: MouseEvent) {
                    setCursor({
                        position: mapMouseToPoint(event, "client"),
                        id: references[coordinates.length].id,
                    });
                },

                onMouseLeave() {
                    setCursor(undefined);
                },
            };
        }, [ coordinates, references, setCursor ]);

        const cursorElement = useMemo(function () {
            if (cursor) {
                return <CityElement id={ cursor.id } position={ cursor.position } cursorMode={ true }/>;
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

