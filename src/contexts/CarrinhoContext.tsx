/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

type Produto = {
    id: number;
    nome: string;
    preco: number;
    imagem: string;
};

type CarrinhoItem = {
    produto: Produto;
    quantidadeCarrinho: number;
    observacoes: string;
};

type CarrinhoContextType = {
    carrinho: CarrinhoItem[];
    valorTotal: number;
    valorTotalFrete: number;
    isLoading: boolean;
    isError: boolean;
    addProduto: (
        produto: Produto,
        quantidade: number,
        observacoes: string,
    ) => void;
    updateQuantidade: (id: number, delta: number) => void;
    removeProduto: (id: number) => void;
    clearCarrinho: () => void;
};

interface ProdutoAPI {
    id: number;
    nome: string;
    imagem: string;
    preco: number;
    quantidadeCarrinho: number;
    observacoes?: string;
}

interface CarrinhoAPIResponse {
    carrinho: ProdutoAPI[];
    valorTotal: number;
    valorTotalFrete: number;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(
    undefined,
);

const getSessionId = () => {
    let sessionId = sessionStorage.getItem("sessionId");

    if (!sessionId) {
        sessionId = uuidv4();
        sessionStorage.setItem("sessionId", sessionId);
    }

    return sessionId;
};

const saveCarrinhoSessionStorage = (carrinho: CarrinhoItem[]) => {
    sessionStorage.setItem("carrinho", JSON.stringify(carrinho));
};

const loadCarrinhoSessionStorage = (): CarrinhoItem[] => {
    const savedCarrinho = sessionStorage.getItem("carrinho");
    return savedCarrinho ? JSON.parse(savedCarrinho) : [];
};

const fetchCarrinho = async (): Promise<CarrinhoAPIResponse> => {
    const sessionId = getSessionId();
    const apiUrl = import.meta.env.VITE_API_URL;
    const apiUrlC = `${apiUrl}/carrinho`;
    const response = await fetch(apiUrlC, {
        headers: {
            "session-id": sessionId,
        },
    });

    if (!response.ok) {
        throw new Error("Erro ao recuperar os produtos do carrinho:");
    }

    return await response.json();
};

export const CarrinhoProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery<CarrinhoAPIResponse>({
        queryFn: fetchCarrinho,
        queryKey: ["carrinho-data"],
        staleTime: 10000,
    });

    const formatCarrinho: CarrinhoItem[] =
        data?.carrinho.map((item) => ({
            produto: {
                id: item.id,
                nome: item.nome,
                preco: item.preco,
                imagem: item.imagem,
            },
            quantidadeCarrinho: item.quantidadeCarrinho,
            observacoes: item.observacoes || "",
        })) || [];

    useEffect(() => {
        const sessionCarrinho = loadCarrinhoSessionStorage();

        if (sessionCarrinho.length > 0) {
            queryClient.setQueryData(
                ["carrinho-data"],
                (oldData: CarrinhoItem) => ({
                    ...oldData,
                    carrinho: sessionCarrinho.map((item) => ({
                        id: item.produto.id,
                        nome: item.produto.nome,
                        preco: item.produto.preco,
                        imagem: item.produto.imagem,
                        quantidadeCarrinho: item.quantidadeCarrinho,
                        observacoes: item.observacoes,
                    })),
                }),
            );
        }
    }, [queryClient]);

    useEffect(() => {
        saveCarrinhoSessionStorage(formatCarrinho);
    }, [formatCarrinho]);

    const addProdutoMutation = useMutation({
        mutationFn: async ({
            produto,
            quantidadeCarrinho,
            observacoes,
        }: CarrinhoItem) => {
            const apiUrl = import.meta.env.VITE_API_URL;
            const apiUrlC = `${apiUrl}/carrinho`;
            const sessionId = getSessionId();

            const response = await fetch(apiUrlC, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "session-id": sessionId,
                },
                body: JSON.stringify({
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    imagem: produto.imagem,
                    quantidadeCarrinho,
                    observacoes,
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao adicionar produto ao carrinho");
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["carrinho-data"] });
        },
    });

