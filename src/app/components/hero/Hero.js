"use client";
import { Button } from "../button/Button";
import { ImageSlider } from "../image-slider/ImageSlider";
import { MainHeading, HeroSection, HeroImage, OverlayContent } from "./styles";

export const Hero = () => {
  return (
    <section>
      <MainHeading>Agende um horário conosco!</MainHeading>
      <HeroSection>
        <HeroImage
          src="https://cdn.builder.io/api/v1/image/assets/e9d682ed98f749c9a5f6226f88b2970a/e54b600e34814eb87fe4bcd7149542fe366fb1b3e5e585bdd8191fdf78638358"
          alt="Tattoo process"
          loading="lazy"
        />
        <OverlayContent>
          <Button onClick={() => console.log("Schedule clicked")}>
            Agendar
          </Button>
          <ImageSlider totalDots={4} activeDot={0} />
        </OverlayContent>
      </HeroSection>
    </section>
  );
};


