/**
 * Product categories this app supports.
 * Images are served locally from /public/images
 */
export const PRODUCT_CATEGORIES = [
  {
    id: "marble-slabs",
    translationKey: "categories.marbleSlabs",
    sampleImageUrl: "/images/Marbal_sample.png",
  },
  {
    id: "hardwood-flooring",
    translationKey: "categories.hardwoodFlooring",
    sampleImageUrl: "/images/Hard_Wall_sample.png",
  },
  {
    id: "ceramics",
    translationKey: "categories.ceramics",
    sampleImageUrl: "/images/Ceramic_sample.png",
  },
  {
    id: "granite",
    translationKey: "categories.granite",
    sampleImageUrl: "/images/Granite_sampel.png",
  },
  {
    id: "fabric",
    translationKey: "categories.fabric",
    sampleImageUrl: "/images/Fabric_sample.png",
  },
  {
    id: "carpet-rugs",
    translationKey: "categories.carpetAndRugs",
    sampleImageUrl: "/images/Carpet_sample.png",
  },
] as const;
