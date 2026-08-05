import { media } from './media'

export type DoctorTurnMedia = { video: string; poster: string }

/** Canonical portrait for each doctor slug (matches list hover video). */
export const DOCTOR_TURN_MEDIA: Record<string, DoctorTurnMedia> = {
  'aliyeva-z-v': { video: media.doctors.turnVideo, poster: media.doctors.turnPoster },
  'mamatalieva-z-a': { video: media.doctors.turnVideo2, poster: media.doctors.turnPoster2 },
  'abdullayeva-t-y': { video: media.doctors.turnVideo3, poster: media.doctors.turnPoster3 },
  'alimova-d-k': { video: media.doctors.turnVideo4, poster: media.doctors.turnPoster4 },
  'satvoldiyev-d-u': { video: media.doctors.turnVideo5, poster: media.doctors.turnPoster5 },
  'kojoeva-f-o': { video: media.doctors.turnVideo6, poster: media.doctors.turnPoster6 },
  'isaqjonova-m-n': { video: media.doctors.turnVideo7, poster: media.doctors.turnPoster7 },
  'nosirov-m-m': { video: media.doctors.turnVideo8, poster: media.doctors.turnPoster8 },
  'ruzmatov-z-s': { video: media.doctors.turnVideo9, poster: media.doctors.turnPoster9 },
  'xojaeva-g-a': { video: media.doctors.turnVideo11, poster: media.doctors.turnPoster11 },
  'mirzayeva-a-n': { video: media.doctors.turnVideo12, poster: media.doctors.turnPoster12 },
  'hamidova-f-t': { video: media.doctors.turnVideo13, poster: media.doctors.turnPoster13 },
  'sobirova-n-m': { video: media.doctors.turnVideo14, poster: media.doctors.turnPoster14 },
  'jorayeva-s-a': { video: media.doctors.turnVideo15, poster: media.doctors.turnPoster15 },
  'rasulova-d-i': { video: media.doctors.turnVideo16, poster: media.doctors.turnPoster16 },
  'toxtayeva-h-r': { video: media.doctors.turnVideo17, poster: media.doctors.turnPoster17 },
  'karimova-o-b': { video: media.doctors.turnVideo18, poster: media.doctors.turnPoster18 },
  'bobojonov-s-s': { video: media.doctors.turnVideo19, poster: media.doctors.turnPoster19 },
  'xalilov-n-a': { video: media.doctors.turnVideo20, poster: media.doctors.turnPoster20 },
  'mominov-j-z': { video: media.doctors.turnVideo21, poster: media.doctors.turnPoster21 },
  'davlatov-s-q': { video: media.doctors.turnVideo22, poster: media.doctors.turnPoster22 },
  'gayratjonova-f-g': { video: media.doctors.turnVideo23, poster: media.doctors.turnPoster23 },
  'yusupov-b-t': { video: media.doctors.turnVideo24, poster: media.doctors.turnPoster24 },
  'shamsutdinova-g-b': { video: media.doctors.turnVideo25, poster: media.doctors.turnPoster25 },
  'nigmatova-s-a': { video: media.doctors.turnVideo26, poster: media.doctors.turnPoster26 },
  'boboyeva-m-r': { video: media.doctors.turnVideo27, poster: media.doctors.turnPoster27 },
  'sharipova-d-a': { video: media.doctors.turnVideo28, poster: media.doctors.turnPoster28 },
  'madaminova-l-k': { video: media.doctors.turnVideo29, poster: media.doctors.turnPoster29 },
  'tursunov-a-r': { video: media.doctors.turnVideo30, poster: media.doctors.turnPoster30 },
  'soliyev-m-h': { video: media.doctors.turnVideo31, poster: media.doctors.turnPoster31 },
  'xolmatov-a-s': { video: media.doctors.turnVideo32, poster: media.doctors.turnPoster32 },
  'azimova-g-r': { video: media.doctors.turnVideo33, poster: media.doctors.turnPoster33 },
  'xaydaraliyev-s-a': { video: media.doctors.turnVideo34, poster: media.doctors.turnPoster34 },
}

export function getDoctorTurnMedia(slug: string): DoctorTurnMedia | undefined {
  return DOCTOR_TURN_MEDIA[slug]
}

export function getDoctorPortrait(slug: string, fallback: string): string {
  return DOCTOR_TURN_MEDIA[slug]?.poster ?? fallback
}

/** ~400×500 WebP for list/grid cards — pre-cropped 4:5, lighter than turn posters. */
export function getDoctorCardPortrait(slug: string, fallback: string): string {
  if (slug in DOCTOR_TURN_MEDIA) {
    return `/images/doctors/cards/${slug}.webp`
  }
  return fallback
}
