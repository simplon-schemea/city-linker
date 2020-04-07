import React from "react";
import { Transition } from "react-transition-group";

interface InnerProps {
    condition: boolean;
    timeout?: number;
}

export function If(props: React.PropsWithChildren<InnerProps>) {

    if (props.timeout) {
        return (
            <Transition in={ props.condition } timeout={ props.timeout } unmountOnExit={ true } mountOnEnter={ true }>
                { () => props.children }
            </Transition>
        );
    } else {
        return props.condition ? (
            <>
                { props.children }
            </>
        ) : null;
    }
}
