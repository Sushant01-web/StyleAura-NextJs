// "use client";

// import { useRouter } from "next/navigation";
// import ProductButton from "./ProductButtons";
// import ProductTile from "./ProductTile";
// import { useEffect } from "react";
// import Notification from "../Notification";


// export default function CommonListing({ data }) {
//   const router = useRouter();

//   return (
//     <section className="bg-white py-12 sm:py-16">
//       <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
//         <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4 lg:mt-16">
//           {data && data.length
//             ? data.map((item) => (
//                 <article
//                   className="relative flex flex-col overflow-hidden border cursor-pointer"
//                   key={item._id}
//                 >
//                   <ProductTile item={item} />
//                   <ProductButton item={item} />
//                 </article>
//               ))
//             : <p>No Products Found</p>}
//         </div>
//       </div>
//       <Notification/>
//     </section>
//   );
// }



"use client";

import ProductButton from "./ProductButtons";
import ProductTile from "./ProductTile";
import Notification from "../Notification";

export default function CommonListing({ data }) {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        
        {/* Responsive Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:mt-16">
          
          {data && data.length > 0 ? (
            data.map((item) => (
              <article
                key={item._id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 bg-white"
              >
                <ProductTile item={item} />
                <ProductButton item={item} />
              </article>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No Products Found
            </p>
          )}

        </div>
      </div>

      <Notification />
    </section>
  );
}
