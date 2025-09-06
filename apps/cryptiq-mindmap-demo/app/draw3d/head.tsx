import Script from "next/script";

export default function Head() {
  return (
    <>
      <Script src="https://unpkg.com/ml5@latest/dist/ml5.min.js" strategy="beforeInteractive" />
    </>
  );
}
