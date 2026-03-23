import Navbar from "./NavBar";

function Layout({ children }) {
    return(
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    )
}

export default Layout