import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { productService } from "../../services";
import toast from "react-hot-toast";
import { prompt } from "../../utils";
import { QUICK_ACTIONS_AI } from "../../config";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Xin chào! Tôi là trợ lý AI của cửa hàng nội thất HOMI. Tôi có thể giúp bạn tìm kiếm sản phẩm, tư vấn về đồ nội thất phù hợp với không gian của bạn. Bạn cần hỗ trợ gì?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  const analyzeSentiment = (text) => {
    const lowerText = text.toLowerCase();
    const keywords = {
      sofa: ["sofa", "ghế sofa", "ghe sofa"],
      chair: ["ghế", "ghe"],
      table: ["bàn", "ban"],
      bed: ["giường", "giuong"],
      cabinet: ["tủ", "tu"],
      desk: ["bàn làm việc", "ban lam viec"],
      wardrobe: ["tủ quần áo", "tu quan ao"],
      bookshelf: ["kệ sách", "ke sach"],
    };
    for (const [category, words] of Object.entries(keywords)) {
      if (words.some((word) => lowerText.includes(word))) {
        return { category, keyword: words[0] };
      }
    }
    return null;
  };
  const generateResponse = async (userMessage) => {
    // Try using Puter AI first
    let aiResponse = null;
    try {
      if (window.puter && window.puter.ai) {
        const response = await window.puter.ai.chat(
          `${prompt}\n\nKhách hàng: ${userMessage}\nTrợ lý:`
        );

        // Extract text from Puter AI response
        if (response) {
          // Puter AI returns an object with message property
          if (typeof response === "object" && response.message) {
            aiResponse = response.message.content || response.message;
          } else if (typeof response === "string") {
            aiResponse = response;
          } else if (response.toString) {
            aiResponse = response.toString();
          }
        }
      }
    } catch (error) {
      console.log("Puter AI not available, using fallback logic:", error);
    }

    // If Puter AI responded, combine with product search
    if (aiResponse && typeof aiResponse === "string") {
      const sentiment = analyzeSentiment(userMessage);
      if (sentiment) {
        try {
          const response = await productService.getProducts({
            search: sentiment.keyword,
            limit: 3,
          });
          const products = response.products || [];

          if (products.length > 0) {
            return {
              text: aiResponse + "\n\nTôi tìm thấy một số sản phẩm phù hợp:",
              products: products,
            };
          }
        } catch (error) {
          console.error("Error searching products:", error);
        }
      }
      return { text: aiResponse };
    }

    // Fallback to original logic
    const sentiment = analyzeSentiment(userMessage);

    if (sentiment) {
      try {
        // Search for products
        const response = await productService.getProducts({
          search: sentiment.keyword,
          limit: 3,
        });

        const products = response.products || [];

        if (products.length > 0) {
          const productList = products
            .map(
              (p) =>
                `• ${p.name} - ${new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(p.price)}`
            )
            .join("\n");

          return {
            text: `Tôi tìm thấy một số ${sentiment.keyword} phù hợp với bạn:\n\n${productList}\n\nBạn có thể xem thêm chi tiết trên trang sản phẩm. Bạn cần tư vấn thêm về sản phẩm nào không?`,
            products: products,
          };
        } else {
          return {
            text: `Hiện tại chúng tôi chưa có ${sentiment.keyword} phù hợp. Bạn có thể thử tìm kiếm sản phẩm khác hoặc liên hệ với chúng tôi để được tư vấn thêm.`,
          };
        }
      } catch (error) {
        console.error("Error searching products:", error);
      }
    }

    // Default responses for common questions
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("giá") || lowerMessage.includes("gia")) {
      return {
        text: "Giá sản phẩm của chúng tôi rất đa dạng, phù hợp với mọi ngân sách. Bạn có thể cho tôi biết bạn quan tâm đến loại sản phẩm nào để tôi tư vấn cụ thể hơn?",
      };
    }

    if (
      lowerMessage.includes("vận chuyển") ||
      lowerMessage.includes("van chuyen") ||
      lowerMessage.includes("giao hàng")
    ) {
      return {
        text: "Chúng tôi hỗ trợ giao hàng toàn quốc với phí vận chuyển ưu đãi. Đơn hàng trên 5 triệu được miễn phí vận chuyển. Thời gian giao hàng từ 3-7 ngày tùy khu vực.",
      };
    }

    if (
      lowerMessage.includes("bảo hành") ||
      lowerMessage.includes("bao hanh")
    ) {
      return {
        text: "Tất cả sản phẩm của chúng tôi đều được bảo hành 12 tháng. Chúng tôi cam kết đổi trả trong 30 ngày nếu sản phẩm có lỗi từ nhà sản xuất.",
      };
    }

    if (
      lowerMessage.includes("thanh toán") ||
      lowerMessage.includes("thanh toan")
    ) {
      return {
        text: "Chúng tôi hỗ trợ nhiều hình thức thanh toán: COD (thanh toán khi nhận hàng), chuyển khoản ngân hàng, và ví điện tử. Bạn có thể chọn phương thức phù hợp khi đặt hàng.",
      };
    }

    // Default response
    return {
      text: "Tôi có thể giúp bạn:\n\n• Tìm kiếm sản phẩm nội thất\n• Tư vấn lựa chọn sản phẩm phù hợp\n• Thông tin về giá cả, vận chuyển, bảo hành\n• Hỗ trợ đặt hàng\n\nBạn muốn tôi hỗ trợ điều gì?",
    };
  };
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      const response = await generateResponse(inputMessage);

      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: response.text,
        products: response.products,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };
  const handleQuickAction = (query) => {
    setInputMessage(query);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 group cursor-pointer">
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>

          {/* Tooltip */}
          <div className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Tư vấn sản phẩm
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Trợ lý AI</h3>
                <p className="text-xs text-white/80">
                  Luôn sẵn sàng hỗ trợ bạn
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === "user" ? "flex-row-reverse" : ""
                }`}>
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === "user"
                      ? "bg-primary-500 text-white"
                      : "bg-white text-primary-500 border-2 border-primary-500"
                  }`}>
                  {message.type === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`max-w-[70%] ${
                    message.type === "user" ? "items-end" : "items-start"
                  }`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.type === "user"
                        ? "bg-primary-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                    }`}>
                    <p className="text-sm whitespace-pre-line leading-relaxed">
                      {message.text}
                    </p>
                  </div>

                  {/* Product Links */}
                  {message.products && message.products.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.products.map((product) => (
                        <a
                          key={product._id}
                          href={`/products/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-white rounded-lg p-3 hover:shadow-md transition-shadow border border-gray-200">
                          <div className="flex gap-3">
                            <img
                              src={product.images?.[0] || "/placeholder.jpg"}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-primary-500 font-semibold mt-1">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(product.price)}
                              </p>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-1 px-1">
                    {message.timestamp.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-white text-primary-500 border-2 border-primary-500">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 bg-white border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Gợi ý tìm kiếm:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_ACTIONS_AI.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.query)}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-primary-50 hover:text-primary-600 text-gray-700 rounded-full transition-colors cursor-pointer">
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="w-10 h-10 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
