

export default function DollarInput({ value, onChange, placeholder = "$0.00" }) {

    const handleChange = (e) => {
        let val = e.target.value.replace(/[^0-9.]/g, "");
        const parts = val.split(".");
        if (parts.length > 2) val = parts[0] + "." + parts[1];
        if (parts[1]?.length > 2) {
            val = parts[0] + "." + parts[1].slice(0, 2);
        }
        onChange(val);
    }


    return (
        <input
            type="text"
            value={value ? `$${value}` : ""}
            onChange={handleChange}
            placeholder={placeholder}
        />
    )
}