import * as path from "path";
import * as fs from "fs";
import { DataSource } from "./data-source";
import { Compiler } from "webpack";
import { RawSource } from "webpack-sources";
import { JSONDistanceData, JSONDistance } from "@model/distance-data";

function parseDistance(value: string) {
    const units = {
        km: 10 ** 3,
        m: 1,
    };

    const match = /(\w+$)/.exec(value);

    if (match) {
        const unit = match[1];
        const factor = units[unit as keyof typeof units];

        if (!factor) {
            throw new Error("unsupported unit: " + unit);
        }

        return parseFloat(value) * factor;
    } else {
        throw new Error("invalid distance: " + value);
    }

}

function fuse() {
    const out: JSONDistanceData = {};
    const dir = path.join(__dirname, "../data");

    for (let file of fs.readdirSync(dir)) {
        const filepath = path.join(dir, file);
        const distances: DataSource.Distance[] = JSON.parse(fs.readFileSync(filepath, "utf-8"));

        for (let distance of distances) {
            const entries = out[distance.De] || (out[distance.De] = [] as JSONDistance[]);

            entries.push({
                name: distance.À,
                distance: parseDistance(distance.Distance),
            });
        }
    }

    return JSON.stringify(out);
}

export class FuseDataWebpackPlugin {
    apply(compiler: Compiler) {
        compiler.hooks.emit.tapAsync(
            "FuseDataWebpackPlugin",
            (compilation, callback) => {
                const assets = compilation.assets;
                assets["assets/distances.json"] = new RawSource(fuse());
                callback();
            },
        );
    }
}
