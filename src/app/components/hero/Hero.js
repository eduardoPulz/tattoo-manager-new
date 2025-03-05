"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ImageSlider } from "../image-slider/ImageSlider";
import { 
  MainHeading, 
  HeroSection, 
  SlideContainer, 
  Slide, 
  HeroImage, 
  OverlayContent, 
  AgendarButton 
} from "./styles";

// Imagens para o carrossel
const HERO_IMAGES = [
  {
    src: "https://cdn.builder.io/api/v1/image/assets/e9d682ed98f749c9a5f6226f88b2970a/e54b600e34814eb87fe4bcd7149542fe366fb1b3e5e585bdd8191fdf78638358",
    alt: "Tattoo process"
  },
  {
    src: "/tattoo1.jpg",
    alt: "Professional tattoo artist at work"
  },
  {
    src: "/tattoo2.jpg",
    alt: "Detailed arm tattoo"
  },
  {
    src: "/tattoo3.jpg",
    alt: "Tattoo design"
  },
  {
    src: "/tattoo4.jpg",
    alt: "Tattoo design"
  },
  {
    src: "/tattoo5.jpg",
    alt: "Tattoo design"
  }
];

export const Hero = () => {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const containerRef = useRef(null);

  // Rotação automática das imagens a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % HERO_IMAGES.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleAgendarClick = () => {
    router.push("/admin?tab=schedules");
  };

  const handleImageChange = (index) => {
    setCurrentImage(index);
  };

  // Calcular o deslocamento para a animação de slide
  const getSlideOffset = () => -currentImage * (containerRef.current?.clientWidth || 1280);
  const [slideOffset, setSlideOffset] = useState(0);
  
  // Atualizar o offset quando a imagem atual muda ou o tamanho da janela muda
  useEffect(() => {
    const updateOffset = () => {
      if (containerRef.current) {
        setSlideOffset(-currentImage * containerRef.current.clientWidth);
      }
    };
    
    updateOffset();
    
    // Adicionar listener para redimensionamento da janela
    window.addEventListener('resize', updateOffset);
    
    return () => {
      window.removeEventListener('resize', updateOffset);
    };
  }, [currentImage]);

  return (
    <section>
      <MainHeading>Agende um horário conosco!</MainHeading>
      <HeroSection ref={containerRef}>
        <SlideContainer $offset={slideOffset}>
          {HERO_IMAGES.map((image, index) => (
            <Slide key={index}>
              <HeroImage
                src={image.src}
                alt={image.alt}
                width={1280}
                height={650}
              />
            </Slide>
          ))}
        </SlideContainer>
        <OverlayContent>
          <ImageSlider 
            totalDots={HERO_IMAGES.length} 
            onDotClick={handleImageChange} 
            activeDot={currentImage}
          />
          <AgendarButton onClick={handleAgendarClick}>
            Agendar
          </AgendarButton>
        </OverlayContent>
      </HeroSection>
    </section>
  );
};
