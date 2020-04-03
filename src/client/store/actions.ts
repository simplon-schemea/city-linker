import { Action } from "redux";
import { DistanceData } from "@model/distance-data";
import { City } from "@model/city";
import { Point } from "@model/point";

function createAction<Type extends string>(type: Type): Action<Type>;
function createAction<Type extends string, Props>(type: Type, props: Props): Action<Type> & Props;
function createAction(type: string, props = {}) {
    return {
        type,
        ...props,
    };
}

export const actions = {
    loadJSONData(cities: City[], data: DistanceData) {
        return createAction("[AJAX] Load Data", {
            cities,
            data,
        });
    },

    updateCoordinates(id: number, coordinates: Point) {
        return createAction("[DATA] Update Coordinates", { id, coordinates });
    },

    updateScale(scale: number) {
        return createAction("[DATA] Update Scale", { scale });
    },
};


export type ActionCreators = typeof actions;
export type Actions = ReturnType<ActionCreators[keyof ActionCreators]>;
