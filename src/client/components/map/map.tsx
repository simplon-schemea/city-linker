import "./map.scss";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { State } from "@store/reducer";
import { ViewBox } from "../../core/viewbox";
import { ReferenceEditorComponent } from "./reference-editor";
import { DataService } from "@services/data.service";
import { If } from "../logic/if";
import { CityCollectionComponent } from "./city-collection";

const viewBox = new ViewBox(0, 0, 1040.906, 996.59);

interface InnerProps {
    references: [ string, string, string ]
    coordinates: State["coordinates"]
    cities: State["cities"]
}

const referencesCityNames: [ string, string, string ] = [ "Paris", "Brest", "Toulouse" ];

export const MapElement = connect(
    (state: State): InnerProps => {
        return {
            references: referencesCityNames,
            coordinates: state.coordinates,
            cities: state.cities,
        };
    },
)(
    function (props: InnerProps) {
        useEffect(DataService.loadDistances, []);

        const referenceCitiesId = useMemo(function () {
            return referencesCityNames.map(DataService.getCityByName).map(city => city?.id).filter(value => !!value);
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
                <If condition={ !!SVGRef }>
                    <If condition={ length < 3 }>
                        <ReferenceEditorComponent root={ SVGRef as SVGSVGElement } cities={ referenceCitiesId }/>
                    </If>
                    <If condition={ length >= 3 }>
                        <CityCollectionComponent/>
                    </If>
                </If>
            </svg>
        );
    },
);

