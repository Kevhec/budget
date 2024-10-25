import {
  ChevronDown, LogOut, Menu, Moon, Settings, User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback/* , AvatarImage */ } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import {
  Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger,
} from './ui/sheet';
import Navigation from './Navigation';
/* import { SidebarTrigger } from './ui/sidebar'; */

export default function Header() {
  const { state, logout } = useAuth();
  const navigation = useNavigate();
  const [avatarFallback, setAvatarFallback] = useState<string>('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state.user && state.user.username) {
      const { username } = state.user;
      const usernameWordSplit = username.trim().toUpperCase().split(' ');
      const singleWord = usernameWordSplit.length === 1;

      let newAvatarFallback;

      if (singleWord) {
        newAvatarFallback = usernameWordSplit[0][0] + usernameWordSplit[0][1];
      } else {
        newAvatarFallback = usernameWordSplit[0][0] + usernameWordSplit[1][0];
      }

      setAvatarFallback(newAvatarFallback);
    }
  }, [state.user]);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const handleDropdown = (isOpen: boolean) => {
    setIsProfileDropdownOpen(isOpen);
  };

  const handleLogOutUser = () => {
    logout();
    navigation('/');
  };

  const userDropdownArrowClasses = cn('transition-transform', {
    '-rotate-180': isProfileDropdownOpen,
  });

  return (
    <header className="px-4 py-4 gap-x-2 bg-white flex justify-between items-center">
      <Sheet open={open} onOpenChange={setOpen}>
        {/* <SidebarTrigger /> */}
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs font-openSans bg-[#343A40] text-white border-none">
          <SheetTitle className="sr-only">Menú de la aplicación</SheetTitle>
          <SheetDescription className="sr-only">Navega a través de budget</SheetDescription>
          <p className="text-3xl font-semibold mb-32 font-openSans">Budget</p>
          <Navigation />
        </SheetContent>
      </Sheet>
      <p className="flex-1">
        ¡Hola!
        {' '}
        <span className="font-bold">
          {state.user?.username || ''}
        </span>
      </p>
      <DropdownMenu onOpenChange={handleDropdown}>
        <DropdownMenuTrigger className="flex gap-x-1 items-center">
          <Avatar>
            {/* <AvatarImage /> */}
            <AvatarFallback>
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className={userDropdownArrowClasses} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            Mi Cuenta
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 w-4 h-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Moon className="mr-2 w-4 h-4" />
              <span>Modo oscuro</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 w-4 h-4" />
              <span>Opciones</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogOutUser}>
            <Button asChild>
              <>
                <LogOut className="mr-2 w-4 h-4" />
                <span>Cerrar Sesión</span>
              </>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
