const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      {Icon && (
        <div className="w-20 h-20 bg-beige-100 rounded-full flex items-center justify-center mb-4">
          <Icon size={40} className="text-char-400" />
        </div>
      )}
      {title && (
        <h3 className="text-xl font-semibold text-char-900 mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-char-500 text-center max-w-md mb-6">{description}</p>
      )}
      {action}
    </div>
  );
};

export default EmptyState;
