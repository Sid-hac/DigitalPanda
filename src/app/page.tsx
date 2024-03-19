import Image from "next/image";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowDownToLine, CheckCircle, Leaf } from "lucide-react";

const perks = [
  {
    name: "Instant Delivery",
    icon: ArrowDownToLine,
    description: "Get your assets delivered to your email in seconds"
  },
  {
    name: "Guaranteed Quality",
    icon: CheckCircle,
    description: "Every asset on our platform is verified by our team to ensure our high quality standards. not happy? we offer a 30-day refund guarantee."
  },
  {
    name: "For the planet",
    icon: Leaf,
    description: "we've pledged 1% of our sales to preservation and restoration of nature"
  }
]
export default function Home() {
  return (
    <>

      <MaxWidthWrapper>
        <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold  tracking-tight text-gray-900 sm:text-6xl ">
            Your marketplace for high quality{' '}
            <span className="text-blue-700">Digital Assets</span>
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Welcome to digitalPanda. Every asset on our platform is verified by our team to ensure our hihest quality standards.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Link href="/products" className={buttonVariants()}>Browse Trending</Link>
            <Button variant="ghost">Our Quality Promise &rarr;</Button>
          </div>
        </div>

        {/* TODO: list products */}

      </MaxWidthWrapper>
      <section className="border-t border-gray-200 bg-gray-50">
        <MaxWidthWrapper classname="py-20">
          <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {perks.map((perk) => (
              <div key={perk.name} className="text-center flex  items-center flex-col">
                <div className="md:flex-shrink-0 flex justify-center">
                  <div className="h-16 w-16 flex justify-center items-center rounded-full bg-blue-100">
                    {<perk.icon className="w-1/3 h-1/3" />}
                  </div>
               </div>
                <div className="mt-4 md:ml-4 md:mt-0  lg:ml-0 lg:mt-4">
                   <h3 className="text-base font-medium text-gray-900">
                      {perk.name}
                   </h3>
                   <p className="mt-3 text-sm text-muted-foreground">
                      {perk.description}
                   </p>
                </div>

              </div>
            ))}

          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
