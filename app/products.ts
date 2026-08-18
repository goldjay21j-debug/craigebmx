export type Bike = {
  id: number;
  slug: string;
  name: string;
  year: number;
  brand: string;
  style: "Freestyle" | "Race";
  price: number | null;
  description: string;
  highlights: string[];
  images: string[];
  sourceLabel?: string;
  sourceUrl?: string;
};

function bmxMuseumGallery(productId: string, photoCount: number) {
  return [
    `/products/bmxmuseum-${productId}/cover.jpg`,
    ...Array.from(
      { length: photoCount - 1 },
      (_, index) => `/products/bmxmuseum-${productId}/photo-${String(index + 2).padStart(2, "0")}.jpg`,
    ),
  ];
}

export const bikes: Bike[] = [
  {
    id: 1,
    slug: "1985-hutch-trick-star",
    name: "1985 Hutch Trick Star",
    year: 1985,
    brand: "Hutch",
    style: "Freestyle",
    price: 2500,
    description:
      "The Trick Star was one of the defining freestyle BMX bikes of the 1980s. This collector-ready example is finished in candy red and makes a remarkable centrepiece for an old-school collection.",
    highlights: ["Candy-red finish", "Collector presentation", "Worldwide shipping available"],
    images: [
      "/products/1985-hutch-trick-star/cover.png",
      "/products/1985-hutch-trick-star/photo-02.jpg",
      "/products/1985-hutch-trick-star/photo-03.jpg",
      "/products/1985-hutch-trick-star/photo-04.jpg",
      "/products/1985-hutch-trick-star/photo-05.jpg",
    ],
  },
  {
    id: 2,
    slug: "1987-gt-performer-chrome",
    name: "1987 GT Performer — Chrome",
    year: 1987,
    brand: "GT",
    style: "Freestyle",
    price: 1500,
    description:
      "One of the most recognisable freestyle BMX bikes of the era. The chrome finish, white Tuff Wheels and purple-and-pink accents give this GT Performer its unmistakable period character.",
    highlights: ["Chrome frame", "White Tuff Wheels", "Period colour accents"],
    images: [1, 2, 3, 4, 5].map((image) => `/products/1987-gt-performer-chrome/photo-0${image}.jpg`),
  },
  {
    id: 3,
    slug: "1983-skyway-ta-survivor",
    name: "1983 Skyway T/A Survivor",
    year: 1983,
    brand: "Skyway",
    style: "Race",
    price: 1500,
    description:
      "A collector-quality Skyway T/A survivor assembled with an exceptional catalogue of period-correct and new-old-stock components.",
    highlights: [
      "NOS Elina seat and Suntour clamp",
      "UKAI Speedline rims and Patriot Bullseye hubs",
      "MX-1000 brakes with Tech 4 levers",
      "Oakley B1B grips and Skyway Tuff pedals",
      "Tioga Comp III tyres and Izumi chain",
    ],
    images: [
      "/products/1983-skyway-ta-survivor/cover.png",
      ...[1, 2, 3, 4, 5].map((image) => `/products/1983-skyway-ta-survivor/photo-0${image}.jpg`),
    ],
  },
  {
    id: 4,
    slug: "1983-diamond-back-silver-streak-mag",
    name: "1983 Diamond Back Silver Streak — Mag Wheels",
    year: 1983,
    brand: "Diamond Back",
    style: "Race",
    price: 1500,
    description:
      "An authentic Silver Streak in collector-quality condition. Its chrome finish, black mag wheels and period-correct components make it a strong example of this sought-after Diamond Back model.",
    highlights: ["Chrome finish", "Black mag wheels", "Collector-quality condition"],
    images: [1, 2, 3, 4].map((image) => `/products/1983-diamond-back-silver-streak-mag/photo-0${image}.jpg`),
  },
  {
    id: 5,
    slug: "1987-gt-pro-freestyle-tour-maui-blue",
    name: "1987 GT Pro Freestyle Tour — Maui Blue",
    year: 1987,
    brand: "GT",
    style: "Freestyle",
    price: 1500,
    description:
      "A rare GT Pro Freestyle Tour in the iconic Maui Blue colourway. Clean, complete and presented in collector-quality condition for a serious old-school BMX collection.",
    highlights: ["Maui Blue colourway", "Matching GT components", "Collector-quality presentation"],
    images: [1, 2, 3, 4, 5].map((image) => `/products/1987-gt-pro-freestyle-tour-maui-blue/photo-0${image}.jpg`),
  },
  {
    id: 6,
    slug: "1983-diamond-back-silver-streak-survivor",
    name: "1983 Diamond Back Silver Streak — Original Survivor",
    year: 1983,
    brand: "Diamond Back",
    style: "Race",
    price: 1500,
    description:
      "An original Silver Streak survivor in outstanding collector condition, retaining an impressive selection of Diamond Back and period-correct components.",
    highlights: [
      "Original Diamond Back frame, fork, bars and pedals",
      "Sugino crankset with Tange headset and bottom bracket",
      "Dia-Compe 890 brakes with Tech 3 levers",
      "Araya large-flange wheels",
      "Fuji Aero seat, Cobra grips and period-correct tyres",
    ],
    images: [
      "/products/1983-diamond-back-silver-streak-survivor/cover.png",
      ...[1, 2, 3, 4, 5].map((image) => `/products/1983-diamond-back-silver-streak-survivor/photo-0${image}.jpg`),
    ],
  },
  {
    id: 7,
    slug: "1987-gt-performer-day-glo-pink",
    name: "1987 GT Performer — Day-Glo Pink",
    year: 1987,
    brand: "GT",
    style: "Freestyle",
    price: 1500,
    description:
      "One of the most celebrated GT Performer colourways. This Day-Glo Pink example pairs its vivid frame with white Skyway Tuff Wheels for an unmistakably 1987 finish.",
    highlights: ["Day-Glo Pink finish", "White Skyway Tuff Wheels", "Collector-quality condition"],
    images: [
      "/products/1987-gt-performer-day-glo-pink/cover.png",
      ...[2, 3, 4, 5].map((image) => `/products/1987-gt-performer-day-glo-pink/photo-0${image}.jpg`),
    ],
  },
  {
    id: 8,
    slug: "1988-haro-master-team-model",
    name: "1988 Haro Master Team Model",
    year: 1988,
    brand: "Haro",
    style: "Freestyle",
    price: 1500,
    description:
      "A collector-quality Haro Master Team Model presented in excellent condition, finished in a classic late-eighties turquoise colourway.",
    highlights: ["Team Model specification", "Turquoise finish", "Excellent collector condition"],
    images: [1, 2, 3].map((image) => `/products/1988-haro-master-team-model/photo-0${image}.jpg`),
  },
  {
    id: 9,
    slug: "1983-redline-pl-20",
    name: "1983 Redline PL-20",
    year: 1983,
    brand: "Redline",
    style: "Race",
    price: 1200,
    description:
      "One of the early 1980s’ defining race BMX bikes. The Redline PL-20 helped shape an era and remains a sought-after machine among old-school collectors and riders.",
    highlights: ["Classic PL-20 race geometry", "Chrome finish", "Period Redline details"],
    images: [1, 2, 3, 4].map((image) => `/products/1983-redline-pl-20/photo-0${image}.jpg`),
  },
  {
    id: 10,
    slug: "1987-gt-performer-maui-blue",
    name: "1987 GT Performer — Maui Blue",
    year: 1987,
    brand: "GT",
    style: "Freestyle",
    price: 1500,
    description:
      "The Maui Blue finish and white Skyway Tuff Wheels form one of the golden era’s most memorable combinations. This GT Performer is presented as a vibrant collector piece.",
    highlights: ["Maui Blue colourway", "White Skyway Tuff Wheels", "Golden-era freestyle build"],
    images: [
      "/products/1987-gt-performer-maui-blue/cover.png",
      ...[2, 3, 4].map((image) => `/products/1987-gt-performer-maui-blue/photo-0${image}.jpg`),
    ],
  },
  {
    id: 11,
    slug: "1987-gt-performer-og-nos",
    name: "1987 GT Performer — OG/NOS Build",
    year: 1987,
    brand: "GT",
    style: "Freestyle",
    price: 1500,
    description:
      "A remarkably original 1987 GT Performer build featuring an extensive selection of original and new-old-stock parts.",
    highlights: [
      "NOS AME GT grips",
      "NOS Dominator seat with blue lettering",
      "GT-stamped 41T chainwheel with GT disc",
      "1989 GT pedals",
      "NOS Odyssey white cables",
      "NOS 26T pegs",
    ],
    images: [1, 2, 3, 4, 5].map((image) => `/products/1987-gt-performer-og-nos/photo-0${image}.jpg`),
  },
  {
    id: 12,
    slug: "1984-diamond-back-harry-leary-turbo",
    name: "1984 Diamond Back Harry Leary Turbo",
    year: 1984,
    brand: "Diamond Back",
    style: "Race",
    price: 1300,
    description:
      "A clean and well-preserved 1984 Diamond Back Harry Leary Turbo—a strong collector opportunity and an iconic old-school BMX build.",
    highlights: ["Harry Leary Turbo model", "Well-preserved collector presentation", "Worldwide shipping available"],
    images: [1, 2, 3, 4, 5].map(
      (image) => `/products/1984-diamond-back-harry-leary-turbo/photo-0${image}.jpg`,
    ),
  },
  {
    id: 13,
    slug: "1983-gt-pro-nora-cup",
    name: "1983 GT Pro — NORA Cup Stickers",
    year: 1983,
    brand: "GT",
    style: "Race",
    price: 1500,
    description:
      "A less-common 1983 GT Pro build wearing NORA Cup stickers and a strong catalogue of period-correct components.",
    highlights: [
      "Tuff Neck stem and GT handlebar",
      "Tange headset",
      "Dia-Compe MX1000 with dated 1983 cable",
      "Maxy Cross crank with NOS KKT pedals",
      "Araya rims with Sunshine high-flange hubs",
      "Mitsuboshi Comp III tyres, AME grips and GT seat",
    ],
    images: [1, 2, 3, 4].map((image) => `/products/1983-gt-pro-nora-cup/photo-0${image}.jpg`),
  },
  {
    id: 14,
    slug: "1981-mongoose-supergoose",
    name: "1981 Mongoose Supergoose",
    year: 1981,
    brand: "Mongoose",
    style: "Race",
    price: 1100,
    description:
      "A 1981 Mongoose Supergoose assembled around the classic Supergoose frame and fork with a detailed period-style component set.",
    highlights: [
      "Supergoose frame and fork with new BMX Products decals",
      "Stainless bars with Mongoose gold stem",
      "Tuff Wheels and original crank with KKT-KMX pedals",
      "Dia-Compe MX1000 with Tech 3 lever",
      "Mongoose seat, post and clamp",
      "IRC Comp 2 rear and NOS Snakebelly front tyres",
    ],
    images: [1, 2, 3, 4].map((image) => `/products/1981-mongoose-supergoose/photo-0${image}.jpg`),
  },
  {
    id: 15,
    slug: "1987-gt-pro-freestyle-tour-team-purple",
    name: "1987 GT Pro Freestyle Tour Team Model — Purple",
    year: 1987,
    brand: "GT",
    style: "Freestyle",
    price: 1500,
    description:
      "A 1987 GT Pro Freestyle Tour Team Model in a rich purple finish, presented as a vivid golden-era freestyle collector piece.",
    highlights: ["Purple period colourway", "Team Model specification", "Three-photo catalogue gallery"],
    images: [1, 2, 3].map(
      (image) => `/products/1987-gt-pro-freestyle-tour-team-purple/photo-0${image}.jpg`,
    ),
  },
  {
    id: 16,
    slug: "gt-pft-team-blue-pink-nos-collection",
    name: "GT PFT Team Collection — Blue, Pink & NOS",
    year: 1987,
    brand: "GT",
    style: "Freestyle",
    price: 3000,
    description:
      "A three-bike collector listing featuring 1987 GT Pro Freestyle Tour Team models in blue and pink, plus a NOS 1986 GT Pro Performer.",
    highlights: [
      "1987 PFT Team in blue",
      "1987 PFT Team in pink",
      "1986 GT Pro Performer — NOS",
      "Catalogue notes $1,500 each or offers for multiple bikes",
    ],
    images: [1, 2, 3].map(
      (image) => `/products/gt-pft-team-blue-pink-nos-collection/photo-0${image}.jpg`,
    ),
  },
  {
    id: 17,
    slug: "1987-gt-pro-freestyle-tour-team-white-blue",
    name: "1987 GT Pro Freestyle Tour Team Model — White & Blue",
    year: 1987,
    brand: "GT",
    style: "Freestyle",
    price: 1500,
    description:
      "A clean 1987 GT Pro Freestyle Tour Team Model in white with blue detailing and white mag wheels.",
    highlights: ["White-and-blue Team Model colourway", "White mag wheels", "Three-photo catalogue gallery"],
    images: [1, 2, 3].map(
      (image) => `/products/1987-gt-pro-freestyle-tour-team-white-blue/photo-0${image}.jpg`,
    ),
  },
  {
    id: 18,
    slug: "1987-gt-pro-freestyle-tour-team-black",
    name: "1987 GT Pro Freestyle Tour Team Model — Black",
    year: 1987,
    brand: "GT",
    style: "Freestyle",
    price: 1500,
    description: "A 1987 GT Pro Freestyle Tour Team Model presented in a deep black finish.",
    highlights: ["Black Team Model finish", "Golden-era freestyle geometry", "Three-photo catalogue gallery"],
    images: [1, 2, 3].map(
      (image) => `/products/1987-gt-pro-freestyle-tour-team-black/photo-0${image}.jpg`,
    ),
  },
  {
    id: 19,
    slug: "1987-gt-pro-freestyle-tour-team-dayglo-yellow",
    name: "1987 GT Pro Freestyle Tour Team Model — DayGlo Yellow",
    year: 1987,
    brand: "GT",
    style: "Freestyle",
    price: 1500,
    description:
      "An iconic 1987 GT Pro Freestyle Tour Team Model in DayGlo neon yellow with blue Skyway Tuff Wheels.",
    highlights: ["DayGlo neon yellow finish", "Blue Skyway Tuff Wheels", "Collector-quality old-school GT"],
    images: ["/products/1987-gt-pro-freestyle-tour-team-dayglo-yellow/photo-01.jpg"],
  },
  {
    id: 20,
    slug: "1987-gt-pro-freestyle-tour-team-dayglo-red",
    name: "1987 GT Pro Freestyle Tour Team Model — DayGlo Red",
    year: 1987,
    brand: "GT",
    style: "Freestyle",
    price: 1500,
    description:
      "An iconic 1987 GT Pro Freestyle Tour Team Model in a striking DayGlo red finish, presented in hard-to-find collector condition.",
    highlights: ["DayGlo red finish", "Team Model specification", "Collector-quality presentation"],
    images: [1, 2, 3, 4, 5, 6].map(
      (image) => `/products/1987-gt-pro-freestyle-tour-team-dayglo-red/photo-0${image}.jpg`,
    ),
  },
  {
    id: 21,
    slug: "1987-gt-performer-lavender-purple",
    name: "1987 GT Performer — Lavender Purple",
    year: 1987,
    brand: "GT",
    style: "Freestyle",
    price: 1500,
    description:
      "A bold 1987 GT Performer in lavender purple—a standout golden-era colourway and a true piece of old-school BMX history.",
    highlights: ["Lavender purple finish", "Classic Performer silhouette", "Three-photo catalogue gallery"],
    images: [1, 2, 3].map(
      (image) => `/products/1987-gt-performer-lavender-purple/photo-0${image}.jpg`,
    ),
  },
  {
    id: 22,
    slug: "1987-gt-pro-freestyle-tour-black",
    name: "1987 GT Pro Freestyle Tour — Black",
    year: 1987,
    brand: "GT",
    style: "Freestyle",
    price: 1500,
    description:
      "A 1987 GT Pro Freestyle Tour in black—an underrated take on one of the golden era’s most recognisable freestyle platforms.",
    highlights: ["Deep black finish", "Pro Freestyle Tour specification", "Three-photo catalogue gallery"],
    images: [1, 2, 3].map((image) => `/products/1987-gt-pro-freestyle-tour-black/photo-0${image}.jpg`),
  },
  {
    id: 23,
    slug: "1987-gt-pro-freestyle-tour-neon-green",
    name: "1987 GT Pro Freestyle Tour — Neon Green",
    year: 1987,
    brand: "GT",
    style: "Freestyle",
    price: 1500,
    description:
      "One of the cleanest and most eye-catching golden-era colourways: a neon green 1987 GT Pro Freestyle Tour built to stand out.",
    highlights: ["Neon green finish", "Pro Freestyle Tour specification", "Three-photo catalogue gallery"],
    images: [1, 2, 3].map(
      (image) => `/products/1987-gt-pro-freestyle-tour-neon-green/photo-0${image}.jpg`,
    ),
  },
  {
    id: 24,
    slug: "1984-hutch-trick-star-pink-126071",
    name: "1984 Hutch Trick Star — Classic Pink",
    year: 1984,
    brand: "Hutch",
    style: "Freestyle",
    price: null,
    description:
      "A US-made 1984 Hutch Trick Star finished in classic pink with contrasting red components. The checkerboard pad, red mag wheels and white freestyle hardware give this build unmistakable period attitude.",
    highlights: ["US frame and fork", "Classic pink with red accents", "20-inch freestyle build", "1-inch headtube"],
    images: bmxMuseumGallery("126071", 7),
    sourceLabel: "BMXMuseum profile by djm101",
    sourceUrl: "https://bmxmuseum.com/bikes/hutch/126071",
  },
  {
    id: 25,
    slug: "1984-hutch-trick-star-candy-red-119727",
    name: "1984 Hutch Trick Star — Candy Red",
    year: 1984,
    brand: "Hutch",
    style: "Freestyle",
    price: null,
    description:
      "A 1984 USA Hutch Trick Star restored in deep candy red. Chrome details, gumwall tyres and colour-matched components create a rich, collector-focused interpretation of a freestyle icon.",
    highlights: ["USA frame, fork, bars and post", "Candy red restoration", "20-inch freestyle build", "1-inch headtube"],
    images: bmxMuseumGallery("119727", 5),
    sourceLabel: "BMXMuseum profile by djm101",
    sourceUrl: "https://bmxmuseum.com/bikes/hutch/119727",
  },
  {
    id: 26,
    slug: "1986-skyway-ta-118241",
    name: "1986 Skyway T/A — Freestyle Build",
    year: 1986,
    brand: "Skyway",
    style: "Freestyle",
    price: null,
    description:
      "A January 1986 USA Skyway T/A built with freestyle touches and an extensive selection of new-old-stock parts. Red Tuff II wheels, blue suede seating and red, white and blue details make it a true statement build.",
    highlights: ["NOS 1986 USA frame and fork", "Skyway Tuff II wheels", "Redline 180 mm cranks", "20-inch freestyle build"],
    images: bmxMuseumGallery("118241", 8),
    sourceLabel: "BMXMuseum profile by djm101",
    sourceUrl: "https://bmxmuseum.com/bikes/skyway/118241",
  },
  {
    id: 27,
    slug: "1988-gt-pro-freestyle-tour-team-118244",
    name: "1988 GT Pro Freestyle Tour Team Model",
    year: 1988,
    brand: "GT",
    style: "Freestyle",
    price: null,
    description:
      "A USA-built GT Pro Freestyle Tour Team Model styled as an homage to the late-1980s Maui Blue era. White PFT bars and a white GT seatpost bring the beloved two-tone team aesthetic into the build.",
    highlights: ["USA freestyle frame", "Maui Blue team styling", "White GT and PFT components", "20-inch freestyle build"],
    images: bmxMuseumGallery("118244", 8),
    sourceLabel: "BMXMuseum profile by djm101",
    sourceUrl: "https://bmxmuseum.com/bikes/gt_bicycles/118244",
  },
  {
    id: 28,
    slug: "1988-redline-rl-20ii-118242",
    name: "1988 Redline RL-20II — California Red",
    year: 1988,
    brand: "Redline",
    style: "Freestyle",
    price: null,
    description:
      "A 1988 Redline RL-20II refinished in California Red with fresh chrome and a carefully assembled selection of period-minded components. A clean tribute to one of freestyle BMX’s most coveted platforms.",
    highlights: ["California Red refinish", "Fresh chrome components", "20-inch freestyle build", "1-inch headtube"],
    images: bmxMuseumGallery("118242", 8),
    sourceLabel: "BMXMuseum profile by djm101",
    sourceUrl: "https://bmxmuseum.com/bikes/redline/118242",
  },
  {
    id: 29,
    slug: "2022-hutch-trick-star-reissue-125093",
    name: "2022 Hutch Trick Star — Chrome Reissue",
    year: 2022,
    brand: "Hutch",
    style: "Freestyle",
    price: null,
    description:
      "A 2022 reissue of the legendary Hutch Trick Star, built in classic chrome with black components and gumwall tyres. Modern production meets the unmistakable shape of an old-school freestyle original.",
    highlights: ["2022 Trick Star reissue", "Classic chrome finish", "20-inch freestyle build", "Old-school inspired presentation"],
    images: bmxMuseumGallery("125093", 5),
    sourceLabel: "BMXMuseum profile by djm101",
    sourceUrl: "https://bmxmuseum.com/bikes/hutch/125093",
  },
  {
    id: 30,
    slug: "2023-redline-rl-20ii-tribute-127457",
    name: "2023 Redline RL-20II — 1984 Tribute",
    year: 2023,
    brand: "Redline",
    style: "Freestyle",
    price: null,
    description:
      "A limited Redline by Kastan RL-20II 1984 Tribute build. Number 16 of 100 and signed by Linn Kastan, it pairs a crisp white finish with black mag wheels and restrained red detailing.",
    highlights: ["Number 16 of 100", "Signed by Linn Kastan", "Redline by Kastan tribute", "20-inch freestyle build"],
    images: bmxMuseumGallery("127457", 6),
    sourceLabel: "BMXMuseum profile by djm101",
    sourceUrl: "https://bmxmuseum.com/bikes/redline/127457",
  },
  {
    id: 31,
    slug: "1984-se-racing-quadangle-117439",
    name: "1984 SE Racing Quadangle — Coca-Cola Cowboy",
    year: 1984,
    brand: "SE Racing",
    style: "Race",
    price: null,
    description:
      "A Toby Henderson-inspired SE Racing Quadangle known as the Coca-Cola Cowboy build. Its original frame and decals are paired with blue ACS Z rims and a carefully selected golden-era race component set.",
    highlights: [
      "Original Quadangle frame and decals",
      "Landing Gear fork, GT handlebar and Suntour stem",
      "Shimano DX crank with SX brake hardware",
      "ACS Z rims with Tioga Comp III tyres",
      "20-inch race build with 1-inch headtube",
    ],
    images: bmxMuseumGallery("117439", 5),
    sourceLabel: "BMXMuseum profile by Oldtimes",
    sourceUrl: "https://bmxmuseum.com/bikes/se_racing/117439",
  },
  {
    id: 32,
    slug: "1984-skyway-ta-122510",
    name: "1984 Skyway T/A — Original Chrome",
    year: 1984,
    brand: "Skyway",
    style: "Race",
    price: null,
    description:
      "An original-chrome 1984 Skyway T/A race build with an original frame, fork and padset. Period-minded Shimano, Tange and Tuf Neck components complete its unmistakable mid-eighties presentation.",
    highlights: [
      "Original 1984 chrome Skyway frame and fork",
      "Tuf Neck stem with GT XT handlebar",
      "Shimano DX crank, lever, pedals and seatpost",
      "Skyway alloy-flange wheelset with Comp III tyres",
      "20-inch race build with 1-inch headtube",
    ],
    images: bmxMuseumGallery("122510", 8),
    sourceLabel: "BMXMuseum profile by Oldtimes",
    sourceUrl: "https://bmxmuseum.com/bikes/skyway/122510",
  },
  {
    id: 33,
    slug: "1984-skyway-ta-xl-118169",
    name: "1984 Skyway T/A XL — California Lite",
    year: 1984,
    brand: "Skyway",
    style: "Race",
    price: null,
    description:
      "A 19.5-inch top-tube Skyway T/A XL built around its original frame and fork. Skyway bars, alloy-flange wheels and California Lite padset give this race machine a cohesive factory-inspired identity.",
    highlights: [
      "Original frame and fork with 19.5-inch top tube",
      "Skyway handlebar and Tuf Neck stem",
      "Sugino CT three-piece crank with 44T chainring",
      "Skyway alloy-flange wheels and Comp III tyres",
      "California Lite padset with Haro number plate",
    ],
    images: bmxMuseumGallery("118169", 8),
    sourceLabel: "BMXMuseum profile by Oldtimes",
    sourceUrl: "https://bmxmuseum.com/bikes/skyway/118169",
  },
  {
    id: 34,
    slug: "1984-skyway-ta-xl-122620",
    name: "1984 Skyway T/A XL — Redline 401 Build",
    year: 1984,
    brand: "Skyway",
    style: "Race",
    price: null,
    description:
      "A second, distinct 1984 Skyway T/A XL with a 19.5-inch top tube and a component mix led by Redline 401 cranks. GT cockpit pieces, alloy-flange Skyway wheels and a Haro Flo Panel set it apart from the California Lite build.",
    highlights: [
      "19.5-inch top tube with GT Pro handlebar",
      "Redline 401 crank and 44T bubble-font chainring",
      "Dia-Compe MX1000 caliper with Shimano DX lever",
      "Original Skyway alloy-flange wheels",
      "California Lite padset with Haro Flo Panel",
    ],
    images: bmxMuseumGallery("122620", 6),
    sourceLabel: "BMXMuseum profile by Oldtimes",
    sourceUrl: "https://bmxmuseum.com/bikes/skyway/122620",
  },
  {
    id: 35,
    slug: "1986-gt-pro-performer-maui-blue-117389",
    name: "1986 GT Pro Performer — Maui Blue",
    year: 1986,
    brand: "GT",
    style: "Freestyle",
    price: null,
    description:
      "A Maui Blue 1986 GT Pro Performer with the signature platform details that defined golden-era freestyle. Matching GT components, OGK Performer wheels and period Dia-Compe braking create a complete and charismatic build.",
    highlights: [
      "Maui Blue GT Pro Performer finish",
      "GT-stamped handlebar, layback post, pegs and frame standers",
      "OGK GT Performer wheels with GT tyres",
      "Nippon front and Dia-Compe 901 rear brakes",
      "20-inch freestyle and flatland build",
    ],
    images: bmxMuseumGallery("117389", 6),
    sourceLabel: "BMXMuseum profile by Oldtimes",
    sourceUrl: "https://bmxmuseum.com/bikes/gt_bicycles/117389",
  },
];

export const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function priceLabel(price: number | null) {
  return price === null ? "Price on request" : currency.format(price);
}
