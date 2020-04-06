import { DistanceData } from "@model/distance-data";
import { Actions } from "./actions";
import { City } from "@model/city";
import { Point } from "@model/point";

export interface State {
    distances: DistanceData
    cities: { [k: number]: City }
    coordinates: { [k: number]: Point }
    map: {
        scale?: number
    }
}

const initialState: State = {
    distances: {},
    cities: {},
    coordinates: {},
    map: {},
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
                coordinates: {
                    ...state.coordinates,
                    [action.id]: action.coordinates,
                },
            };
        case "[DATA] Update Scale":
            return {
                ...state,
                map: {
                    ...state.map,
                    scale: action.scale
                }
            };
        default:
            return state;
    }
}
