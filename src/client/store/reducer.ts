import { DistanceData } from "@model/distance-data";
import { Actions } from "./actions";
import { City } from "@model/city";
import { Point } from "@model/point";

export interface State {
    distances: DistanceData
    cities: { [k: number]: City }
    coordinates: { [k: number]: Point }
}

const initialState: State = {
    distances: {},
    cities: {},
    coordinates: {},
};

export function reducer(state: State = initialState, action: Actions): State {
    switch (action.type) {
        case "[AJAX] Load Data":
            return {
                ...state,
                cities: action.cities,
                distances: action.data,
            };
        case "[UI] Update Coordinates":
            return {
                ...state,
                coordinates: {
                    ...state.coordinates,
                    [action.id]: action.coordinates,
                },
            };
        default:
            return state;
    }
}
