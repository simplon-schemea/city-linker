import { State } from "./reducer";
import { ID } from "../math/id";
import { createSelector } from "reselect";
import { Point } from "@model/point";

const selectors = {
    coordinates(state: State) {
        return state.map.coordinates;
    },
    map(state: State) {
        return state.map;
    },
    cities(state: State) {
        return state.cities;
    },
    links(state: State) {
        return state.map.links;
    },
    distances(state: State) {
        return state.distances;
    },
    scale(state: State) {
        return state.map.scale;
    },
};

const composedSelectors = Object.assign(selectors, {
    coordinatesWithID(id: ID) {
        return (state: State) => selectors.coordinates(state)[id];
    },
    coordinatesList: createSelector(
        selectors.coordinates,
        coordinates => Object.entries(coordinates).map(([ id, coordinates ]): [ ID, Point ] => [ parseInt(id), coordinates ]),
    ),
    cityList: createSelector(selectors.cities, cities => Object.values(cities)),
    distanceBetween(a: ID, b: ID) {
        return (state: State) => selectors.distances(state)[a][b];
    },
    scaledDistanceBetween(a: ID, b: ID) {
        return (state: State) => selectors.distances(state)[a][b] / selectors.scale(state);
    },
    cityWithName(name: string) {
        return createSelector(selectors.cities, cities => Object.values(cities).find(city => city.name === name));
    },
});

export { composedSelectors as selectors };
