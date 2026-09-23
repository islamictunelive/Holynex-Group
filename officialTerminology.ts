/**
 * HOLYNEX OFFICIAL PRODUCT TERMINOLOGY — STRICT RULE
 *
 * The following terms are OFFICIAL HOLYNEX terminology and must be preserved
 * EXACTLY as written in Bengali:
 *
 * 1.  চাউল (MUST remain "চাউল", NEVER replace with "চাল")
 * 2.  ডাল
 * 3.  তৈল (MUST remain "তৈল", NEVER replace with "তেল")
 * 4.  আটা
 * 5.  লবণ
 * 6.  চিনি
 * 7.  পোলাও চাউল (MUST remain "পোলাও চাউল", NEVER replace with "পোলাও চাল")
 * 8.  ডিটারজেন্ট
 * 9.  ডিশওয়াশ
 * 10. সাবান
 *
 * DO NOT AUTO-CORRECT, NORMALIZE, SIMPLIFY, TRANSLATE, OR REWRITE ANY OF THESE TERMS.
 */

export const HOLYNEX_OFFICIAL_TERMINOLOGY = [
  'চাউল',
  'ডাল',
  'তৈল',
  'আটা',
  'লবণ',
  'চিনি',
  'পোলাও চাউল',
  'ডিটারজেন্ট',
  'ডিশওয়াশ',
  'সাবান',
] as const;

export type OfficialTerminology = (typeof HOLYNEX_OFFICIAL_TERMINOLOGY)[number];

/**
 * Safeguard function to ensure text does not inadvertently downgrade official terms:
 * - "পোলাও চাল" -> "পোলাও চাউল"
 * - standalone/prefix "চাল" in product contexts -> "চাউল"
 * - "তেল" -> "তৈল"
 */
export function enforceOfficialTerminology(text: string): string {
  if (!text) return text;
  let result = text;
  // Specific multi-word term first
  result = result.replace(/পোলাও\s*চাল/g, 'পোলাও চাউল');
  // Edible oils / oil terminology
  result = result.replace(/সয়াবিন\s*তেল/g, 'সয়াবিন তৈল');
  result = result.replace(/সরিষার\s*তেল/g, 'সরিষার তৈল');
  result = result.replace(/ভোজ্য\s*তেল/g, 'ভোজ্য তৈল');
  result = result.replace(/ভোজ্য\s*তেলের/g, 'ভোজ্য তৈলের');
  // Rice terminology
  result = result.replace(/মিনিকেট\s*চাল/g, 'মিনিকেট চাউল');
  result = result.replace(/নাজিরশাইল\s*চাল/g, 'নাজিরশাইল চাউল');
  result = result.replace(/বাসমতী\s*চাল/g, 'বাসমতী চাউল');
  return result;
}
