export interface Distance {
    name: string
    distance: number
}

export interface Data {
    [k: string]: Distance[]
}
