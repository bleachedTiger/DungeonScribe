interface LoadingSpinnerProps {
    message?: string;
}

function LoadingSpinner({message = 'Loading...'}:LoadingSpinnerProps) {
    return(
        <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-10 h-10 border-4 border-gray-600 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">{message}</p>
        </div>
    )
}

export default LoadingSpinner;