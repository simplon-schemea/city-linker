import { store } from "../store";
import { actions } from "@store/actions";
import { Distance, DistanceData, JSONDistanceData } from "@model/distance-data";
import { Point } from "@model/point";
import { State } from "@store/reducer";
import { City } from "@model/city";

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

                            if (typeof distance.id === "number") {
                                map[distance.id] = distance;
                            }
                        }
                    }

                    store.dispatch(actions.loadJSONData(cities, distanceMap));
                },
            );
    }

    export function getCoordinates(id: number) {
        return store.getState().coordinates[id];
    }

    export function getCity(id: number) {
        return store.getState().cities[id];
    }

    export function getCityByName(name: string) {
        return Object.values<City>(store.getState().cities).find(city => city.name === name);
    }

    export function getDistance(...ids: [ number, number ]) {
        let state: State = store.getState();
        const [ a, b ] = ids;

        return state.distances[a][b].distance;
    }

    export function getScaledDistance(...ids: [ number, number ]) {
        return getDistance(...ids) / getScale();
    }

    export function getDistanceMap(id: number) {
        return store.getState().distances[id];
    }

    export function computeScale(...ids: [ number, number ]) {
        const [ a, b ] = ids.map(id => ({
            id,
            position: store.getState().coordinates[id],
        }));

        if (a.position && b.position) {
            const pixelDistance = Point.distance(a.position, b.position);
            const realDistance = DataService.getDistance(a.id, b.id);

            return realDistance / pixelDistance;
        } else {
            return null;
        }
    }

    export function updateScale(scale: number) {
        if (!scale) {
            throw new Error("unexpected falsy scale");
        }

        if (store.getState().map.scale !== scale) {
            store.dispatch(actions.updateScale(scale));
        }
    }

    export function getScale() {
        return store.getState().map.scale;
    }
}
