import React, { useEffect, useMemo, useState } from "react";
import { connect, useSelector } from "react-redux";
import { State } from "@store/reducer";
import { CityComponent } from "./city";
import { selectors } from "@store/selectors";
import { DataService } from "@services/data.service";
import { Point } from "@model/point";
import { ID } from "../../math/id";
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
        function onClick(event: MouseEvent) {
            setCursor(mapper.coordinates(mapMouseToPoint(event, "client")));
        }

        svg.addEventListener("mousemove", onClick);

        return () => svg.removeEventListener("mousemove", onClick);
    }, [ setCursor, mapper ]);

    const [ peer, setPeer ] = useState<ID | null>(null);

    const cities = props.coordinatesList.map(([ id, coordinates ]) => {
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
            <CityComponent id={ id } position={ coordinates } key={ id } onClick={ onClick } highlighted={ peer === id }/>
        );
    });

    const currentLink = useMemo(function () {
        if (typeof peer !== "number" || !cursor) {
            return null;
        }

        const coordinates = (selectors.coordinatesWithID(peer)(store.getState()));

        return (
            <line x1={ coordinates.x } y1={ coordinates.y }
                  x2={ cursor.x } y2={ cursor.y } stroke="black" strokeWidth={ 2 }
                  style={ { pointerEvents: "none" } }
            />
        );
    }, [ peer, cursor ]);

    const links = useSelector(selectors.links);

    const lines = useMemo(function () {
        return links
            .map(link => {
                const a = selectors.coordinatesWithID(link.a)(state);
                const b = selectors.coordinatesWithID(link.b)(state);

                return {
                    key: `${ link.a }-${ link.b }`,
                    x1: a.x, y1: a.y,
                    x2: b.x, y2: b.y,
                };
            })
            .map(props => (
                <line { ...props } stroke="black" strokeWidth={ 2 }/>
            ));
    }, [ links ]);


    return (
        <>
            { lines }
            { cities }
            { currentLink }
        </>
    );
});
