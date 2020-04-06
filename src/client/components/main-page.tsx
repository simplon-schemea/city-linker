import React from "react";
import { MapElement } from "./map/map";
import { Provider } from "react-redux";
import { store } from "../store";


export function MainPage() {
    return (
        <Provider store={ store }>
            <main>
                <MapElement/>
            </main>
        </Provider>
    );
}
