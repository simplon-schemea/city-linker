import { connect } from "react-redux";
import { State } from "@store/reducer";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Point } from "@model/point";
import { CityComponent } from "./city";
import { hookAttribute } from "../../core/hook";
import { ViewBox } from "../../core/viewbox";
import { createSvgCoordinateMapper } from "../../core/coordinate-mapper";
import { DataService } from "@services/data.service";
import { mapMouseToPoint } from "../../core/mouse";
import { store } from "@store/index";
import { actions } from "@store/actions";
import { DistanceVisualizeComponent } from "./distance-visualizer";
import { DistanceRadialGradientDefinition } from "./defs/distance-radial-gradient";
import { selectors } from "@store/selectors";
import { SVGContext } from "../core/svg-context";

interface CityData {
    id: number
    name: string
    coordinates: Point
}

interface OuterProps {
    cities: [ number, number, number ]
}

interface InnerProps {
    references: CityData[]
    scale: number
}

const distanceGradientID = "distance-gradient";

export const ReferenceEditorComponent = connect(
    (state: State, props: OuterProps): InnerProps => ({
        references: props.cities.map(id => ({
            ...state.cities[id],
            coordinates: selectors.coordinatesWithID(id)(state),
        })),
        scale: state.map.scale,
    }),
)(function ReferenceEditor(props: InnerProps) {
    const placedCities = useMemo(function () {
        return props.references.filter(city => city.coordinates).map(city => city.id);
    }, [ props.references ]);

    const svg = useContext(SVGContext) as SVGSVGElement;

    if (!svg) {
        throw new Error("SVGContext not provided");
    }

    const [ cursor, setCursor ] = useState<Point>();
    const [ viewBox, setViewBox ] = useState(() => new ViewBox(svg.viewBox));
    const [ SVGBounds, setSVGBounds ] = useState(() => svg.getBoundingClientRect());

    const cursorRef = useRef(cursor);
    cursorRef.current = cursor;

    useEffect(function () {
        function listener() {
            setSVGBounds(svg.getBoundingClientRect());
        }

        const observer = hookAttribute(svg, "viewBox", (oldValue, newValue) => {
            setViewBox(new ViewBox(newValue));
        });

        addEventListener("resize", listener);

        return () => {
            observer.disconnect();
            svg.removeEventListener("resize", listener);
        };
    }, [ svg, setSVGBounds, setViewBox ]);

    const SVGMapper = useMemo(function () {
        return createSvgCoordinateMapper(SVGBounds, viewBox);
    }, [ SVGBounds, viewBox ]);

    useEffect(function () {
        const id = props.references[placedCities.length]?.id;

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
            click() {
                if (!cursorRef.current) {
                    throw new Error("cursor position is undefined");
                }

                store.dispatch(actions.updateCoordinates(id, cursorRef.current));
            },
        };

        const cleaner = Object.entries(callbacks).map(([ key, callback ]) => {
            svg.addEventListener(key, callback as EventListenerOrEventListenerObject);
            return svg.removeEventListener.bind(svg, key, callback as EventListenerOrEventListenerObject);
        });

        return function () {
            cleaner.forEach(cleaner => cleaner());
        };
    }, [ svg, setCursor, placedCities.length, SVGMapper, props.references, cursorRef ]);

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
        return data && cursor ? <CityComponent id={ data.id } position={ cursor } opacity={ 0.75 }/> : null;
    }, [ placedCities.length, cursor, SVGMapper ]);

    const distanceVisualizer = useMemo(function () {
        if (placedCities.length >= 2) {
            const state = store.getState();
            const visible = placedCities.length === 2;

            return placedCities.slice(0, 2).map((id, index, { length }) => {
                const i = visible ? index : (length - index - 1);

                const distance = selectors.scaledDistanceBetween(id, props.references[2].id)(state);
                const position = selectors.coordinatesWithID(id)(state);

                const duration = 400;
                const delay = duration * (visible ? 1.1 : 0.5) * i;

                return (
                    <DistanceVisualizeComponent center={ position } fill={ `url(#${ distanceGradientID })` } key={ id }
                                                radius={ distance } in={ visible } duration={ duration } delay={ delay }
                    />
                );
            });
        }

        return null;
    }, [ placedCities.length === 2, props.references, props.scale, SVGMapper ]);

    const cities = useMemo(function () {
        return placedCities.map(id => <CityComponent id={ id } key={ id }/>);
    }, [ placedCities ]);

    return (
        <>
            <defs>
                <DistanceRadialGradientDefinition id={ distanceGradientID }/>
            </defs>
            { placedCities.length < 3 && cities }
            { distanceVisualizer }
            { cursorCity }
        </>
    );
});
