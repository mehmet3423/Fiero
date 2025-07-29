import Cookies from 'js-cookie';

const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY as string;

export const setToken = (token: string) => {
    Cookies.set(TOKEN_KEY, token, { expires: 1 }); // 1 gün
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