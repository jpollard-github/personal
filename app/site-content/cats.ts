export const beverlyAndLucindaPhotos = Array.from({ length: 23 }, (_, index) => {
  const photoNumber = index + 1;

  return {
    src: `/images/beverly-and-lucinda/BeverlyAndLucinda%20-%20${photoNumber}.webp`,
    alt: `Beverly and Lucinda photo ${photoNumber}`,
  };
});

export const thomasJonesMissyCassPhotos = Array.from({ length: 269 }, (_, index) => {
  const photoNumber = index + 1;

  return {
    src: `/images/thomas/ThomasJonesMissyCass%20-%20${photoNumber}.webp`,
    alt: `Thomas, Jones, Missy, and Cass photo ${photoNumber}`,
  };
});
