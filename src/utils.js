export const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const formatDistance = (meters) => {
    if (!meters || meters <= 0) return "0 mi";

    const miles = meters / 1609.34; // meters → miless
    return `${miles.toFixed(2)} mi`;
};

/**
 * Calculates the average pace in minutes and seconds per mile.
 * @param {number} meters - The distance in meters.
 * @param {number} seconds - The duration in seconds.
 * @returns {string} The average pace in the format "MM:SS/mi".
 */
export const getPace = (meters, seconds) => {
    // 1. Convert total distance from meters to miles.
    const miles = meters / 1609.34;

    // 2. Calculate total time in minutes for the given distance.
    const totalMinutes = seconds / 60;

    // 3. Calculate pace in minutes per mile.
    const paceDecimal = totalMinutes / miles;

    // 4. Separate the whole minutes (MM) and the fractional seconds (SS).
    const paceMinutes = Math.floor(paceDecimal);

    // Get the remaining fractional part (e.g., 0.5 from 4.5 minutes) and convert to seconds.
    const paceSeconds = Math.round((paceDecimal - paceMinutes) * 60);

    // 5. Format the seconds with leading zero if necessary (e.g., 5 becomes 05).
    const formattedSeconds = String(paceSeconds).padStart(2, '0');

    // 6. Return the formatted pace.
    return `${paceMinutes}:${formattedSeconds}/mi`;
};