import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    storeId: string;
    storeName: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, delta: number) => void;
    clearCart: () => void;
    subtotal: number;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("eat_cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart from localStorage", e);
            }
        }
    }, []);

    // Save to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem("eat_cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (newItem: Omit<CartItem, "quantity">) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.productId === newItem.productId);
            if (existing) {
                return prev.map((i) =>
                    i.productId === newItem.productId ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...newItem, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setItems((prev) => prev.filter((i) => i.productId !== productId));
    };

    const updateQuantity = (productId: string, delta: number) => {
        setItems((prev) =>
            prev
                .map((i) => (i.productId === productId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
                .filter((i) => i.quantity > 0)
        );
    };

    const clearCart = () => setItems([]);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
