import { Data } from "./model/data";

export const distances: Promise<Data> = fetch("/distances.json").then(value => value.json());
