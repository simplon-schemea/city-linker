import { Action } from "redux";
import { DistanceData } from "@model/distance-data";
import { Point } from "@model/point";
import { Link, State, StateCoordinates } from "./reducer";
import { ID } from "@model/id";

function createAction<Type extends string>(type: Type): Action<Type>;
function createAction<Type extends string, Props>(type: Type, props: Props): Action<Type> & Props;
function createAction(type: string, props = {}) {
    return {
        type,
        ...props,
    };
}

export const actions = {
    loadJSONData(cities: State["cities"], data: DistanceData) {
        return createAction("[AJAX] Load Data", {
            cities,
            data,
        });
    },

    updateCoordinates(id: number, coordinates: Point) {
        return createAction("[DATA] Update Coordinates", { id, coordinates });
    },

    bulkUpdateCoordinates(coordinates: StateCoordinates) {
        return createAction("[DATA] Bulk Coordinates Update", { coordinates });
    },

    updateScale(scale: number) {
        return createAction("[DATA] Update Scale", { scale });
    },

    createLink(a: ID, b: ID) {
        return createAction("[DATA] Create Link", { link: [ a, b ] as Link });
    },

    removeLink(a: ID, b: ID) {
        return createAction("[DATA] Remove Link", { link: [ a, b ] as Link });
    },
};


export type ActionCreators = typeof actions;
export type Actions = ReturnType<ActionCreators[keyof ActionCreators]>;
