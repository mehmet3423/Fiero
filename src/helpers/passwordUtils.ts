/**
 * Şifre gücünü kontrol eden ve CSS class'ı döndüren fonksiyon
 */
export const getPasswordStrength = (password: string): string => {
    if (!password) return '';

    const checks = [
        /[A-Z]/.test(password), // büyük harf
        /[a-z]/.test(password), // küçük harf
        /\d/.test(password),    // sayı
        /[!@#$%^&*(),.?":{}|<>]/.test(password), // özel karakter
        password.length >= 6     // uzunluk
    ];

    const passedChecks = checks.filter(Boolean).length;
    return `password-strength-${Math.min(passedChecks, 5)}`;
};

/**
 * Şifrenin gerekli kriterleri karşılayıp karşılamadığını kontrol eden fonksiyon
 */
export const isPasswordValid = (password: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 6;

    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough;
};

/**
 * Şifre validasyon hata mesajını döndüren fonksiyon
 */
export const getPasswordValidationMessage = (): string => {
    return 'Şifre en az bir büyük harf, bir küçük harf, bir sayı ve bir özel karakter içermelidir!';
}; 