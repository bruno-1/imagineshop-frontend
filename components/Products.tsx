import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { Container } from "../styles/utils";
import { IProduct } from "../types";

interface ProductsProps {
  products: IProduct[];
}

const ProductContainer = styled.section`
  ${Container}
`;

const Title = styled.p`
  font-size: 1.875rem;
  font-weight: 700;
  margin-top: 3.125rem;
  margin-bottom: 2.8rem;
  span {
    text-decoration: underline ${({ theme }) => theme.colors.primary};
  }
`;

const ProductList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.875rem;
  margin-bottom: 11.25rem;
`;

const ProductItem = styled.div`
  border: 1px solid #eaeaea;
  height: 23.125rem;
  border-radius: 4px;
  box-shadow: 5px 0 10px #d9d9d9;
  padding: 1rem;
  cursor: pointer;
  a {
    text-decoration: none;
    color: #000;
  }
  &:hover {
    box-shadow: 5px 10px 10px #d9d9d9;
    p {
      color: ${({ theme }) => theme.colors.primary}
    }
  }
`;

const ProductName = styled.p`
  font-size: .875rem;
`;

const ProductPrice = styled.p`
  font-size: 1.125rem;
  font-weight: 700;
`;

const ProductSplitPrice = styled.small`
  font-size: .75rem;
  font-weight: 700;
  color: #999;
`;

export default function Products({ products }: ProductsProps) {
  return (
    <ProductContainer>
      <Title>
        <span>De</span>staques
      </Title>
      <ProductList>
        {products && products.map((product) => (
          <ProductItem key={product._id}>
            <Link href={`/product/${product._id}`}>
              <Image src={product.image} width={230} height={230} alt='Product image' />
              <ProductName>
                {product.name}
              </ProductName>
              <ProductPrice>
                {product.formattedPrice}
              </ProductPrice>
              <ProductSplitPrice>
                10x de {product.splitPrice} sem juros
              </ProductSplitPrice>
            </Link>
          </ProductItem>
        ))}
      </ProductList>
    </ProductContainer>
  )
}