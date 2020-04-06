export class ViewBox {
    constructor(x: number, y: number, width: number, height: number);
    constructor(values: [ number, number, number, number ]);
    constructor(value: SVGAnimatedRect);
    constructor(...args: [ [ number, number, number, number ] ] | [ number, number, number, number ] | [ SVGAnimatedRect ]) {
        switch (args.length) {
            case 1: {
                const value = args[0];
                if (value instanceof SVGAnimatedRect) {
                    const baseVal = value.baseVal;
                    this.values = [ baseVal.x, baseVal.y, baseVal.width, baseVal.height ];
                } else {
                    this.values = value;
                }
                break;
            }
            case 4:
                this.values = args;
                break;
            default:
                throw new Error(`ViewBox constructor expect 4 values, ${ (args as []).length } received`);
        }
    }

    readonly values: [ number, number, number, number ];

    get x() { return this.values[0]; }

    get y() { return this.values[1]; }

    get width() { return this.values[2]; }

    get height() { return this.values[3]; }

    get aspect(): number {
        const aspect = this.width / this.height;

        Object.defineProperty(this, "ratio", {
            value: aspect,
            writable: false,
            configurable: false,
        });

        return aspect;
    }

    static fromString(value: string) {
        const args = value.split(" ").filter(value => !!value).map(value => parseFloat(value)) as [ number, number, number, number ];
        return new ViewBox(args);
    }

    toString() {
        return `${ this.x } ${ this.y } ${ this.width } ${ this.height }`;
    }
}
