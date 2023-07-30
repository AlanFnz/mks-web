'use client';

import { useState, useEffect, useTransition } from 'react';
import type { CartLineItem } from '@/types';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icons } from '@/components/icons';
import useStore from '@/state/slices/shopifySlice';

interface UpdateCartProps {
  cartLineItem: CartLineItem;
}

export function UpdateCart({ cartLineItem }: UpdateCartProps) {
  const [isPending, startTransition] = useTransition();
  const { removeFromCart, updateCart } = useStore();
  const [quantity, setQuantity] = useState(cartLineItem.quantity || 0);

  const handleAddItem = () => {
    startTransition(async () => {
      await updateCart(cartLineItem.variant.id, quantity + 1);
    });
  };

  const handleRemoveItem = () => {
    startTransition(async () => {
      if (quantity > 1) {
        await updateCart(cartLineItem.variant.id, quantity - 1);
      }
    });
  };

  const handleDeleteItem = () => {
    startTransition(async () => {
      await removeFromCart(cartLineItem.id);
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(async () => {
      const newQuantity = Number(e.target.value);
      await updateCart(cartLineItem.variant.id, newQuantity);
    });
  };

  useEffect(() => {
    setQuantity(cartLineItem.quantity || 0);
  }, [cartLineItem.quantity]);

  return (
    <div className='flex items-center space-x-1'>
      <div className='flex items-center space-x-1'>
        <Button
          variant='outline'
          size='icon'
          className='h-8 w-8'
          onClick={handleRemoveItem}
          disabled={isPending}
        >
          <Icons.remove className='h-3 w-3' aria-hidden='true' />
          <span className='sr-only'>Remove one item</span>
        </Button>
        <Input
          type='number'
          min='0'
          className='h-8 w-14'
          value={quantity}
          onChange={handleQuantityChange}
          disabled={isPending}
        />
        <Button
          variant='outline'
          size='icon'
          className='h-8 w-8'
          onClick={handleAddItem}
          disabled={isPending}
        >
          <Icons.add className='h-3 w-3' aria-hidden='true' />
          <span className='sr-only'>Add one item</span>
        </Button>
      </div>
      <Button
        variant='outline'
        size='icon'
        className='h-8 w-8'
        onClick={handleDeleteItem}
        disabled={isPending}
      >
        <Icons.trash className='h-3 w-3' aria-hidden='true' />
        <span className='sr-only'>Delete item</span>
      </Button>
    </div>
  );
}
