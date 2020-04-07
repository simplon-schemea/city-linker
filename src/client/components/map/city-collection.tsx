import React, { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { State } from "@store/reducer";
import { CityComponent } from "./city";
import { selectors } from "@store/selectors";
import { DataService } from "@services/data.service";
import { Point } from "@model/point";
import { ID } from "../../math/id";
import { City } from "@model/city";

interface InnerProps {
    coordinatesList: [ ID, Point ][]
    cityList: City[]
}

export const CityCollectionComponent = connect(
    (state: State): InnerProps => ({
        coordinatesList: selectors.coordinatesList(state),
        cityList: selectors.cityList(state),
    }),
)(function CityCollection(props: InnerProps) {
    useEffect(function () {
        if (props.coordinatesList.length !== props.cityList.length) {
            if (props.coordinatesList.length < 3) {
                throw new Error("At least three cities must be placed");
            }

            DataService.trilaterizeAll();
        }

    }, [ props.coordinatesList, props.cityList ]);

    const cities = useMemo(function () {
        return props.coordinatesList.map(([ id, coordinates ]) => (
            <CityComponent id={ id } position={ coordinates } key={ id }/>
        ));
    }, [ props.coordinatesList ]);

    return (
        <>
            { cities }
        </>
    );
});
