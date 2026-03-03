"use client";

interface NavbarProps {
  name: string;
}

export default function Navbar({ name }: NavbarProps) {
  return (
    <nav className="w-full bg-white border-b px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <img
          src="FlatMate_Logo.svg"
          className="h-8 w-auto"
        />
      </div>

      {/* Welcome Text */}
      <div className="text-sm sm:text-base text-gray-700">
        Welcome, <span className="font-medium">{name}</span>
      </div>

    </nav>
  );
}