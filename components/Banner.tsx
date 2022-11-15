import Image, { StaticImageData } from "next/image";
import styled from "styled-components";
import { Container } from "../styles/utils";

interface BannerPropos {
  image: StaticImageData;
  width: number;
  height: number;
}

const BannerContainer = styled.section`
  ${Container};
  border-top: 3px solid ${({theme}) => theme.colors.primary};
  border-bottom: 3px solid ${({theme}) => theme.colors.primary};
`;

export default function Banner({ image, width, height }: BannerPropos) {
  return (
    <BannerContainer>
      <Image src={image} width={width} height={height} alt='Banner' />
    </BannerContainer>
  )
}