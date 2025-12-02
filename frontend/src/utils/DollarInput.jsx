export default function DollarInput({ value, onChange, placeholder = "$0.00" }) {

    const handleChange = (e) => {
        let val = e.target.value.replace(/[^0-9.]/g, "");

        if (val && !val.startsWith("0.") && !isNaN(Number(val))) {
            val = String(Number(val));
        }

        const parts = val.split(".");

        if (parts.length > 2) {
            val = parts[0] + "." + parts[1];
        }

        if (parts[1]?.length > 2) {
            val = parts[0] + "." + parts[1].slice(0, 2);
        }

        onChange(val);
    };

    const handleBlur = () => {
        if (!value) return;

        let parts = value.split(".");
        let dollars = parts[0] || "0";
        let cents = parts[1] || "";

        if (cents.length === 0) cents = "00";
        if (cents.length === 1) cents = cents + "0";
        if (cents.length > 2) cents = cents.slice(0, 2);

        onChange(`${dollars}.${cents}`);
    };

    return (
        <input
            type="text"
            value={value ? `$${value}` : ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
        />
    );
}
