
// "use client";

// import { Suspense, useContext, useEffect, useState } from "react";
// import Notification from "@/components/Notification";
// import { GlobalContext } from "@/context";
// import { fetchAllAddresses } from "@/services/address";
// import { createNewOrder } from "@/services/order";
// import { callStripeSession } from "@/services/stripe";
// import { loadStripe } from "@stripe/stripe-js";
// import { useRouter, useSearchParams } from "next/navigation";
// import { PulseLoader } from "react-spinners";
// import { toast } from "react-toastify";

// export const dynamic = "force-dynamic";

// function CheckoutComponent() {
//   const {
//     cartItems,
//     user,
//     addresses,
//     setAddresses,
//     checkoutFormData,
//     setCheckoutFormData,
//   } = useContext(GlobalContext);

//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [isOrderProcessing, setIsOrderProcessing] = useState(false);
//   const [orderSuccess, setOrderSuccess] = useState(false);

//   const router = useRouter();
//   const params = useSearchParams();

//   const publishableKey = "pk_test_51T01gLFnThOgTloxeYVuzAxLrNgSPjqfiDgyTSBmzlyZzuf7wURclxiTJxiePXZRxoa62zd10O3pAkGIb9hX1s9x00AsaLORvS";
//   const stripePromise = loadStripe(publishableKey);

//   async function getAllAddresses() {
//     const res = await fetchAllAddresses(user?._id);
//     if (res.success) setAddresses(res.data);
//   }

//   useEffect(() => {
//     if (user) getAllAddresses();
//   }, [user]);

//   useEffect(() => {
//     async function createFinalOrder() {
//       const isStripe = JSON.parse(localStorage.getItem("stripe"));

//       if (
//         isStripe &&
//         params.get("status") === "success" &&
//         cartItems?.length > 0
//       ) {
//         setIsOrderProcessing(true);

//         const savedFormData = JSON.parse(
//           localStorage.getItem("checkoutFormData")
//         );

//         const orderData = {
//           user: user?._id,
//           shippingAddress: savedFormData.shippingAddress,
//           orderItems: cartItems.map((item) => ({
//             qty: 1,
//             product: item.productID,
//           })),
//           paymentMethod: "Stripe",
//           totalPrice: cartItems.reduce(
//             (total, item) => item.productID.price + total,
//             0
//           ),
//           isPaid: true,
//           isProcessing: true,
//           paidAt: new Date(),
//         };

//         const res = await createNewOrder(orderData);

//         if (res.success) {
//           setOrderSuccess(true);
//           toast.success(res.message);
//         } else {
//           toast.error(res.message);
//         }

//         setIsOrderProcessing(false);
//       }
//     }

//     createFinalOrder();
//   }, [params, cartItems]);

//   async function handleCheckout() {
//     const stripe = await stripePromise;

//     const lineItems = cartItems.map((item) => ({
//       price_data: {
//         currency: "usd",
//         product_data: {
//           images: [item.productID.imageUrl],
//           name: item.productID.name,
//         },
//         unit_amount: item.productID.price * 100,
//       },
//       quantity: 1,
//     }));

//     const res = await callStripeSession(lineItems);

//     localStorage.setItem("stripe", true);
//     localStorage.setItem(
//       "checkoutFormData",
//       JSON.stringify(checkoutFormData)
//     );

//     await stripe.redirectToCheckout({ sessionId: res.id });
//   }

//   useEffect(() => {
//     if (orderSuccess) {
//       setTimeout(() => router.push("/orders"), 2000);
//     }
//   }, [orderSuccess]);

//   if (orderSuccess) {
//     return (
//       <div className="p-10 text-center">
//         Payment successful! Redirecting to orders...
//       </div>
//     );
//   }

//   if (isOrderProcessing) {
//     return (
//       <div className="w-full min-h-screen flex justify-center items-center">
//         <PulseLoader size={20} />
//       </div>
//     );
//   }

//   return (
//     <div className="p-10">
//       <h1 className="text-xl font-bold">Checkout Page</h1>
//       <button
//         onClick={handleCheckout}
//         className="mt-5 bg-black text-white px-5 py-3"
//         disabled={!cartItems?.length}
//       >
//         Checkout
//       </button>
//       <Notification />
//     </div>
//   );
// }

