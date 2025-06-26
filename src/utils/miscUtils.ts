// Function to check if a string can be parsed to an integer
function canParseToInt(str: string): boolean {
    const num = parseInt(str, 10);
    return !isNaN(num);
}

// Function to parse a string to an integer, with error handling
export function parseToInt(str: string): number | null {
    if (canParseToInt(str)) {
        return parseInt(str, 10);
    } else {
        return null;
    }
}