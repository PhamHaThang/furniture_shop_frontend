import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { cartService } from "../services";
import { STORAGE_KEYS } from "../config";

const CartContext = createContext(null);
export const CartProvider = ({ children }) => {
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated || false;
  const isAuthLoading = auth?.isLoading || false;
  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  // Sync with server
  const syncWithServer = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setDiscount(0);
      return;
    }
    setIsLoading(true);
    try {
      const response = await cartService.getCart();
      const cart = response.cart;
      const serverItems = cart?.items || [];
      setItems(
        serverItems.map((item) => ({
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          slug: item.product.slug,
          image: item.product.images?.[0],
          quantity: item.quantity,
          stock: item.product.stock,
        }))
      );
      setDiscount(cart?.discount?.amount || 0);
    } catch (error) {
      console.error("Lỗi khi đồng bộ giỏ hàng với server:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);
  // Load from localStorage only if authenticated
  useEffect(() => {
    if (!isAuthLoading) return;
    if (isAuthenticated) {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.CART);
        if (saved) {
          setItems(JSON.parse(saved));
        }
      } catch {
        setItems([]);
      }
    } else {
      setItems([]);
      setDiscount(0);
      localStorage.removeItem(STORAGE_KEYS.CART);
    }
  }, [isAuthenticated, isAuthLoading, syncWithServer]);

  // Auto-sync with server when authenticated
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      syncWithServer();
    }
  }, [isAuthenticated, isAuthLoading, syncWithServer]);

  // Save to localStorage only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
    }
  }, [items, isAuthenticated]);
  const addItem = useCallback(
    (product) => async () => {
      if (!isAuthenticated) return;
      setItems((prevItems) => {
        const existingItem = prevItems.find((item) => item._id === product._id);
        if (existingItem >= 0) {
          const newItems = [...prevItems];
          newItems[existingItem].quantity += product.quantity || 1;
          return newItems;
        }
        return [
          ...prevItems,
          {
            ...product,
            quantity: product.quantity || 1,
            stock: product.stock || 0,
          },
        ];
      });
      try {
        await cartService.addToCart(product._id, product.quantity || 1);
      } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      }
    },
    [isAuthenticated]
  );
  const removeItem = useCallback(
    (productId) => async () => {
      if (!isAuthenticated) return;
      setItems((prevItems) =>
        prevItems.filter((item) => item._id !== productId)
      );
      try {
        await cartService.removeFromCart(productId);
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
      }
    },
    [isAuthenticated]
  );
  const updateQuantity = useCallback(
    (productId, quantity) => async () => {
      if (!isAuthenticated || quantity < 1) return;
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === productId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
      );
      try {
        await cartService.updateCartItem(productId, quantity);
      } catch (error) {
        console.error(
          "Lỗi khi cập nhật số lượng sản phẩm trong giỏ hàng:",
          error
        );
      }
    },
    [isAuthenticated]
  );
  const clearCart = useCallback(
    () => async () => {
      if (!isAuthenticated) return;
      setItems([]);
      setDiscount(0);
      try {
        await cartService.clearCart();
      } catch (error) {
        console.error("Lỗi khi xóa giỏ hàng:", error);
      }
    },
    [isAuthenticated]
  );
  const value = {
    items,
    totalItems,
    totalAmount,
    discount,
    isLoading,
    setDiscount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    syncWithServer,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải nằm trong CartProvider");
  }
  return context;
};
