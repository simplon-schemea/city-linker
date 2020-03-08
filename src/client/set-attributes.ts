export function setAttributes(element: Element, attributes: { [k: string]: number | string }) {
    for (let key in attributes) {
        element.setAttribute(key, attributes[key] as string);
    }
}
