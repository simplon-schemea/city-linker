import "./map.scss";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { State, StateCoordinates } from "@store/reducer";
import { ViewBox } from "../../core/viewbox";
import { ReferenceEditorComponent } from "./reference-editor";
import { DataService } from "@services/data.service";
import { If } from "../core/if";
import { CityCollectionComponent } from "./city-collection";
import { selectors } from "@store/selectors";
import { store } from "@store/index";
import { SVGContext } from "../core/svg-context";

const viewBox = new ViewBox(0, 0, 1040.906, 996.59);

interface InnerProps {
    references: [ string, string, string ]
    coordinates: StateCoordinates
    cities: State["cities"]
}

const referencesCityNames: [ string, string, string ] = [ "Paris", "Brest", "Toulouse" ];

export const MapComponent = connect(
    (state: State): InnerProps => {
        return {
            references: referencesCityNames,
            coordinates: state.map.coordinates,
            cities: state.cities,
        };
    },
)(
    function Map(props: InnerProps) {
        useEffect(DataService.loadDistances, []);

        const referenceCitiesId = useMemo(function () {
            const state = store.getState();
            return referencesCityNames
                .map(name => selectors.cityWithName(name)(state))
                .map(city => city?.id)
                .filter(value => !!value);
        }, [ referencesCityNames, props.cities ]) as [ number, number, number ];

        const [ SVGRef, setSVGRef ] = useState<SVGSVGElement | null>(null);

        const length = useMemo(function () {
            return Object.keys(props.coordinates).length;
        }, [ props.coordinates ]);

        if (referenceCitiesId.length !== 3) {
            return (
                <Fragment>
                    Loading...
                </Fragment>
            );

        }

        return (
            <svg className="map-container" ref={ setSVGRef } viewBox={ viewBox.toString() }>
                { SVGRef && (
                    <SVGContext.Provider value={ SVGRef }>
                        <If condition={ length < 3 } timeout={ 2000 }>
                            <ReferenceEditorComponent cities={ referenceCitiesId }/>
                        </If>
                        { length >= 3 && <CityCollectionComponent/> }
                    </SVGContext.Provider>
                ) }
            </svg>
        );
    },
);

