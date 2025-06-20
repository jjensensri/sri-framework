"use client";

import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { removeItem } from "components/cart/actions";
import type { CartItem } from "lib/shopify/types";
import { useActionState } from "react";
import { useCart } from "./cart-context";
import clsx from "clsx";

export function DeleteItemButton({
  item,
  type,
}: {
  item: CartItem;
  type: "x" | "trash";
}) {
  const [message, formAction] = useActionState(removeItem, null);
  const merchandiseId = item.merchandise.id;
  const removeItemAction = formAction.bind(null, merchandiseId);
  const { updateCartItem } = useCart();

  return (
    <form
      action={async () => {
        updateCartItem(merchandiseId, "delete");
        removeItemAction();
      }}
    >
      <button
        type="submit"
        aria-label="Remove cart item"
        className={clsx(
          "flex items-center justify-center rounded-full cursor-pointer",
          {
            "h-[24px] w-[24px] bg-white border": type === "x",
          },
          {
            "text-sm gap-1 hover:underline": type !== "x",
          },
        )}
      >
        {type === "x" ? (
          <XMarkIcon className="mx-[1px] h-4 w-4 text-black" />
        ) : (
          <>
            Remove{" "}
            <TrashIcon className="mx-[1px] h-[16px] w-[16px] text-black" />
          </>
        )}
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
