import { ILocalCartProduct } from "@/constants/models/LocalCart";
import { Product } from "@/constants/models/Product";
import { useEffect, useState } from "react";

export const useLocalCart = () => {
    const [cartItems, setCartItems] = useState<ILocalCartProduct[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            const parsedCart = JSON.parse(storedCart);
            setCartItems(parsedCart);
            setTotalItems(calculateTotalItems(parsedCart));
        }
    }, []);

    const addToCart = (product: Product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            const newItems = existingItem
                ? prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
                : [...prevItems, { ...product, quantity: 1 }];

            localStorage.setItem('cart', JSON.stringify(newItems));
            setTotalItems(calculateTotalItems(newItems));
            return newItems;
        });
    };

    const removeFromCart = (productId: string) => {
        setCartItems(prevItems => {
            const newItems = prevItems.filter(item => item.id !== productId);
            localStorage.setItem('cart', JSON.stringify(newItems));
            setTotalItems(calculateTotalItems(newItems));
            return newItems;
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setCartItems(prevItems => {
            const newItems = prevItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            );
            localStorage.setItem('cart', JSON.stringify(newItems));
            setTotalItems(calculateTotalItems(newItems));
            return newItems;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        setTotalItems(0);
        localStorage.removeItem('cart');
    };

    const calculateTotalItems = (items: ILocalCartProduct[]) => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    return {
        cartItems,
        totalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    };
}; 