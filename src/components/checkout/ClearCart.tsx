"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";

/** Clears the cart once, after a completed order. */
export default function ClearCart() {
  useEffect(() => {
    useCart.persist.rehydrate();
    useCart.getState().clear();
  }, []);
  return null;
}
