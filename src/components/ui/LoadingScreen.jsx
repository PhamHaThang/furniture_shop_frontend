import Spinner from "./Spinner";

const LoadingScreen = ({ message = "Đang tải..." }) => {
  return (
    <div className="fixed inset-0 bg-beige-50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <Spinner size="xl" />
        <p className="mt-4 text-char-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
