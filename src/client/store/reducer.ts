import { DistanceData } from "@model/distance-data";
import { Actions } from "./actions";
import { City } from "@model/city";
import { Point } from "@model/point";
import { ID } from "../math/id";

export type  StateCoordinates = { [k: number]: Point };

export interface Link {
    a: ID;
    b: ID;
}

export interface State {
    distances: DistanceData
    cities: { [k: number]: City }
    map: {
        coordinates: StateCoordinates
        links: Link[]
        scale: number
    }
}

const initialState: State = {
    distances: {},
    cities: {},
    map: {
        coordinates: {},
        links: [],
        scale: 1,
    },
};

export function reducer(state: State = initialState, action: Actions): State {
    switch (action.type) {
        case "[AJAX] Load Data":
            return {
                ...state,
                cities: action.cities,
                distances: action.data,
            };
        case "[DATA] Update Coordinates":
            return {
                ...state,
                map: {
                    ...state.map,
                    coordinates: {
                        ...state.map.coordinates,
                        [action.id]: action.coordinates,
                    },
                },
            };
        case "[DATA] Bulk Coordinates Update":
            return {
                ...state,
                map: {
                    ...state.map,
                    coordinates: {
                        ...state.map.coordinates,
                        ...action.coordinates,
                    },
                },
            };
        case "[DATA] Update Scale":
            return {
                ...state,
                map: {
                    ...state.map,
                    scale: action.scale,
                },
            };
        case "[DATA] Create Link":
            return {
                ...state,
                map: {
                    ...state.map,
                    links: [
                        ...state.map.links,
                        {
                            a: action.link[0],
                            b: action.link[1],
                        },
                    ],
                },
            };
        default:
            return state;
    }
}
