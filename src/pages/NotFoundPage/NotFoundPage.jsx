import { Link } from "react-router-dom";
import TextTrail from "../../components/TextTrail/TextTrail.jsx";
import HoverArrow from "../../components/HoverArrow/HoverArrow.jsx";

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen -mt-28 flex items-end justify-center text-center">
      <div className="absolute inset-0">
        <TextTrail
          text="404"
          fontFamily="Roobert"
          fontWeight="700"
          textColor="#ff8a00"
          backgroundColor={0x0b0b0b}
          backgroundAlpha={1}
          noiseFactor={1}
          noiseScale={0.0005}
          rgbPersistFactor={0.985}
          alphaPersistFactor={0.96}
          supersample={2}
        />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center px-4 md:px-8 pb-16 md:pb-24 pointer-events-none">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase">Page not found</h1>
        <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-xl">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you
          back to the lab.
        </p>
        <Link
          to="/"
          className="group mt-8 inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest text-primary hover:text-white transition-colors pointer-events-auto"
        >
          Return home <HoverArrow className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
