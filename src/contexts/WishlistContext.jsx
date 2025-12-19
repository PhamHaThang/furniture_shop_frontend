import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { wishlistService } from "../services";
import { STORAGE_KEYS } from "../config";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated || false;
  const isAuthLoading = auth?.isLoading || false;
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const syncWithServer = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await wishlistService.getWishlist();
      const wishlist = response.wishlist?.products || [];
      setItems(wishlist);
    } catch (error) {
      console.error("Lỗi khi đồng bộ wishlist với server:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);
  // Load from localStorage only if authenticated
  useEffect(() => {
    if (isAuthLoading) return;
    if (isAuthenticated) {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
        if (saved) {
          setItems(JSON.parse(saved));
        }
      } catch {
        setItems([]);
      }
    } else {
      setItems([]);
      localStorage.removeItem(STORAGE_KEYS.WISHLIST);
    }
  }, [isAuthenticated, isAuthLoading]);
  // Auto-sync with server when authenticated
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      syncWithServer();
    }
  }, [isAuthenticated, isAuthLoading, syncWithServer]);
  // Save to localStorage only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(items));
    }
  }, [items, isAuthenticated]);
  // Add Item
  const addItem = useCallback(
    async (product) => {
      if (!isAuthenticated) return;
      setItems((prev) => {
        if (prev.some((item) => item._id === product._id)) {
          return prev;
        }
        return [...prev, product];
      });
      try {
        await wishlistService.addToWishlist(product._id);
      } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào wishlist:", error);
      }
    },
    [isAuthenticated]
  );
  // Remove Item
  const removeItem = useCallback(
    async (productId) => {
      if (!isAuthenticated) return;
      setItems((prev) => prev.filter((item) => item._id !== productId));
      try {
        await wishlistService.removeFromWishlist(productId);
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi wishlist:", error);
      }
    },
    [isAuthenticated]
  );
  //Check Item in Wishlist
  const isInWishlist = useCallback(
    (productId) => {
      return items.some((item) => item._id === productId);
    },
    [items]
  );
  // Clear Wishlist
  const clearWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    setItems([]);
    try {
      await wishlistService.clearWishlist();
    } catch (error) {
      console.error("Lỗi khi xóa tất cả sản phẩm khỏi wishlist:", error);
    }
  }, [isAuthenticated]);

  const value = {
    items,
    isLoading,
    addItem,
    removeItem,
    isInWishlist,
    clearWishlist,
    syncWithServer,
  };
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWithlist phải được sử dụng bên trong WishlistProvider");
  }
  return context;
};
