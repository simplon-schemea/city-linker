import { store } from "../store";
import { actions } from "@store/actions";
import { DistanceData, JSONDistanceData } from "@model/distance-data";
import { Point } from "@model/point";
import { selectors } from "@store/selectors";
import { ReferencePoint } from "@model/reference-point";
import { trilaterize } from "../math/trilaterize";
import { triggerDownload } from "../core/trigger-download";
import { State } from "@store/reducer";

export namespace DataService {


    export function loadDistances() {
        fetch("/assets/distances.json")
            .then(value => value.json())
            .then((value: JSONDistanceData) => {
                    const IDMap = {} as { [k: string]: number };
                    const distanceMap: DistanceData = {};

                    const cities = Object.keys(value).reduce((prev, name, index) => {
                        const id = index + 1;
                        IDMap[name] = id;
                        return Object.assign(prev, { [id]: { id, name } });
                    }, {});

                    for (let key in value) {
                        if (!value.hasOwnProperty(key)) {
                            continue;
                        }

                        const distances = value[key];
                        const id = IDMap[key];
                        const map: { [k: number]: number } = {};
                        distanceMap[id] = map;

                        for (const value of distances) {
                            const id = IDMap[value.name];

                            if (id) {
                                map[id] = value.distance;
                            }
                        }
                    }

                    store.dispatch(actions.loadJSONData(cities, distanceMap));
                },
            );
    }

    export function generateDataJSON(indent?: number) {
        const state: State = store.getState();

        const data = { ...state };
        delete data.distances;

        return JSON.stringify(data, null, indent);
    }

    export function computeScale(...ids: [ number, number ]) {
        const state = store.getState();

        const [ a, b ] = ids.map(id => ({
            id,
            position: selectors.coordinatesWithID(id)(state),
        }));

        if (a.position && b.position) {
            const pixelDistance = Point.distance(a.position, b.position);
            const realDistance = selectors.distanceBetween(a.id, b.id)(state);

            return realDistance / pixelDistance;
        } else {
            return null;
        }
    }

    export function updateScale(scale: number) {
        if (!scale) {
            throw new Error("unexpected falsy scale");
        }

        if (store.getState().scale !== scale) {
            store.dispatch(actions.updateScale(scale));
        }
    }

    export function trilaterizeAll() {
        const state = store.getState();

        const coordinatesList = selectors.coordinatesList(state);
        const cityList = selectors.cityList(state);

        const references = coordinatesList.map(([ id, coordinates ]) => ({
            id,
            coordinates,
        }));

        const coordinates = Object.values(cityList)
            .filter(city => !selectors.coordinatesWithID(city.id)(state))
            .reduce((prev, { id }) => {
                const refs = references.map(value => {
                    const distance = selectors.scaledDistanceBetween(id, value.id)(store.getState());

                    return {
                        ...value.coordinates,
                        distance,
                    };
                }) as [ ReferencePoint, ReferencePoint, ReferencePoint ];

                const trilaterizedCoordinates = trilaterize(...refs);

                return Object.assign(prev, { [id]: trilaterizedCoordinates });
            }, {});

        store.dispatch(actions.bulkUpdateCoordinates(coordinates));
    }
}


(window as any).exportJSON = () => {
    triggerDownload(
        DataService.generateDataJSON(2),
        {
            filename: "data.json",
            mimetype: "text/json",
        },
    );
};
