import { format, parse } from "date-fns";


export const convertTo12Hour = (time24) => {
    if (!time24) return "";

    try {
        // Parse the time using date-fns
        const date = parse(time24, "HH:mm", new Date());

        // Format it into 12-hour format with AM/PM
        return format(date, "hh:mm a");
    } catch (error) {
        console.error("Invalid time format:", error);
        return time24;
    }
};