export function formatPhoneNumber(value: string): string {
  // Clear non-digits
  const digits = value.replace(/\D/g, '');
  
  // Strip 998 if entered redundantly
  let cleaned = digits;
  if (cleaned.startsWith('998')) {
    cleaned = cleaned.slice(3);
  }
  
  // Limit to 9 digits (Uzbekistan local format without 998)
  cleaned = cleaned.slice(0, 9);
  
  let formatted = '+998';
  if (cleaned.length > 0) {
    formatted += ` (${cleaned.slice(0, 2)}`;
  }
  if (cleaned.length >= 2) {
    formatted += ')';
  }
  if (cleaned.length > 2) {
    formatted += ` ${cleaned.slice(2, 5)}`;
  }
  if (cleaned.length > 5) {
    formatted += `-${cleaned.slice(5, 7)}`;
  }
  if (cleaned.length > 7) {
    formatted += `-${cleaned.slice(7, 9)}`;
  }
  
  return formatted;
}

export function isValidUzbekPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 12 && digits.startsWith('998');
}

export function generateApplicationId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `UBS-LC-2026-${randomNum}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
