import React from "react";

interface Props {
    id: string;
}

export function DistanceRadialGradientDefinition(props: Props) {
    return (
        <radialGradient id={ props.id }>
            <stop offset="70%" stopOpacity={ 0 } stopColor="#333"/>
            <stop offset="85%" stopOpacity={ 0.1 } stopColor="#333"/>
            <stop offset="100%" stopOpacity={ 0.35 } stopColor="#333"/>
        </radialGradient>
    );
}
