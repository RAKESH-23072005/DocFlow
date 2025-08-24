import { useLocation } from "wouter";
 

export default function Header() {
  const [, setLocation] = useLocation();

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
          <img
                src="/doclogo.webp"
                alt="docFlow Logo"
                className="h-8 w-auto"
                loading="lazy"
                decoding="async"
                width="32"
                height="32"
              />
            <div
              className="text-2xl font-bold text-gray-900 cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => setLocation("/")}
            >
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                doc
              </span>
              <span className="text-primary font-extrabold">Flow</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          {/* <nav className="hidden lg:flex space-x-2">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setLocation(item.href)}
                className={`group relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                  location === item.href
                    ? "text-primary bg-blue-50 border-2 border-primary/20"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {location === item.href && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                )}
              </button>
            ))}
          </nav> */}

          {/* Auth Buttons & Mobile Menu Button */}
          {/* <div className="flex items-center space-x-3">
            <Button variant="outline" className="hidden md:inline-block">Login</Button>
            <Button className="hidden md:inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200">Sign up</Button>
            <button
              className="lg:hidden text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div> */}
        </div>
      </div>

      {/* Mobile Menu */}
      {/* {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-xl z-50 animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setLocation(item.href);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 w-full ${
                  location === item.href
                    ? "text-primary bg-blue-50 border border-primary/20"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
            <Button variant="ghost" className="w-full flex items-center space-x-3">
              <Settings className="w-5 h-5" />
              <span>More Tools</span>
            </Button>
            <div className="flex space-x-2 pt-2">
              <Button variant="outline" className="flex-1">Login</Button>
              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white">Sign up</Button>
            </div>
          </div>
        </div>
      )} */}
    </header>
  );
}
