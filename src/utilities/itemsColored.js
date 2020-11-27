export const itemColoredMap = new Map();

export const isColored = (id) => {
    return typeof itemColoredMap.get(id) !== "undefined";
}