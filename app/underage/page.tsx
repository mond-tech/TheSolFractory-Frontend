import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function UnderagePage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-6">
      <div>
        <Image
            src="/logo.png"
            width={120}
            height={100}
            alt="Age Restricted"
            className="mx-auto mb-4"
        />

        <h1 className="text-3xl font-bold mb-3">
          Access Restricted
        </h1>

        <div className="text-gray-200 w-7/12 mx-auto">
          You must be 21 or older to view this content.
          
        </div>

        {/* <div className="p-10 pr-4 flex gap-1 items-center justify-center">
          <Link href={"/"} className="underline underline-white underline-offset-4">Go to Homepage </Link>
          <ArrowRight height={16} width={16}/>
        </div> */}
      </div>
    </div>
  );
}