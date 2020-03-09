import { store } from "../store";
import { City } from "./city";
import { State } from "@store/reducer";

export interface JSONDistance {
    name: string
    distance: number
}

export interface JSONDistanceData {
    [k: string]: JSONDistance[]
}

export type DistanceData = {
    [k: number]: {
        [k: number]: Distance
    }
}

export interface Distance {
    id: number
    distance: number
}

export namespace Distance {
    export function find(name: string) {
        const state: State = store.getState();

        let city: City | undefined;

        for (let id in state.cities) {
            const current = state.cities[id];
            if (current.name === name) {
                city = current;
            }
        }

        if (!city) {
            throw new Error("city not found");
        }

        return {
            id: city.id,
            distances: state.distances[city.id],
        };
    }
}
