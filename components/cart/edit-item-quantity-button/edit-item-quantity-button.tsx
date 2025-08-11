'use client';

import { BsPlus, BsDash } from 'react-icons/bs';
import { updateItem } from '@components/cart/actions';
import type { LineItem } from '@lib/cart-api/types';
import { useActionState } from 'react';
import styles from './edit-item-quantity-button.module.scss';

function SubmitButton({ type }: { type: 'plus' | 'minus' }) {
  return (
    <button
      type="submit"
      aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
      className={styles['edit-item-quantity-button']}
    >
      {type === 'plus' ? <BsPlus /> : <BsDash />}
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
      className={styles['edit-item-quantity-form']}
    >
      <SubmitButton type={type} />
      <p aria-live="polite" className="visually-hidden" role="status">
        {message}
      </p>
    </form>
  );
}
