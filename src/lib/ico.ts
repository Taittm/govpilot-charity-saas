import type { IcoTier } from "@prisma/client";

export const ICO_TIER_FEE: Record<IcoTier, number> = {
  TIER_1: 52,
  TIER_2: 78,
  TIER_3: 3763,
};

export const ICO_TIER_LABEL: Record<IcoTier, string> = {
  TIER_1: "Tier 1",
  TIER_2: "Tier 2",
  TIER_3: "Tier 3",
};

export const ICO_FEE_LABEL: Record<IcoTier, string> = {
  TIER_1: "Tier 1, £52/year",
  TIER_2: "Tier 2, £78/year",
  TIER_3: "Tier 3, £3,763/year",
};
