import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react"
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { ShoppingCartContext } from "../context/ShoppingCartContext";
import { Container } from "../styles/utils";
import { IProduct } from "../types";

const Main = styled.main`
  ${Container};
  min-height: 589px;
`;

const Title = styled.p`
  font-size: 1.875rem;
  font-weight: 700;
  margin: 5.625rem 0;
`;

const SubTitle = styled.p`
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 1rem;
`;

const ShoppingCartContainer = styled.div`
  display: grid;
  grid-template-columns: 780px auto;
  gap: 1.5rem;
  min-height: 800px;
`;

const ShoppingCartProducts = styled.section`
`;

const Separator = styled.hr`
  border: 1px solid #c8c9c3;
  border-radius: 0px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 0.8rem 0;

  button {
    border: unset;
    background: unset;
    cursor: pointer;
  }
`;

const DeleteIcon = styled(FontAwesomeIcon)`
  color: ${({ theme }) => theme.colors.secundary};
  font-size: 1rem;
`;

const Product = styled.div`
  display: grid;
  grid-template-columns: auto 350px auto;
`;

const ProductName = styled.p`
  font-style: 1rem;
  color: ${({ theme }) => theme.colors.secundary};
  font-weight: 700;
  padding: 0;
  margin: 0;
`;

const ProductPrice = styled.p`
  font-style: 1.125rem;
  font-weight: 700;
  padding: 0;
  margin: 0;
  place-self: start end;
`;

const ShoppingCartPayment = styled.div`
  background-color: #f0f1ef;
  border-radius: 4px;
  padding: 1rem;
`;

const PaymentTitle = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0;
`;

const PaymentValue = styled.div`
  font-size: 1rem;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.secundary};
  margin: 5rem 0 0;
  display: flex;
  justify-content: space-between;

  span {
    display: block;
  }
`;

const PaymentShipping = styled.div`
  font-size: 1rem;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.secundary};
  margin: 1.5rem 0 0;
  display: flex;
  justify-content: space-between;

  span {
    display: block;
  }
`;

const PaymentTotal = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  text-transform: uppercase;
  margin: 3.125rem 0 5rem;
  display: flex;
  justify-content: space-between;

  span {
    display: block;
  }
`;

const LoginTitle = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  margin: 2rem 0;
`;

const InputGroup = styled.div`
  span {
    text-transform: uppercase;
    margin-bottom: .625rem;
    display: block;
  }

  input {
    width: 100%;
    height: 1.25rem;
    border: unset;
  }

  margin-bottom: 1.3rem;
`;

const Button = styled.button`
  display: block;
  border: unset;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 700;
  font-size: 1.5rem;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  cursor: pointer;
  margin: 0 auto;
  width: 240px;
  height: 60px;
`;


export default function ShoppingCart() {
  const { getProducts, deleteProduct, getTotalProducts, getTotalValue, getShippingValue, clearAll } = useContext(ShoppingCartContext);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [refresh, setRefresh] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const values = getProducts();
    setProducts(values);
  }, [refresh]);

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    setRefresh(oldValue => oldValue + 1);
    toast.success('Produto removido do carrinho', {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  const handleSubmit = async (event: any) => {
    event?.preventDefault();
    const api = 'https://imagineshopp.herokuapp.com';
    const token = await getTokenLogin(api, email, password);
    if (!token) {
      toast.error('Login inv??lido', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return
    }
    const productsIds: string[] = [];
    products.map(product => productsIds.push(product._id));
    await sellProducts(api, token, productsIds);
    if (!token) {
      toast.error('Compra inv??lida', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return
    }
    clearAll();
    router.push('/success');
  }

  const getTokenLogin = async (api: string, email: string, password: string): Promise<string | null> => {
    const result = await fetch(`${api}/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-type': 'application/json' }
    });
    if (result.status !== 200) {
      return null;
    }
    const { token } = await result.json();
    return token;
  }

  const sellProducts = async (api: string, token: string, products: string[]): Promise<string | null> => {
    const result = await fetch(`${api}/products/sell`, {
      method: 'POST',
      body: JSON.stringify({ products }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (result.status !== 200) {
      return null;
    }
    return 'success';
  }

  return (
    products && products.length > 0 ? (
      <>
        <Main>
          <Title>
            Tem produto
          </Title>

          <SubTitle>Produtos</SubTitle>
          <ShoppingCartContainer>
            <ShoppingCartProducts>
              <Separator></Separator>
              {
                products && products.map((product, index) => (
                  <div key={index}>
                    <ButtonContainer>
                      <button onClick={() => handleDeleteProduct(product._id)}>
                        <DeleteIcon icon={faX}></DeleteIcon>
                      </button>
                    </ButtonContainer>
                    <Product>
                      <div>
                        <Image src={product.image} alt={product.name} width={180} height={180} />
                      </div>
                      <ProductName>{product.name}</ProductName>
                      <ProductPrice>{product.formattedPrice}</ProductPrice>
                    </Product>
                    <Separator></Separator>
                  </div>
                ))
              }
            </ShoppingCartProducts>
            <section>
              <ShoppingCartPayment>
                <PaymentTitle>1. Resumo do pedido</PaymentTitle>
                <PaymentValue><span>{products.length} Produtos</span><span>{getTotalProducts()}</span></PaymentValue>
                <PaymentShipping><span>Frete</span><span>{getShippingValue()}</span></PaymentShipping>
                <PaymentTotal><span>Total</span><span>{getTotalValue()}</span></PaymentTotal>
                <Separator></Separator>
                <LoginTitle>2. Login</LoginTitle>
                <InputGroup>
                  <span>E-MAIL: </span>
                  <input type="email" value={email || ''} onChange={(e) => setEmail(e.currentTarget.value)} />
                </InputGroup>
                <InputGroup>
                  <span>SENHA: </span>
                  <input type="password" value={password || ''} onChange={(e) => setPassword(e.currentTarget.value)} />
                </InputGroup>
                <Button type="submit" onClick={handleSubmit}>
                  Continuar
                </Button>
              </ShoppingCartPayment>
            </section>
          </ShoppingCartContainer>
        </Main>
        <ToastContainer />
      </>
    ) : (
      <Main>Sem produto</Main>
    )
  )
}
