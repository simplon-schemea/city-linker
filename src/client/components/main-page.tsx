import React from "react";
import { MapComponent } from "./map/map";
import { Provider } from "react-redux";
import { store } from "../store";


export function MainPage() {
    return (
        <Provider store={ store }>
            <main>
                <MapComponent/>
            </main>
        </Provider>
    );
}
