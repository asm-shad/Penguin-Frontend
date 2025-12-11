export function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export function formatDateTime(date: string | Date): string {
    return new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}


export function queryStringFormatter(searchParamsObj: { [key: string]: string | string[] | undefined }): string {
    let queryString = "";
    // {searchTerm: "John", speciality: "Cardiology"}
    // after entries: [ ["searchTerm", "John"], ["speciality", "Cardiology"] ]
    const queryArray = Object.entries(searchParamsObj).map(([key, value]) => {
        if (Array.isArray(value)) {
            // { speciality: ["Cardiology", "Neurology"] } 
            // ["Cardiology", "Neurology"]
            // ?speciality=Cardiology&speciality=Neurology
            return value.map((v) => `${key}=${encodeURIComponent(v)}`).join("&");
        }
        else if (value !== undefined) {
            return `${key}=${encodeURIComponent(value)}`;
        }
        return "";
    });
    queryString = queryArray.filter((q) => q !== "").join("&"); // searchTerm=John&speciality=Cardiology&speciality=Neurology
    return queryString;
}

export function formatShortDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// Add this to your existing /lib/formatters.ts file
export function formatCurrency(
  amount: number,
  currencyCode: string,
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback in case of an invalid currency code or locale
    console.error('Currency formatting error:', error);
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}