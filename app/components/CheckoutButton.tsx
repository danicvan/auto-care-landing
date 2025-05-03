'use client'

import { useRouter } from 'next/navigation';

export const CheckoutButton = ({ priceId, isAnnual }: { priceId: string, isAnnual: boolean }) => {
  const router = useRouter();

  const handleClick = () => {
    console.log("🔍 Enviando para checkout com:", { priceId, isAnnual });
    router.push(`/checkout?priceId=${priceId}&isAnnual=${isAnnual}`);
  };  

  return <button onClick={handleClick}>Assinar</button>;
};