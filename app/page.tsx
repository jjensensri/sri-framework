import { Carousel } from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import Footer from "components/layout/footer";

export const metadata = {
  title: "Cart API Demo Storefront",
  description: "Stone Rooster e-commerce framework",
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <ThreeItemGrid />
      <Carousel />
      <Footer />
    </>
  );
}
