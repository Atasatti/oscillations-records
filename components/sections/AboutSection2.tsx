import Image from "next/image";

export default function AboutSection2() {
  return (
    <section
      className="relative bg-no-repeat bg-cover pt-24 pb-50"
      style={{ backgroundImage: `url('/about-section2-bg.svg')` }}
    >

      {/* Top right image */}
      <div className="absolute top-12 right-18 transform rotate-12 hover:rotate-0 transition-transform duration-300">
        <Image
          src="/about-section2-side2.svg?height=200&width=200"
          alt="Music album cover"
          width={200}
          height={300}
          className="rounded-lg shadow-2xl w-32 h-32 md:w-48 md:h-48 object-cover"
        />
      </div>

      {/* Center left image */}
      <div className="absolute top-0 left-18  transform -translate-y-1/2 rotate-6 hover:rotate-0 transition-transform duration-300">
        <Image
          src="/about-section2-side1.svg?height=200&width=200"
          alt="Music album cover"
          width={200}
          height={300}
          className="rounded-lg shadow-2xl w-28 h-28 md:w-40 md:h-40 object-cover"
        />
      </div>

      {/* Bottom right image */}
      <div className="absolute bottom-20 right-18 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
        <Image
          src="/about-section2-side1.svg?height=200&width=200"
          alt="Music album cover"
          width={200}
          height={300}
          className="rounded-lg shadow-2xl w-32 h-32 md:w-48 md:h-48 object-cover"
        />
      </div>

      {/* Bottom left image */}
      <div className="absolute -bottom-20 left-18 transform rotate-12 hover:rotate-0 transition-transform duration-300">
        <Image
          src="/about-section2-side3.svg?height=200&width=200"
          alt="Music album cover"
          width={200}
          height={300}
          className="rounded-lg shadow-2xl w-28 h-28 md:w-40 md:h-40 object-cover"
        />
      </div>
      <div className="mx-auto max-w-lg">
        <p className="text-muted-foreground text-center font-light mt-8">
          We’re not a major label. We’re a team of music lovers who believe in
          doing things differently. Based in Manchester but working globally, we
          focus on raw talent, smart marketing, and creating real opportunities
          for artists.
        </p>
        <p className="text-muted-foreground text-center font-light mt-6">
          No endless meetings. No BS. Just results.
        </p>
      </div>
        <Image src="/about-section2-img.svg" width={300} height={200} alt="section2" className="mx-auto mt-22 rotate-[9deg]"/>
      <div className="mx-auto max-w-lg mt-22">
        <p className="font-light text-5xl opacity-90 text-center tracking-tighter">
          The Future of Music Starts Here.
        </p>
        <p className="text-muted-foreground text-center font-light mt-6">
          We’re combining creativity, technology, and smart strategy to build
          something new. This isn’t about following trends—it’s about creating
          them.
        </p>
      </div>
    </section>
  );
}