// export default function CheckoutPage() {
//   return (
//     <Suspense fallback={<div className="p-10">Loading checkout...</div>}>
//       <CheckoutComponent />
//     </Suspense>
//   );
// }


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
  } = useContext(GlobalContext);

  const [isOrderProcessing, setIsOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const router = useRouter();
  const params = useSearchParams();

  // ✅ Use ENV variable
  const publishableKey ="pk_test_51T01gLFnThOgTloxeYVuzAxLrNgSPjqfiDgyTSBmzlyZzuf7wURclxiTJxiePXZRxoa62zd10O3pAkGIb9hX1s9x00AsaLORvS";

  const stripePromise = loadStripe(publishableKey);

  // ===============================
  // Fetch User Addresses
  // ===============================
  async function getAllAddresses() {
    if (!user?._id) return;

    const res = await fetchAllAddresses(user._id);
    if (res?.success) setAddresses(res.data);
  }

  useEffect(() => {
    getAllAddresses();
  }, [user]);

  // ===============================
  // Create Order After Stripe Success
  // ===============================
  useEffect(() => {
    async function createFinalOrder() {
      try {
        const isStripe = localStorage.getItem("stripe");

        if (
          isStripe &&
          params.get("status") === "success" &&
          cartItems?.length > 0 &&
          user
        ) {
          setIsOrderProcessing(true);

          const savedFormData = JSON.parse(
            localStorage.getItem("checkoutFormData")
          );

          const orderData = {
            user: user._id,
            shippingAddress: savedFormData?.shippingAddress,
            orderItems: cartItems.map((item) => ({
              qty: 1,
              product: item.productID._id,
            })),
            paymentMethod: "Stripe",
            totalPrice: cartItems.reduce(
              (total, item) =>
                total + item.productID.price,
              0
            ),
            isPaid: true,
            isProcessing: true,
            paidAt: new Date(),
          };

          const res = await createNewOrder(orderData);

          if (res?.success) {
            toast.success("Payment successful!");
            setOrderSuccess(true);

            localStorage.removeItem("stripe");
            localStorage.removeItem("checkoutFormData");
          } else {
            toast.error(res?.message || "Order failed");
          }

          setIsOrderProcessing(false);
        }
      } catch (error) {
        console.log(error);
        setIsOrderProcessing(false);
      }
    }

    createFinalOrder();
  }, [params, cartItems, user]);

  // ===============================
  // Handle Stripe Checkout
  // ===============================
  async function handleCheckout() {
    try {
      if (!cartItems?.length) {
        toast.error("Cart is empty");
        return;
      }

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

      if (!res?.id) {
        toast.error("Stripe session failed");
        return;
      }

      localStorage.setItem("stripe", "true");
      localStorage.setItem(
        "checkoutFormData",
        JSON.stringify(checkoutFormData)
      );

      await stripe.redirectToCheckout({
        sessionId: res.id,
      });
    } catch (error) {
      console.log(error);
      toast.error("Checkout failed");
    }
  }

  // ===============================
  // Redirect After Success
  // ===============================
  useEffect(() => {
    if (orderSuccess) {
      setTimeout(() => {
        router.push("/orders");
      }, 2000);
    }
  }, [orderSuccess]);

  // ===============================
  // UI STATES
  // ===============================
  if (isOrderProcessing) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <PulseLoader size={15} />
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="p-10 text-center text-green-600 font-semibold">
        Payment successful! Redirecting to orders...
      </div>
    );
  }

  // ===============================
  // MAIN UI
  // ===============================
  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">
        Checkout
      </h1>

      {/* Order Summary */}
      <div className="border p-6 rounded mb-6 shadow">
        <h2 className="font-semibold mb-4">
          Order Summary
        </h2>

        {cartItems?.length > 0 ? (
          <>
            {cartItems.map((item) => (
              <div
                key={item.productID._id}
                className="flex justify-between mb-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.productID.imageUrl}
                    alt={item.productID.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <span>
                    {item.productID.name}
                  </span>
                </div>

                <span>
                  ${item.productID.price}
                </span>
              </div>
            ))}

            <hr className="my-4" />

            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>
                $
                {cartItems.reduce(
                  (total, item) =>
                    total + item.productID.price,
                  0
                )}
              </span>
            </div>
          </>
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={!cartItems?.length}
        className="bg-black text-white px-6 py-3 rounded w-full hover:bg-gray-800 disabled:bg-gray-400"
      >
        Proceed to Payment
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
