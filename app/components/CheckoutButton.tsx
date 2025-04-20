'use client'

import { useRouter } from 'next/navigation';

export const CheckoutButton = ({ priceId, isAnnual }: { priceId: string, isAnnual: boolean }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/checkout?priceId=${priceId}&isAnnual=${isAnnual}`);
  };

  return <button onClick={handleClick}>Assinar</button>;
};