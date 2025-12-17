export function parseLocalDate(ymd) {
    if (!ymd) return null;
    const [y, m, d] = ymd.split("-");
    return new Date(Number(y), Number(m) - 1, Number(d));
}