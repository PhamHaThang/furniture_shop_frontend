import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Search,
    ShoppingCart,
    Heart,
    User,
    Menu,
    X,
    LogOut,
    Package,
    ChevronDown,
} from "lucide-react";
import { useAuth, useCart, useWishlist } from "../../contexts";
import { useDebounce } from "../../hooks";
import { productService } from "../../services";
import { HEADER_NAV_LINKS, ROUTES } from "../../config";
import { PLACEHOLDER_IMAGE } from "../../config";
import logo from "../../assets/logo1.png";
import toast from "react-hot-toast";
const Header = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { totalItems: cartCount } = useCart();
    const { items: wishlistItems } = useWishlist();

    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    const debouncedSearchQuery = useDebounce(searchQuery, 250);
    const searchBoxRef = useRef(null);
    const wishlistCount = wishlistItems.length;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    useEffect(() => {
        const query = debouncedSearchQuery.trim();

        if (query.length < 2) {
            setSuggestions([]);
            setIsLoadingSuggestions(false);
            return;
        }

        let isActive = true;
        const fetchSuggestions = async () => {
            setIsLoadingSuggestions(true);
            try {
                const res = await productService.getSearchSuggestions({
                    q: query,
                    limit: 6,
                });
                if (!isActive) return;
                setSuggestions(res.suggestions || []);
            } catch {
                if (!isActive) return;
                setSuggestions([]);
            } finally {
                if (isActive) setIsLoadingSuggestions(false);
            }
        };

        fetchSuggestions();

        return () => {
            isActive = false;
        };
    }, [debouncedSearchQuery]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchBoxRef.current &&
                !searchBoxRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const keyword = searchQuery.trim();

        if (keyword) {
            navigate(`/products?search=${encodeURIComponent(keyword)}`);
            setSearchQuery("");
            setShowSuggestions(false);
        }
    };
    const handleSelectSuggestion = (slug) => {
        navigate(`/products/${slug}`);
        setSearchQuery("");
        setShowSuggestions(false);
        setIsMobileMenuOpen(false);
    };

    const shouldShowSuggestions =
        showSuggestions &&
        searchQuery.trim().length >= 2 &&
        (isLoadingSuggestions || suggestions.length > 0);
    const handleLogout = () => {
        logout();
        toast.success("Đăng xuất thành công!");
        navigate(ROUTES.HOME);
    };

    return (
        <header
            className={`sticky top-0 z-40 transition-all duration-300 ${
                isScrolled
                    ? "bg-white/95 backdrop-blur-sm shadow-md"
                    : "bg-white"
            }`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 lg:h-20 gap-2 lg:gap-4">
                    {/* Logo */}
                    <Link to={ROUTES.HOME} className="flex items-center">
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-8 object-contain"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {HEADER_NAV_LINKS.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-char-700 hover:text-primary-500 font-medium transition-colors">
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Search Bar - Desktop */}
                    <form
                        onSubmit={handleSearch}
                        className="hidden lg:flex items-center flex-1 max-w-sm mx-2"
                        ref={searchBoxRef}>
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                placeholder="Tìm kiếm sản phẩm..."
                                className="w-full pl-4 pr-10 py-2 border border-beige-300 rounded-full bg-beige-50 focus:outline-none focus:border-primary-400 focus:bg-white transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-char-400 hover:text-primary-500">
                                <Search size={20} />
                            </button>
                            {shouldShowSuggestions && (
                                <div className="absolute z-50 mt-2 w-full bg-white border border-beige-200 rounded-2xl shadow-xl overflow-hidden">
                                    {isLoadingSuggestions ? (
                                        <div className="px-4 py-3 text-sm text-char-500">
                                            Đang tìm gợi ý...
                                        </div>
                                    ) : (
                                        <ul className="max-h-80 overflow-y-auto">
                                            {suggestions.map((item) => (
                                                <li key={item._id}>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleSelectSuggestion(
                                                                item.slug,
                                                            )
                                                        }
                                                        className="w-full text-left px-4 py-3 hover:bg-beige-50 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={
                                                                    item
                                                                        .images?.[0] ||
                                                                    PLACEHOLDER_IMAGE
                                                                }
                                                                alt={item.name}
                                                                className="w-12 h-12 rounded-md object-cover bg-beige-100 shrink-0"
                                                                onError={(e) => {
                                                                    e.currentTarget.src =
                                                                        PLACEHOLDER_IMAGE;
                                                                }}
                                                            />
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium text-char-900 line-clamp-1">
                                                                    {item.name}
                                                                </p>
                                                                <p className="text-xs text-char-500 mt-1">
                                                                    {Number(
                                                                        item.price ||
                                                                            0,
                                                                    ).toLocaleString(
                                                                        "vi-VN",
                                                                    )}
                                                                    đ
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    </form>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 lg:gap-4">
                        {/* Wishlist */}
                        <Link
                            to={ROUTES.WISHLIST}
                            className="relative p-2 text-char-600 hover:text-primary-500 transition-colors">
                            <Heart size={24} />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {wishlistCount > 9 ? "9+" : wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link
                            to={ROUTES.CART}
                            className="relative p-2 text-char-600 hover:text-primary-500 transition-colors">
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {cartCount > 9 ? "9+" : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setIsUserMenuOpen(!isUserMenuOpen)
                                    }
                                    className="flex items-center gap-2 p-2 text-char-600 hover:text-primary-500 transition-colors cursor-pointer">
                                    <User size={24} />
                                    <span className="hidden lg:block text-sm font-medium max-w-[100px] truncate">
                                        {user?.fullName.split(" ").slice(-1)[0]}
                                    </span>
                                    <ChevronDown
                                        size={16}
                                        className="hidden lg:block"
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() =>
                                                setIsUserMenuOpen(false)
                                            }
                                        />
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-beige-200 py-2 z-20">
                                            <div className="px-4 py-2 border-b border-beige-100">
                                                <p className="font-medium text-char-900 truncate">
                                                    {user?.fullName}
                                                </p>
                                                <p className="text-sm text-char-500 truncate">
                                                    {user?.email}
                                                </p>
                                            </div>

                                            {isAdmin && (
                                                <Link
                                                    to={ROUTES.ADMIN_DASHBOARD}
                                                    onClick={() =>
                                                        setIsUserMenuOpen(false)
                                                    }
                                                    className="flex items-center gap-3 px-4 py-2 text-char-700 hover:bg-beige-50 transition-colors">
                                                    <Package size={18} />
                                                    Quản trị
                                                </Link>
                                            )}

                                            <Link
                                                to={ROUTES.PROFILE}
                                                onClick={() =>
                                                    setIsUserMenuOpen(false)
                                                }
                                                className="flex items-center gap-3 px-4 py-2 text-char-700 hover:bg-beige-50 transition-colors">
                                                <User size={18} />
                                                Tài khoản
                                            </Link>

                                            <Link
                                                to={ROUTES.ORDERS}
                                                onClick={() =>
                                                    setIsUserMenuOpen(false)
                                                }
                                                className="flex items-center gap-3 px-4 py-2 text-char-700 hover:bg-beige-50 transition-colors">
                                                <Package size={18} />
                                                Đơn hàng
                                            </Link>

                                            <div className="border-t border-beige-100 mt-2 pt-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 px-4 py-2 w-full text-red-600 hover:bg-red-50 transition-colors">
                                                    <LogOut size={18} />
                                                    Đăng xuất
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to={ROUTES.LOGIN}
                                    className="hidden px-4 py-2 sm:block text-char-700 hover:text-primary-500 font-medium transition-colors">
                                    Đăng nhập
                                </Link>
                                <Link
                                    to={ROUTES.REGISTER}
                                    className="hidden sm:block px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition-colors">
                                    Đăng ký
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="lg:hidden p-2 text-char-600 hover:text-primary-500">
                            {isMobileMenuOpen ? (
                                <X size={24} />
                            ) : (
                                <Menu size={24} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-beige-200 py-4 absolute top-full left-0 right-0 bg-white shadow-lg z-50 px-4">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    placeholder="Tìm kiếm sản phẩm..."
                                    className="w-full pl-4 pr-10 py-2 border border-beige-300 rounded-full bg-beige-50 focus:outline-none focus:border-primary-400 focus:bg-white transition-all"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-char-400">
                                    <Search size={20} />
                                </button>
                                {shouldShowSuggestions && (
                                    <div className="absolute z-50 mt-2 w-full bg-white border border-beige-200 rounded-2xl shadow-xl overflow-hidden">
                                        {isLoadingSuggestions ? (
                                            <div className="px-4 py-3 text-sm text-char-500">
                                                Đang tìm gợi ý...
                                            </div>
                                        ) : (
                                            <ul className="max-h-72 overflow-y-auto">
                                                {suggestions.map((item) => (
                                                    <li key={item._id}>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleSelectSuggestion(
                                                                    item.slug,
                                                                )
                                                            }
                                                            className="w-full text-left px-4 py-3 hover:bg-beige-50 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={
                                                                        item
                                                                            .images?.[0] ||
                                                                        PLACEHOLDER_IMAGE
                                                                    }
                                                                    alt={item.name}
                                                                    className="w-12 h-12 rounded-md object-cover bg-beige-100 shrink-0"
                                                                    onError={(
                                                                        e,
                                                                    ) => {
                                                                        e.currentTarget.src =
                                                                            PLACEHOLDER_IMAGE;
                                                                    }}
                                                                />
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-medium text-char-900 line-clamp-1">
                                                                        {item.name}
                                                                    </p>
                                                                    <p className="text-xs text-char-500 mt-1">
                                                                        {Number(
                                                                            item.price ||
                                                                                0,
                                                                        ).toLocaleString(
                                                                            "vi-VN",
                                                                        )}
                                                                        đ
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                        </form>

                        {/* Mobile Nav Links */}
                        <nav className="flex flex-col gap-2 mb-4">
                            {HEADER_NAV_LINKS.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-3 text-char-700 hover:bg-beige-100 rounded-lg transition-colors font-medium">
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Auth Actions */}
                        <div className="border-t border-beige-100 pt-4 flex flex-col gap-2">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to={ROUTES.PROFILE}
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className="flex items-center gap-3 px-4 py-3 text-char-700 hover:bg-beige-100 rounded-lg transition-colors">
                                        <User size={20} />
                                        Tài khoản của tôi
                                    </Link>
                                    <Link
                                        to={ROUTES.ORDERS}
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className="flex items-center gap-3 px-4 py-2 text-char-700 hover:bg-beige-50 rounded-lg transition-colors">
                                        <Package size={20} />
                                        Đơn hàng
                                    </Link>
                                    {isAdmin && (
                                        <Link
                                            to={ROUTES.ADMIN_DASHBOARD}
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                            className="flex items-center gap-3 px-4 py-3 text-char-700 hover:bg-beige-100 rounded-lg transition-colors">
                                            <Package size={20} />
                                            Quản trị
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left">
                                        <LogOut size={20} />
                                        Đăng xuất
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        to={ROUTES.LOGIN}
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className="flex justify-center items-center px-4 py-2 border border-beige-300 rounded-lg text-char-700 font-medium hover:bg-beige-50 transition-colors">
                                        Đăng nhập
                                    </Link>
                                    <Link
                                        to={ROUTES.REGISTER}
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className="flex justify-center items-center px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors">
                                        Đăng ký
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
