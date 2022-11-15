import styled from "styled-components"
import Banner from "../components/Banner";
import Products from "../components/Products";
import BannerImage from "../public/images/banner.png";

const Main = styled.main`
  min-height: 60.5vh;
`;

export async function getServerSideProps() {
  const api = 'https://imagineshopp.herokuapp.com';
  const result = await fetch(`${api}/products`);
  const data = await result.json();
  data.forEach((product: any) => {
    product.image = `${api}/uploads/${product.fileName}`
    product.formattedPrice = (new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })).format(product.price);
    product.splitPrice = (new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })).format(product.price/10);
  })
  return {
    props: {
      productsApi: data
    }
  }
}

export default function Home({ productsApi }: any) {
  return (
    <Main>
      <Banner image={BannerImage} width={1140} height={325} />
      <Products products={productsApi} />
    </Main>
  )
}