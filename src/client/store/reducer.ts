import { DistanceData } from "@model/distance-data";
import { Actions } from "./actions";
import { City } from "@model/city";
import { Point } from "@model/point";
import { ID } from "@model/id";

export type  StateCoordinates = { [k: number]: Point };

export type Link = [ ID, ID ];

export interface State {
    distances: DistanceData
    cities: { [k: number]: City }
    coordinates: StateCoordinates
    links: Link[]
    scale: number
}

const initialState: State = {
    distances: {},
    cities: {},
    coordinates: {},
    links: [],
    scale: 1,
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
        case "[DATA] Bulk Coordinates Update":
            return {
                ...state,
                coordinates: {
                    ...state.coordinates,
                    ...action.coordinates,
                },
            };
        case "[DATA] Update Scale":
            return {
                ...state,
                scale: action.scale,
            };
        case "[DATA] Create Link":
            return {
                ...state,
                links: [
                    ...state.links,
                    action.link,
                ],
            };

        case "[DATA] Remove Link":
            return {
                ...state,
                links: state.links.filter(ids => ids.some(id => !action.link.includes(id))),
            };
        default:
            return state;
    }
}
