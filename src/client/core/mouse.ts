import { Point } from "@model/point";
import React from "react";

export function mapMouseToPoint(event: MouseEvent | React.MouseEvent, mode: "page" | "client" | "screen" | "offset" | "movement"): Point {
    return {
        x: event[mode + "X" as keyof typeof event] as number,
        y: event[mode + "Y" as keyof typeof event] as number,
    };
}
