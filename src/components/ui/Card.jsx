const Card = ({ children, className = "", padding = "md", ...props }) => {
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border border-beige-200
        ${paddings[padding]}
        ${className}
      `}
      {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={`border-b border-beige-200 pb-4 mb-4 ${className}`}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className = "" }) => {
  return (
    <h3 className={`text-lg font-semibold text-char-900 ${className}`}>
      {children}
    </h3>
  );
};

const CardContent = ({ children, className = "" }) => {
  return <div className={className}>{children}</div>;
};

const CardFooter = ({ children, className = "" }) => {
  return (
    <div className={`border-t border-beige-200 pt-4 mt-4 ${className}`}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
