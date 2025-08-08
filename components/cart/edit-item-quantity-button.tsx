'use client';

import { BsPlus, BsDash } from 'react-icons/bs';
import clsx from 'clsx';
import { updateItem } from '@components/cart/actions';
import type { LineItem } from '@lib/cart-api/types';
import { useActionState } from 'react';
import { useCart } from './cart-context';

function SubmitButton({ type }: { type: 'plus' | 'minus' }) {
  return (
    <button
      type="submit"
      aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-50 cursor-pointer',
        {
          'ml-auto': type === 'minus',
        }
      )}
    >
      {type === 'plus' ? (
        <BsPlus className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <BsDash className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({ item, type }: { item: LineItem; type: 'plus' | 'minus' }) {
  const [message, formAction] = useActionState(updateItem, null);
  const payload = {
    lineItemId: item.id,
    quantity: type === 'plus' ? item.quantity + 1 : item.quantity - 1,
  };
  const updateQuantityAction = formAction.bind(null, payload);

  return (
    <form
      action={async () => {
        updateQuantityAction();
      }}
    >
      <SubmitButton type={type} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
