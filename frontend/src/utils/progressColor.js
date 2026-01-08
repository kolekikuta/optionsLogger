export function getProgressColor(percentage) {
    if (percentage >= 100) return "gray";
    if (percentage >= 90) return "blue";
    if (percentage >= 60) return "green";
    if (percentage >= 30) return "yellow";
    if (percentage >= 15) return "orange";
    return "red";
}


export const progressGradients = {
    gray: "from-gray-800 to-gray-700",
    blue: "from-blue-700 to-blue-500",
    green: "from-green-700 to-green-500",
    yellow: "from-yellow-600 to-yellow-400",
    orange: "from-orange-600 to-orange-400",
    red: "from-red-700 to-red-500",
};

export const progressBg = {
    gray: "bg-gray-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
};