import { parseLocalDate } from "@/utils/parseLocalDate"
import { getProgressColor, progressBg } from "@/utils/progressColor";

export default function DTE({ entry, expiration, exit, dte }) {
    if (!entry) {
        return null;
    }

    if (dte === null || dte === undefined) {
        return <div className="pl-2">-</div>;
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
    const bg = progressBg[colorKey];

    return (
        <div className="pl-2">
          <span className={`text-white rounded-md px-2 ${bg}`}>{dte != null ? dte : "-"}</span>
        </div>
      )
}