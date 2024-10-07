export const convertToSecondsUtil = (timeStr: string): number => {
    const unitMultipliers: { [key: string]: number } = {
        s: 1, // секунда
        m: 60, // хвилина
        h: 3600, // година
        d: 86400, // день
        M: 2592000, // місяць (30 днів)
        y: 31536000, // рік (365 днів)
    };

    const unit = timeStr.slice(-1);
    const num = parseInt(timeStr.slice(0, -1), 10);

    if (isNaN(num) || !unitMultipliers[unit]) {
        throw new Error('Invalid time string');
    }

    return num * unitMultipliers[unit];
};
