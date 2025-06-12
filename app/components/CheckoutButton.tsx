'use client'

import { useRouter } from 'next/navigation'

export const CheckoutButton = ({
  priceId,
  isAnnual
}: {
  priceId: string
  isAnnual: boolean
}) => {
  const router = useRouter()

  const handleClick = () => {
    console.log('🔍 Enviando para checkout com:', { priceId, isAnnual })
    router.push(`/checkout?priceId=${priceId}&isAnnual=${isAnnual}`)
  }

  const label = isAnnual ? 'Começar Plano Anual' : 'Assinar Plano Mensal'

  return (
    <button
      onClick={handleClick}
      className="w-full py-3 px-6 mt-2 rounded-md font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
    >
      {label}
    </button>
  )
}
