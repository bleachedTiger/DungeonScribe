function SearchInput({value, onChange, placeHolder}){
    return(
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
            </span>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeHolder || "Search..."}
                className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-3 border border-gray-600 focus:border-amber-500 focus:outline-none"
            />
        </div>
    )
}

export default SearchInput