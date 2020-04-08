import "./city-collection.scss";
import React, { useEffect, useMemo, useState } from "react";
import { connect, useSelector } from "react-redux";
import { State } from "@store/reducer";
import { CityComponent } from "./city";
import { selectors } from "@store/selectors";
import { DataService } from "@services/data.service";
import { Point } from "@model/point";
import { ID } from "@model/id";
import { City } from "@model/city";
import { store } from "@store/index";
import { actions } from "@store/actions";
import { mapMouseToPoint } from "../../core/mouse";
import { useSVGCoordinateMapper } from "../../core/coordinate-mapper";

interface InnerProps {
    coordinatesList: [ ID, Point ][]
    cityList: City[]
}

export const CityCollectionComponent = connect(
    (state: State): InnerProps => ({
        coordinatesList: selectors.coordinatesList(state),
        cityList: selectors.cityList(state),
    }),
)(function CityCollection(props: InnerProps) {
    const [ cursor, setCursor ] = useState<Point>();

    const mapper = useSVGCoordinateMapper();
    const svg = mapper.svg;

    const state = store.getState();

    useEffect(function () {
        if (props.coordinatesList.length !== props.cityList.length) {
            if (props.coordinatesList.length < 3) {
                throw new Error("At least three cities must be placed");
            }

            DataService.trilaterizeAll();
        }

    }, [ props.coordinatesList, props.cityList ]);

    useEffect(function () {
        const callbacks: { [k in keyof SVGSVGElementEventMap]?: (event: MouseEvent) => void } = {
            mousemove(event) {
                setCursor(mapper.coordinates(mapMouseToPoint(event, "client")));
            },
            mousedown(event) {
                event.preventDefault();
            },
            click(event) {
                if (event.target === svg) {
                    setPeer(null);
                }
            },
        };

        const cleaners = Object.entries(callbacks).map(([ name, callback ]) => {
            svg.addEventListener(name, callback as EventListenerOrEventListenerObject);
            return () => svg.removeEventListener(name, callback as EventListenerOrEventListenerObject);
        });

        return () => cleaners.forEach(fn => fn());
    }, [ setCursor, mapper ]);

    const [ peer, setPeer ] = useState<ID | null>(null);

    const cities = props.coordinatesList.map(([ id, coordinates ], index) => {
        function onClick() {
            if (peer) {
                if (peer !== id) {
                    store.dispatch(actions.createLink(peer, id));
                }
                setPeer(null);
            } else {
                setPeer(id);
            }
        }

        return (
            <CityComponent id={ id } position={ coordinates } key={ id } onClick={ onClick } highlighted={ peer === id }
                           delay={ 100 + index ** 1.2 * 25 } animate={ true }/>
        );
    });

    const currentLink = useMemo(function () {
        if (!peer || !cursor) {
            return null;
        }

        const coordinates = (selectors.coordinatesWithID(peer)(store.getState()));

        return (
            <line x1={ coordinates.x } y1={ coordinates.y }
                  x2={ cursor.x } y2={ cursor.y }
                  style={ { pointerEvents: "none" } }
                  className="link active"
            />
        );
    }, [ peer, cursor ]);

    const links = useSelector(selectors.links);

    const lines = useMemo(function () {
        return links
            .map(link => {
                const [ a, b ] = link.map(id => selectors.coordinatesWithID(id)(state));

                return {
                    ids: link,
                    key: `${ link[0] }-${ link[1] }`,
                    coordinates: {
                        x1: a.x, y1: a.y,
                        x2: b.x, y2: b.y,
                    },
                };
            })
            .map(({ ids, key, coordinates }) => (
                <g className="link-group" key={ key } onClick={ () => store.dispatch(actions.removeLink(ids[0], ids[1])) }>
                    <line { ...coordinates } className="link"/>
                    <line { ...coordinates } className="link"/>
                </g>
            ));
    }, [ links ]);


    return (
        <g className="city-collection-container">
            { lines }
            { currentLink }
            { cities }
        </g>
    );
});
