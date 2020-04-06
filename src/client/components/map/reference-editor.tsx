import { connect } from "react-redux";
import { State } from "@store/reducer";
import React, { useEffect, useMemo, useState } from "react";
import { Point } from "@model/point";
import { CityElement } from "./city";
import { hookAttribute } from "../../core/hook";
import { ViewBox } from "../../core/viewbox";
import { createSvgCoordinateMapper } from "../../core/coordinate-mapper";
import { DataService } from "@services/data.service";
import { mapMouseToPoint } from "../../core/mouse";
import { store } from "@store/index";
import { actions } from "@store/actions";
import { DistanceVisualizeComponent } from "./distance-visualizer";

interface CityData {
    id: number
    name: string
    coordinates: Point
}

interface OuterProps {
    root: SVGSVGElement
    cities: [ number, number, number ]
}

interface InnerProps {
    references: CityData[]
    svg: SVGSVGElement
    scale?: number
}

export const ReferenceEditorComponent = connect(
    (state: State, props: OuterProps): InnerProps => ({
        references: props.cities.map(id => ({
            ...state.cities[id],
            coordinates: state.coordinates[id],
        })),
        svg: props.root,
        scale: state.map.scale,
    }),
)(function (props: InnerProps) {
    const placedCities = useMemo(function () {
        return props.references.filter(city => city.coordinates).map(city => city.id);
    }, [ props.references ]);

    const [ cursor, setCursor ] = useState<Point>();
    const [ viewBox, setViewBox ] = useState(() => new ViewBox(props.svg.viewBox));
    const [ SVGBounds, setSVGBounds ] = useState(() => props.svg.getBoundingClientRect());

    useEffect(function () {
        function listener() {
            setSVGBounds(props.svg.getBoundingClientRect());
        }

        const observer = hookAttribute(props.svg, "viewBox", (oldValue, newValue) => {
            setViewBox(new ViewBox(newValue));
        });

        addEventListener("resize", listener);

        return () => {
            observer.disconnect();
            props.svg.removeEventListener("resize", listener);
        };
    }, [ props.svg, setSVGBounds, setViewBox ]);

    const SVGMapper = useMemo(function () {
        return createSvgCoordinateMapper(SVGBounds, viewBox);
    }, [ SVGBounds, viewBox ]);

    useEffect(function () {
        const callbacks: {
            [k in keyof WindowEventMap]?: (event: MouseEvent) => void;
        } = {
            mousemove(event) {
                let position = SVGMapper.coordinates(mapMouseToPoint(event, "client"));

                if (placedCities.length == 2) {
                }

                setCursor(position);
            },
            mouseleave() {
                setCursor(undefined);
            },
        };

        const cleaner = Object.entries(callbacks).map(([ key, callback ]) => {
            props.svg.addEventListener(key, callback as EventListenerOrEventListenerObject);
            return props.svg.removeEventListener.bind(props.svg, key, callback as EventListenerOrEventListenerObject);
        });

        return function () {
            cleaner.forEach(cleaner => cleaner());
        };
    }, [ props.svg, setCursor, placedCities.length ]);

    useEffect(function () {
        if (placedCities.length < 2) {
            return;
        }

        const scale = DataService.computeScale(placedCities[0], placedCities[1]);

        if (scale) {
            DataService.updateScale(scale);
        }
    }, [ placedCities.length >= 2 ]);

    const cursorCity = useMemo(function () {
        const data = props.references[placedCities.length];
        return data && cursor ? <CityElement id={ data.id } position={ cursor } cursorMode={ true }/> : null;
    }, [ placedCities.length, cursor, SVGMapper ]);

    const distanceVisualizer = useMemo(function () {
        if (placedCities.length === 2) {
            return placedCities.map(id => {
                const distance = DataService.getDistance(id, props.references[2].id) / (props.scale || 1);
                const position = DataService.getCoordinates(id);
                return <DistanceVisualizeComponent center={ position } radius={ distance } key={ id }/>;
            });
        }

        return null;
    }, [ placedCities.length === 2, props.references, props.scale, SVGMapper ]);

    useEffect(function () {
        const id = props.references[placedCities.length]?.id;

        function onClick() {
            store.dispatch(actions.updateCoordinates(id, (cursorCity?.props as { position: Point }).position));
        }

        props.svg.addEventListener("click", onClick);
        return () => props.svg.removeEventListener("click", onClick);
    }, [ props.svg, cursorCity ]);

    const cities = useMemo(function () {
        return placedCities.map(id => <CityElement id={ id } key={ id }/>);
    }, [ placedCities ]);

    return (
        <>
            { cities }
            { distanceVisualizer }
            { cursorCity }
        </>
    );
});
