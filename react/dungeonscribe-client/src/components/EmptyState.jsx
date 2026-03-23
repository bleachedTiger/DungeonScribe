function EmptyState({icon, message, actionLabel, onAction}) {
    return(
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-gray-800 rounded-lg border border-gray-700">
            {icon && <span className="text-5xl">{icon}</span>}
            <p className="text-gray-400">{message}</p>
            {onAction && (
                <button
                    onClick={onAction}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-2 rounded transition-colors"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    )
}

export default EmptyState;