/**
 * Product categories this app supports.
 * Images are served locally from /public/images
 */
export const PRODUCT_CATEGORIES = [
  {
    id: "marble-slabs",
    translationKey: "home.category.marbleSlabs",
    sampleImageUrl: "/images/Marbal_sample.png",
  },
  {
    id: "hardwood-flooring",
    translationKey: "home.category.hardwoodFlooring",
    sampleImageUrl: "/images/Hard_Wall_sample.png",
  },
  {
    id: "ceramics",
    translationKey: "home.category.ceramics",
    sampleImageUrl: "/images/Ceramic_sample.png",
  },
  {
    id: "granite",
    translationKey: "home.category.granite",
    sampleImageUrl: "/images/Granite_sampel.png",
  },
  {
    id: "fabric",
    translationKey: "home.category.fabric",
    sampleImageUrl: "/images/Fabric_sample.png",
  },
  {
    id: "carpet-rugs",
    translationKey: "home.category.carpetAndRugs",
    sampleImageUrl: "/images/Carpet_sample.png",
  },
] as const;
