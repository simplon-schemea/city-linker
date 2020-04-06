import React from "react";

interface InnerProps {
    condition: boolean;
}

export function If(props: React.PropsWithChildren<InnerProps>) {
    if (!props.condition) {
        return null;
    } else {
        return (
            <>
                { props.children }
            </>
        );
    }
}
