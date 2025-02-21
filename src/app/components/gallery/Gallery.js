"use client";

import { GalleryGrid, GalleryImage } from "./styles";

const GALLERY_IMAGES = [
  {
    src: "https://cdn.builder.io/api/v1/image/assets/e9d682ed98f749c9a5f6226f88b2970a/fee831a20e6feb280f7aad4e2c9581b72946f9b47eb118edbddd378ecaecb077",
    alt: "Tattoo artwork",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/e9d682ed98f749c9a5f6226f88b2970a/5cbd25a2abbb77c6e683cc5db76009d5e185a90231c26311c609bbacea01d5fd",
    alt: "Tribal tattoo",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/e9d682ed98f749c9a5f6226f88b2970a/46732bcb3059fd2fc4a7c524ea19661571159990b24a243494bda7d72f7edbe8",
    alt: "Colorful sleeve tattoo",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/e9d682ed98f749c9a5f6226f88b2970a/6c9ae74130bef46bd1e286d1a223b7668f72ca04e4f5ca4a59b469ae5ae20815",
    alt: "Japanese style tattoo",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/e9d682ed98f749c9a5f6226f88b2970a/617cdf2197a690ffd13f4be7764749982194e95addfab92aa6bd505d9d264bdd",
    alt: "Rose skull tattoo",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/e9d682ed98f749c9a5f6226f88b2970a/46a967092da5a3055b02acc481fdb7270225af22a5d621a2cc9443ca228eeacc",
    alt: "Wave tattoo sleeve",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/e9d682ed98f749c9a5f6226f88b2970a/fe1db9a27d023881bb0060a82faede5e9dcc8a8175f1f5248d7d8e4e56a9f7cc",
    alt: "Dragon tattoo",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/e9d682ed98f749c9a5f6226f88b2970a/86804077ea437f017575568fefe5e1e10773bd014cae4a2d26642b28ddaf0014",
    alt: "Script tattoo",
  },
];

export const Gallery = () => {
  return (
    <GalleryGrid>
      {GALLERY_IMAGES.map((image, index) => (
        <GalleryImage
          key={index}
          src={image.src}
          alt={image.alt}
          loading="lazy"
        />
      ))}
    </GalleryGrid>
  );
};

