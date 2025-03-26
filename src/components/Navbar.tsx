import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast()
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
      toast({
        title: "Cerrado sesión exitosamente.",
      })
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Algo salió mal.",
        description: "Hubo un error al cerrar sesión. Por favor, inténtalo de nuevo.",
      })
    }
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          <span className="hidden font-bold sm:inline-block">FID</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:gap-4">
              <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
                Inicio
              </Link>
              <Link to="/paquetes-web" className="text-sm font-medium transition-colors hover:text-primary">
                Paquetes Web
              </Link>
              <Link to="/blog" className="text-sm font-medium transition-colors hover:text-primary">
                Blog
              </Link>
              <Link to="/portfolio" className="text-sm font-medium transition-colors hover:text-primary">
                Portfolio
              </Link>
              <Link to="/contact" className="text-sm font-medium transition-colors hover:text-primary">
                Contacto
              </Link>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url || ""} alt={user.user_metadata?.full_name || user.user_metadata?.username || "Avatar"} />
                        <AvatarFallback>{user.user_metadata?.full_name?.charAt(0) || user.user_metadata?.username?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/admin')}>Panel de Administrador</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>Cerrar Sesión</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium transition-colors hover:text-primary">
                    Iniciar Sesión
                  </Link>
                </>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="border-b md:hidden">
          <div className="container flex flex-col space-y-3 py-4">
            <Link to="/" className="block text-sm font-medium transition-colors hover:text-primary">
              Inicio
            </Link>
            <Link to="/paquetes-web" className="block text-sm font-medium transition-colors hover:text-primary">
              Paquetes Web
            </Link>
            <Link to="/blog" className="block text-sm font-medium transition-colors hover:text-primary">
              Blog
            </Link>
            <Link to="/portfolio" className="block text-sm font-medium transition-colors hover:text-primary">
              Portfolio
            </Link>
            <Link to="/contact" className="block text-sm font-medium transition-colors hover:text-primary">
              Contacto
            </Link>
            {user ? (
              <>
                <Link to="/admin" className="block text-sm font-medium transition-colors hover:text-primary">
                  Panel de Administrador
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Link to="/login" className="block text-sm font-medium transition-colors hover:text-primary">
                Iniciar Sesión
              </Link>
            )}
             <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle dark mode</span>
              </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
