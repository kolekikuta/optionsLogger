import { parseLocalDate } from './parseLocalDate';


export function getExitDisabledRange(entry_date=null, expiration_date=null) {
    const entry = entry_date ? parseLocalDate(entry_date) : null;
    const expiration = expiration_date ? parseLocalDate(expiration_date) : null;
    if (entry && expiration) {
        return {
            before: entry,
            after: expiration
        };
    }
    if (entry) {
        return {
            before: entry
        };
    }
    return null;
}
export function getEntryDisabledRange(expiration_date=null) {
    const expiration = expiration_date
        ? parseLocalDate(expiration_date)
        : null;
    const today = new Date();
    if (expiration) {
        return {
        after: expiration < today ? expiration : today,
        };
    }
    return {
        after: today,
    };
}