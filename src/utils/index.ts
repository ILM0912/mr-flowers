export const formatPrice = (value: number): string => {
	const formatter = new Intl.NumberFormat('ru-RU');
	return `${formatter.format(value)} ₽`;
};

export const beautifyName = (name: string): string => {
    return name
        .trim()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

export const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('.');
    return new Date(`${year}-${month}-${day}`);
};

export const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    const parts = [];

    if (digits.length > 0) parts.push('+7');
    if (digits.length > 1) parts.push(` (${digits.slice(1, 4)}`);
    if (digits.length >= 4) parts[parts.length - 1] += ')';
    if (digits.length >= 7) parts.push(` ${digits.slice(4, 7)}`);
    if (digits.length >= 9) parts.push(`-${digits.slice(7, 9)}`);
    if (digits.length >= 11) parts.push(`-${digits.slice(9, 11)}`);

    return parts.join('');
};

export function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return date.toLocaleString("ru-RU", options);
}