    const removeProdutoMutation = useMutation({
        mutationFn: async (id: number) => {
            const apiUrl = import.meta.env.VITE_API_URL;
            const apiUrlC = `${apiUrl}/carrinho/${id}`;
            const sessionId = getSessionId();

            const response = await fetch(apiUrlC, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "session-id": sessionId,
                },
            });

            if (!response.ok) {
                throw new Error("Erro ao remover o produto do carrinho");
            }

            return response.json();
        },
        onMutate: async (id: number) => {
            await queryClient.cancelQueries({ queryKey: ["carrinho-data"] });

            const previousCartData = queryClient.getQueryData<{
                carrinho: {
                    id: number;
                    quantidadeCarrinho: number;
                    preco: number;
                }[];
            }>(["carrinho-data"]);

            if (previousCartData) {
                queryClient.setQueryData(["carrinho-data"], {
                    ...previousCartData,
                    carrinho: previousCartData.carrinho.filter(
                        (item) => item.id !== id,
                    ),
                });
            }

            return { previousCartData };
        },
        onError: (
            _err: unknown,
            _variables: number,
            context?: {
                previousCartData?: {
                    carrinho: {
                        id: number;
                        quantidadeCarrinho: number;
                        preco: number;
                    }[];
                };
            },
        ) => {
            if (context?.previousCartData) {
                queryClient.setQueryData(
                    ["carrinho-data"],
                    context.previousCartData,
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["carrinho-data"] });
        },
    });

    const updateQuantidadeMutation = useMutation({
        mutationFn: async ({
            id,
            quantidadeCarrinho,
            preco,
        }: {
            id: number;
            quantidadeCarrinho: number;
            preco: number;
        }) => {
            const apiUrl = import.meta.env.VITE_API_URL;
            const apiUrlC = `${apiUrl}/carrinho/${id}`;
            const sessionId = getSessionId();

            const response = await fetch(apiUrlC, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "session-id": sessionId,
                },
                body: JSON.stringify({
                    quantidadeCarrinho,
                    preco,
                }),
            });

            if (!response.ok) {
                throw new Error(
                    "Erro ao atualizar a quantidade do produto no carrinho",
                );
            }

            return response.json();
        },
        onMutate: async ({
            id,
            quantidadeCarrinho,
        }: {
            id: number;
            quantidadeCarrinho: number;
        }) => {
            await queryClient.cancelQueries({ queryKey: ["carrinho-data"] });

            const previousCartData = queryClient.getQueryData<{
                carrinho: {
                    id: number;
                    quantidadeCarrinho: number;
                    preco: number;
                }[];
            }>(["carrinho-data"]);

            if (previousCartData) {
                queryClient.setQueryData(["carrinho-data"], {
                    ...previousCartData,
                    carrinho: previousCartData.carrinho.map((item) =>
                        item.id === id ? { ...item, quantidadeCarrinho } : item,
                    ),
                });
            }

            return { previousCartData };
        },
        onError: (
            _err: unknown,
            _variables: {
                id: number;
                quantidadeCarrinho: number;
                preco: number;
            },
            context?: {
                previousCartData?: {
                    carrinho: {
                        id: number;
                        quantidadeCarrinho: number;
                        preco: number;
                    }[];
                };
            },
        ) => {
            if (context?.previousCartData) {
                queryClient.setQueryData(
                    ["carrinho-data"],
                    context.previousCartData,
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["carrinho-data"] });
        },
    });

    const addProduto = (
        produto: Produto,
        quantidadeCarrinho: number,
        observacoes: string,
    ) => {
        const produtoExistente = data?.carrinho.find(
            (item) => item.id === produto.id,
        );

        if (produtoExistente) {
            console.log("Produto existente encontrado:", produtoExistente);
            updateQuantidade(produto.id, quantidadeCarrinho);
        } else {
            const novoItem: CarrinhoItem = {
                produto,
                quantidadeCarrinho,
                observacoes,
            };
            console.log("Adicionando novo item:", novoItem);
            addProdutoMutation.mutate(novoItem);
        }
    };

    const removeProduto = (id: number) => {
        removeProdutoMutation.mutate(id);
    };

    const clearCarrinho = () => {
        sessionStorage.removeItem("carrinho");

        queryClient.setQueryData(["carrinho-data"], {});

        queryClient.invalidateQueries({ queryKey: ["carrinho-data"] });
    };

    const updateQuantidade = (id: number, delta: number) => {
        const carrinhoItem = data?.carrinho.find((item) => item.id === id);
        if (carrinhoItem) {
            const newQuantidade = Math.max(
                1,
                carrinhoItem.quantidadeCarrinho + delta,
            );
            const novoPreco =
                (carrinhoItem.preco / carrinhoItem.quantidadeCarrinho) *
                newQuantidade;
            updateQuantidadeMutation.mutate({
                id,
                quantidadeCarrinho: newQuantidade,
                preco: novoPreco,
            });
        }
    };

    return (
        <CarrinhoContext.Provider
            value={{
                carrinho: formatCarrinho,
                valorTotal: data?.valorTotal || 0,
                valorTotalFrete: data?.valorTotalFrete || 0,
                isLoading,
                isError,
                addProduto,
                removeProduto,
                clearCarrinho,
                updateQuantidade,
            }}
        >
            {children}
        </CarrinhoContext.Provider>
    );
};

export const useCarrinho = () => {
    const context = useContext(CarrinhoContext);

    if (context === undefined) {
        throw new Error(
            "useCarrinho deve ser usado dentro de um CarrinhoProvider",
        );
    }

    return context;
};
