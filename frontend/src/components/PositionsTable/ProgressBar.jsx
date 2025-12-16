import { parseLocalDate } from "../CreateLog/CreateLog";
import { getProgressColor, progressGradients } from "@/utils/progressColor";

export default function ProgressBar({ entry, expiration, exit }) {
    if (!entry) {
        return null;
    }

    // closed position -> full bar
    if (exit) {
        return (
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div className="bg-grey-700 h-2 rounded-full w-full" />
            </div>
        );
    }

    // open shares (no expiration)
    if (!expiration) {
        return null;
    }

    const entryDate = parseLocalDate(entry);
    const expirationDate = parseLocalDate(expiration);
    const now = new Date();

    const total =
        (expirationDate - entryDate) / (1000 * 60 * 60 * 24);

    const elapsed =
        (Math.min(now, expirationDate) - entryDate) /
        (1000 * 60 * 60 * 24);

    const percentage =
        total <= 0 || now >= expirationDate
            ? 100
            : Math.min(
                  100,
                  Math.max(0, (elapsed / total) * 100)
              );
    const colorKey = getProgressColor(percentage);
    const gradient = progressGradients[colorKey];


    return (
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div
                className={`h-2 rounded-full transition-all duration-500 ease-in-out bg-gradient-to-r ${gradient}`}
                style={{
                    width: `${percentage}%`
                }}
            />
        </div>
    );
}
