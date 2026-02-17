
"use client";

import { Suspense, useContext, useEffect, useState } from "react";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { fetchAllAddresses } from "@/services/address";
import { createNewOrder } from "@/services/order";
import { callStripeSession } from "@/services/stripe";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

export const dynamic = "force-dynamic";

function CheckoutComponent() {
  const {
    cartItems,
    user,
    addresses,
    setAddresses,
    checkoutFormData,
    setCheckoutFormData,
  } = useContext(GlobalContext);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isOrderProcessing, setIsOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const router = useRouter();
  const params = useSearchParams();

  const publishableKey = "pk_test_51T01gLFnThOgTloxeYVuzAxLrNgSPjqfiDgyTSBmzlyZzuf7wURclxiTJxiePXZRxoa62zd10O3pAkGIb9hX1s9x00AsaLORvS";
  const stripePromise = loadStripe(publishableKey);

  async function getAllAddresses() {
    const res = await fetchAllAddresses(user?._id);
    if (res.success) setAddresses(res.data);
  }

  useEffect(() => {
    if (user) getAllAddresses();
  }, [user]);

  useEffect(() => {
    async function createFinalOrder() {
      const isStripe = JSON.parse(localStorage.getItem("stripe"));

      if (
        isStripe &&
        params.get("status") === "success" &&
        cartItems?.length > 0
      ) {
        setIsOrderProcessing(true);

        const savedFormData = JSON.parse(
          localStorage.getItem("checkoutFormData")
        );

        const orderData = {
          user: user?._id,
          shippingAddress: savedFormData.shippingAddress,
          orderItems: cartItems.map((item) => ({
            qty: 1,
            product: item.productID,
          })),
          paymentMethod: "Stripe",
          totalPrice: cartItems.reduce(
            (total, item) => item.productID.price + total,
            0
          ),
          isPaid: true,
          isProcessing: true,
          paidAt: new Date(),
        };

        const res = await createNewOrder(orderData);

        if (res.success) {
          setOrderSuccess(true);
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }

        setIsOrderProcessing(false);
      }
    }

    createFinalOrder();
  }, [params, cartItems]);

  async function handleCheckout() {
    const stripe = await stripePromise;

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          images: [item.productID.imageUrl],
          name: item.productID.name,
        },
        unit_amount: item.productID.price * 100,
      },
      quantity: 1,
    }));

    const res = await callStripeSession(lineItems);

    localStorage.setItem("stripe", true);
    localStorage.setItem(
      "checkoutFormData",
      JSON.stringify(checkoutFormData)
    );

    await stripe.redirectToCheckout({ sessionId: res.id });
  }

  useEffect(() => {
    if (orderSuccess) {
      setTimeout(() => router.push("/orders"), 2000);
    }
  }, [orderSuccess]);

  if (orderSuccess) {
    return (
      <div className="p-10 text-center">
        Payment successful! Redirecting to orders...
      </div>
    );
  }

  if (isOrderProcessing) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <PulseLoader size={20} />
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold">Checkout Page</h1>
      <button
        onClick={handleCheckout}
        className="mt-5 bg-black text-white px-5 py-3"
        disabled={!cartItems?.length}
      >
        Checkout
      </button>
      <Notification />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading checkout...</div>}>
      <CheckoutComponent />
    </Suspense>
  );
}
