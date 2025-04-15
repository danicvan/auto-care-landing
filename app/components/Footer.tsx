"use client"

import { useTheme } from "./ThemeProvider"

export default function Footer() {
  const { theme, toggleTheme } = useTheme()

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 text-center md:text-left">
            <h3 className="text-2xl font-bold text-blue-500">Auto Care</h3>
            <p className="mt-2 text-sm">Experimente o futuro da estética automotiva</p>
          </div>
          <div className="w-full md:w-1/3 text-center mt-4 md:mt-0">
            <p>&copy; 2025 Auto Care. Todos os direitos reservados.</p>
          </div>
          <div className="w-full md:w-1/3 text-center md:text-right mt-4 md:mt-0 flex items-center justify-center md:justify-end">
            <span className="mr-2">Tema {theme === "light" ? "Claro" : "Escuro"}</span>
            <button
              onClick={toggleTheme}
              className={`w-14 h-7 flex items-center rounded-full p-1 ${
                theme === "light" ? "bg-gray-300" : "bg-blue-500"
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                  theme === "light" ? "translate-x-0" : "translate-x-7"
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
