export const isoTimeFormat = (dateTime) => {
    const date = new Date(dateTime);
    const localTime = date.toLocaleString('en-US', {
        hour: '2-digit',
        minutes: '2-digit',
        hour12: true,
    })

    return localTime
}