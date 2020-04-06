import { Compiler } from "webpack";
import { RawSource } from "webpack-sources";
import { JSONDistanceData } from "@model/distance-data";
import GPSData from "../data/gps-coordinates.json";

interface GPSPoint {
    latitude: number
    longitude: number
}

// Shamelessly stolen from StackOverflow
function computeDistanceFromGPSPoint(a: GPSPoint, b: GPSPoint) {
    function deg2rad(deg: number) {
        return deg * (Math.PI / 180);
    }

    const earthRadius = 6371; // Radius of the earth in km
    const dLat = deg2rad(b.latitude - a.latitude);
    const dLon = deg2rad(b.longitude - a.longitude);
    const e =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(a.latitude)) * Math.cos(deg2rad(b.latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(e), Math.sqrt(1 - e));
    const distance = earthRadius * c; // Distance in km

    return distance * 1000;
}


function generateJSON() {
    const cities = Object.entries(GPSData).map(([ name, coordinates ]) => {
        return {
            name,
            coordinates: {
                latitude: coordinates[0],
                longitude: coordinates[1],
            },
        };
    });

    const out: JSONDistanceData = cities.reduce((prev, city) => {
        const distances = cities
            .filter(value => value.name !== city.name)
            .map((curr) => ({
                name: curr.name,
                distance: computeDistanceFromGPSPoint(city.coordinates, curr.coordinates),
            }));

        return Object.assign(prev, { [city.name]: distances });
    }, {});

    return JSON.stringify(out);
}

export class GPSDataWebpackPlugin {
    apply(compiler: Compiler) {
        compiler.hooks.emit.tapAsync(
            "GPSDataWebpackPlugin",
            (compilation, callback) => {
                const assets = compilation.assets;
                assets["assets/distances.json"] = new RawSource(generateJSON());
                callback();
            },
        );
    }
}
