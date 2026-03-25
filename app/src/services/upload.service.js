export function createReactNativeFile({ uri, name, type }) {
    return { uri, name, type };
}

export function isReactNativeFile(value) {
    return Boolean(
        value &&
        typeof value === 'object' &&
        typeof value.uri === 'string' &&
        typeof value.name === 'string' &&
        typeof value.type === 'string'
    );
}
