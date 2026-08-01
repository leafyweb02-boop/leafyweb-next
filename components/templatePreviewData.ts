export type TemplatePreviewKey =
  | "restaurant"
  | "hotel"
  | "shop"
  | "business"
  | "small-business"
  | "freelancer";

export interface TemplatePreviewRecord {
  slug: TemplatePreviewKey;
  name: string;
  label: string;
  accent: string;
  heroTitle: string;
  heroText: string;
  aboutTitle: string;
  aboutText: string;
  highlights: string[];
  galleryTitle: string;
  galleryItems: string[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
}

export const templatePreviewData: TemplatePreviewRecord[] = [
  {
    slug: "restaurant",
    name: "Restaurant",
    label: "Restaurant Template",
    accent: "from-orange-500/25 to-amber-500/10",
    heroTitle: "Saffron Table",
    heroText:
      "A warm, premium dining experience with handcrafted menus, curated specials, and seamless online ordering.",
    aboutTitle: "Our Story",
    aboutText:
      "Saffron Table brings modern Indian dining to the neighborhood with chef-led tasting menus, intimate service, and a cozy ambiance that keeps guests coming back.",
    highlights: [
      "Chef's Specials",
      "Private Dining",
      "Online Reservations",
      "Loyalty Offers",
    ],
    galleryTitle: "Signature Experience",
    galleryItems: [
      "Chef's table ambiance",
      "Signature tasting menu",
      "Weekend brunch highlights",
      "Premium dining moments",
    ],
    contact: {
      phone: "+1 (555) 210-7428",
      email: "hello@saffrontable.com",
      address: "18 Market Street, Downtown",
    },
  },
  {
    slug: "hotel",
    name: "Hotel",
    label: "Hotel Template",
    accent: "from-sky-500/25 to-blue-500/10",
    heroTitle: "Azure Crest Hotel",
    heroText:
      "A refined stay experience for business travelers and vacation guests, with elegant rooms and elevated hospitality.",
    aboutTitle: "Stay in Style",
    aboutText:
      "Azure Crest Hotel offers boutique comfort, exceptional service, and a seamless guest journey from booking through arrival, relaxation, and departure.",
    highlights: [
      "Luxury Suites",
      "Event Spaces",
      "Airport Transfers",
      "Concierge Support",
    ],
    galleryTitle: "Hotel Highlights",
    galleryItems: [
      "Ocean-view rooms",
      "Premium lounge experience",
      "Signature wellness spa",
      "Evening rooftop atmosphere",
    ],
    contact: {
      phone: "+1 (555) 760-8400",
      email: "stay@azurecresthotel.com",
      address: "47 Harbor View Avenue",
    },
  },
  {
    slug: "shop",
    name: "Shop",
    label: "Shop Template",
    accent: "from-violet-500/25 to-fuchsia-500/10",
    heroTitle: "North Loop Market",
    heroText:
      "A modern storefront experience for everyday essentials, lifestyle finds, and trending favorites.",
    aboutTitle: "Curated Everyday Value",
    aboutText:
      "North Loop Market brings together trusted quality, quick delivery, and elevated product discovery for customers who want convenience with character.",
    highlights: [
      "New Arrivals",
      "Fast Delivery",
      "Bundle Savings",
      "Customer Favorites",
    ],
    galleryTitle: "Featured Picks",
    galleryItems: [
      "Editorial product displays",
      "Trending gift bundles",
      "Lifestyle essentials",
      "Seasonal offers",
    ],
    contact: {
      phone: "+1 (555) 420-1188",
      email: "hello@northloopmarket.com",
      address: "102 Charm Street, Market District",
    },
  },
  {
    slug: "business",
    name: "Business",
    label: "Business Template",
    accent: "from-purple-500/25 to-fuchsia-500/10",
    heroTitle: "Summit Ridge Group",
    heroText:
      "A polished corporate website for modern teams, trusted partnerships, and high-conversion outreach.",
    aboutTitle: "Growth With Clarity",
    aboutText:
      "Summit Ridge Group helps ambitious companies present their services, leadership, and value proposition with confidence through a professional digital storefront.",
    highlights: [
      "Leadership Team",
      "Client Success",
      "Service Packages",
      "Thoughtful Contact",
    ],
    galleryTitle: "Company Snapshot",
    galleryItems: [
      "Executive profile showcase",
      "Service portfolio highlights",
      "Case study moments",
      "Business credibility visuals",
    ],
    contact: {
      phone: "+1 (555) 351-9066",
      email: "hello@summitridgegroup.com",
      address: "21 Innovation Avenue, Downtown",
    },
  },
  {
    slug: "small-business",
    name: "Small Business",
    label: "Small Business Template",
    accent: "from-emerald-500/25 to-lime-500/10",
    heroTitle: "Bright Bloom Studio",
    heroText:
      "A polished small business website for trusted local services, reliable communication, and clear online conversion.",
    aboutTitle: "Local Expertise",
    aboutText:
      "Bright Bloom Studio helps neighborhood brands grow with a clean digital presence, friendly service storytelling, and dependable support.",
    highlights: [
      "Consultation Booking",
      "Service Packages",
      "Local Reputation",
      "Easy Contact",
    ],
    galleryTitle: "Business Snapshot",
    galleryItems: [
      "Client success moments",
      "Service workflow visuals",
      "Local brand highlights",
      "Trusted support experience",
    ],
    contact: {
      phone: "+1 (555) 182-2033",
      email: "team@brightbloomstudio.com",
      address: "55 Maple Avenue, City Center",
    },
  },
  {
    slug: "freelancer",
    name: "Freelancer",
    label: "Freelancer Template",
    accent: "from-pink-500/25 to-rose-500/10",
    heroTitle: "Mira Lane Creative",
    heroText:
      "A high-end personal brand website for creative freelancers who need a striking, conversion-ready digital presence.",
    aboutTitle: "Creative Direction",
    aboutText:
      "Mira Lane Creative supports founders, creators, and startups with sharp brand systems, polished digital storytelling, and premium creative execution.",
    highlights: [
      "Brand Strategy",
      "Portfolio Work",
      "Creative Retainers",
      "Fast Response",
    ],
    galleryTitle: "Featured Portfolio",
    galleryItems: [
      "Brand identity work",
      "Campaign visuals",
      "Creative case studies",
      "Freelance process highlights",
    ],
    contact: {
      phone: "+1 (555) 429-2260",
      email: "hello@miralanecollective.com",
      address: "8 Aurora Lane, Creative Quarter",
    },
  },
];

export const previewTemplateMap = new Map(
  templatePreviewData.map((template) => [template.slug, template]),
);
