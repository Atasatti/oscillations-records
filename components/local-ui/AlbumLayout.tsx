import Image from "next/image";

const cardData = [
  {
    id: 1,
    image: "/album-scrolling-img1.svg?height=300&width=250",
    title: "Card 1",
  },
  {
    id: 2,
    image: "/album-scrolling-img2.svg?height=400&width=250",
    title: "Card 2",
  },
  {
    id: 3,
    image: "/album-scrolling-img3.svg?height=350&width=250",
    title: "Card 3",
  },
  {
    id: 4,
    image: "/album-scrolling-img4.svg?height=280&width=250",
    title: "Card 4",
  },
];

export default function AlbumLayout() {
  return (
    <div className="h-screen p-6 overflow-hidden w-4/10">
      <div className="h-full max-w-4xl mx-auto -mt-32">
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {cardData.map((card) => (
              <div
                key={card.id}
                className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <Image
                  src={card.image || "/placeholder.svg"}
                  alt={card.title}
                  width={250}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>

          {/* Right Column - Offset downward */}
          <div className="flex flex-col gap-6 pt-20">
            {cardData
              .slice()
              .reverse()
              .map((card) => (
                <div
                  key={card.id}
                  className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <Image
                    src={card.image || "/placeholder.svg"}
                    alt={card.title}
                    width={250}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
