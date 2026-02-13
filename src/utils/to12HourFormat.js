const to12HourFormat = (time24) => {
    if (!time24) return '';

    const [hourStr, minuteStr] = time24.split(':');
    let hour = Number(hourStr);
    const minute = minuteStr ?? '00';

    const period = hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;

    return `${hour}:${minute} ${period}`;
};

export default to12HourFormat;