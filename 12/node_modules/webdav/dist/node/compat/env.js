export function isWeb() {
    if (typeof WEB === "boolean" && WEB === true) {
        return true;
    }
    return false;
}
