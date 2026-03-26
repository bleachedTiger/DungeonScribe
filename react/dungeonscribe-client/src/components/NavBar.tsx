import { Link, useNavigate } from "react-router-dom";
import { UseAuth } from "../context/AuthContext";

function Navbar(){
    const { logout } = UseAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (
        <nav className="bg-gray-800 border-b border-gray700 px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <Link
                    to="/campaigns"
                    className="text-xl font-bold text-amber-500 hover:text-amber-400"
                >
                  ⚔️ DungeonScribe  
                </Link>

                <div className="flex items-center gap-6">
                    <Link
                        to="/campaigns"
                        className="text-gray-300 hover:text-white transition-colors"
                    >
                        Campaigns
                    </Link>
                    <Link
                        to="/dnd/spells"
                        className="text-gray-300 hover:text-white transition-colors"
                    >
                        Spells
                    </Link>
                    <Link
                        to="/dnd/monsters"
                        className="text-gray-300 hover:text-white transition-colors"
                    >
                        Monsters
                    </Link>
                    <Link
                        to="/dnd/items"
                        className="text-gray-300 hover:text-white transition-colors"
                    >
                        Magic Items
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;