import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";

export default function DollarInput({ value, onChange, ...props }) {
    return (
        <NumericFormat
        value={value ?? ""}
        thousandSeparator
        prefix="$"
        decimalScale={2}
        fixedDecimalScale
        customInput={Input}
        onValueChange={(v) => onChange?.(v.floatValue)}
        {...props}
        />
    );
}
