interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-900/50 border border-red-500 px-4 py-3 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-red-400 text-lg">⚠️</span>
        <span className="text-red-200 text-sm">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-red-300 hover:text-white text-sm border border-red-500 hover:border-white px-3 py-1 rounded transition-colors ml-4 shrink-0"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;