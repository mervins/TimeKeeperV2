export default function stringPadding(target, paddingCount, character = "0") {
    let result = String(target);
    while (result.length < paddingCount) {
        result = character + result;
    }
    return result;
}