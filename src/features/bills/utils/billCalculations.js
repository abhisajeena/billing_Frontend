export const GST_PRESETS = [0, 5, 12, 18, 28];

export const toWords = (value) => {
    const ones = [
        "",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
    ];

    const tens = [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
    ];

    const scales = [
        "",
        "thousand",
        "million",
        "billion",
    ];

    const num = Math.round(Number(value) || 0);

    if (num === 0) {
        return "Zero";
    }

    const formatGroup = (n) => {
        let result = "";

        if (n >= 100) {
            result +=
                ones[Math.floor(n / 100)] +
                " hundred ";

            n %= 100;
        }

        if (n >= 20) {
            result +=
                tens[Math.floor(n / 10)] + " ";
            n %= 10;
        }

        if (n > 0) {
            result += ones[n] + " ";
        }

        return result.trim();
    };

    const parts = [];

    let temp = num;
    let scaleIndex = 0;

    while (temp > 0) {
        const group = temp % 1000;

        if (group > 0) {
            let groupText = formatGroup(group);

            if (scales[scaleIndex]) {
                groupText +=
                    " " + scales[scaleIndex];
            }

            parts.unshift(groupText);
        }

        temp = Math.floor(temp / 1000);
        scaleIndex++;
    }

    return parts
        .join(" ")
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        )
        .trim();
};

export const calculateBillTotals = (
    items = [],
    discount = 0
) => {
    let subTotal = 0;
    let gstTotal = 0;

    const calculatedItems = items.map((item) => {
        const quantity =
            Number(item.quantity) || 0;

        const unitPrice =
            Number(item.unitPrice) || 0;

        const gst =
            Number(item.gst) || 0;

        const baseAmount =
            quantity * unitPrice;

        const gstAmount =
            (baseAmount * gst) / 100;

        const total =
            baseAmount + gstAmount;

        subTotal += baseAmount;
        gstTotal += gstAmount;

        return {
            ...item,
            quantity,
            unitPrice,
            gst,
            baseAmount,
            gstAmount,
            total,
        };
    });

    const safeDiscount =
        Number(discount) || 0;

    const grandTotal = Math.max(
        0,
        subTotal +
            gstTotal -
            safeDiscount
    );

    return {
        calculatedItems,
        subTotal,
        gstTotal,
        discount: safeDiscount,
        grandTotal,
        amountInWords:
            toWords(grandTotal) +
            " Rupees Only",
    };
};