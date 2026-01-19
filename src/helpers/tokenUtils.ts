import Cookies from 'js-cookie';

const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY as string;

export const setToken = (token: string, remember: boolean = false) => {
    const expires = remember ? 30 : 1; // 30 gün veya 1 gün
    Cookies.set(TOKEN_KEY, token, { expires });
};

export const getToken = () => {
    return Cookies.get(TOKEN_KEY);
};

export const removeToken = () => {
    Cookies.remove(TOKEN_KEY);
};

export const handleLogout = () => {
    if (getToken()) {
        window.location.href = '/';
    }
    removeToken();
}; 