import { store } from "../store";
import { actions } from "@store/actions";
import { Distance, DistanceData, JSONDistanceData } from "@model/distance-data";

export namespace DataService {
    export function loadDistances() {
        fetch("/assets/distances.json")
            .then(value => value.json())
            .then((value: JSONDistanceData) => {
                const IDMap = {} as { [k: string]: number };
                const distanceMap: DistanceData = {};

                const cities = Object.keys(value).map((name, index) => {
                    IDMap[name] = index;
                    return { id: index, name };
                });

                for (let key in value) {
                    if (!value.hasOwnProperty(key)) {
                        continue;
                    }

                    const distances = value[key];
                    const id = IDMap[key];
                    const map: { [k: number]: Distance } = {};
                    distanceMap[id] = map;

                    for (const value of distances) {
                        let distance = {
                            id: IDMap[value.name],
                            distance: value.distance,
                        };

                        if (distance.id) {
                            map[distance.id] = distance;
                        }
                    }
                }

                store.dispatch(actions.loadJSONData(cities, distanceMap));
            });
    }

    export function getCoordinates(id: number) {
        return store.getState().coordinates[id];
    }

    export function getCity(id: number) {
        return store.getState().cities[id];
    }

    export function getDistance(id: number) {
        return store.getState().distances[id];
    }
}
