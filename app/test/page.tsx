// import BlenderAnimation from "@/components/BlenderAnimation"

// export default function Home() {
//   return <BlenderAnimation />
// }
// pages/index.jsx (or app/page.jsx)
// app/page.jsx
'use client'
import dynamic from "next/dynamic";
const SmokeSection = dynamic(() => import("../../src/testcomponents/SmokeSection"), { ssr: false });

export default function Page() {
  return (
    <main>
      {/* other parts */}
      <SmokeSection />
      {/* rest */}
    </main>
  );
}

