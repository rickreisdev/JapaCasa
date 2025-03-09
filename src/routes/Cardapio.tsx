import { Helmet } from "react-helmet-async";
import "../assets/styles/cardapio.scss";
import { FaSearch } from "react-icons/fa";
import ContentLocal from "../components/ContentLocal";
import BtnAddCarinho from "../components/BtnAddCarinho";
import formatCurrency from "../utils/formatCurrency";
import { useCarrinho } from "../contexts/CarrinhoContext";
import ModalCarrinho from "../components/ModalCarrinho";
import BtnCarrinho from "../components/BtnCarrinho";
import { useProdutos } from "../hooks/useProdutos";
import { useState, useTransition } from "react";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import { Usuario } from "../types/CarrinhoContextTypes";
import ModalUser from "../components/ModalUser";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

type Produto = {
    id: number;
    nome: string;
    tipo: string;
    preco: number;
    quantidade: string;
    quantidadeDtd: string;
    quantidadeCarrinho: number;
    imagem: string;
    observacoes: string;
};

const Cardapio = () => {
    const { data, isLoading, isError, error } = useProdutos();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
    const [, startTransition] = useTransition();
    const [selectedProduto, setSelectedProduto] = useState<Produto | null>(
        null,
    );
    const [modalOpen, setModalOpen] = useState(false);
    const [modalUserOpen, setModalUserOpen] = useState(false);
    const { addProduto, carrinho } = useCarrinho();

    const produtos = data || [];
    const filtProdutos = produtos.filter(
        (produto: Produto) =>
            (!selectedTipo || produto.tipo === selectedTipo) &&
            produto.nome.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const getUserId = () => {
        const user = localStorage.getItem("usuario");
        if (user) {
            const parsedUser = JSON.parse(user) as Usuario;
            return parsedUser.id;
        }
        return null;
    };

    const userId = getUserId();

    const renderProdutos = () => {
        if (isLoading) {
            return <CircularProgress color="error" />;
        }

        if (isError) {
            return (
                <Alert variant="filled" severity="error">
                    <AlertTitle>Erro</AlertTitle>
                    {error instanceof Error
                        ? error.message
                        : "Erro desconhecido"}
                </Alert>
            );
        }

        if (!filtProdutos || filtProdutos.length === 0) {
            return (
                <div className="no-service">
                    <p>Nenhum produto encontrado...</p>
                </div>
            );
        }

        return filtProdutos.map((produto: Produto) => (
            <div className="food-card" key={produto.id} title={produto.nome}>
                <div className="img">
                    <img src={produto.imagem} />
                </div>

                <h3 className="nome">{produto.nome}</h3>

                <h4 className="preco">{formatCurrency(produto.preco)}</h4>

                <h4 className="qtd">{produto.quantidade}</h4>
                <h4 className="detalhe">{produto.quantidadeDtd}</h4>

                <BtnAddCarinho onClick={() => handleOpenModal(produto)} />
            </div>
        ));
    };

    const handleSearchInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setSearchTerm(event.target.value);
    };

    const handleTipoClick = (tipo: string | null) => {
        startTransition(() => {
            setSelectedTipo(tipo);
        });
    };

    const handleOpenModal = (produto: Produto) => {
        if (!userId) {
            setModalUserOpen(true);
        } else {
            setSelectedProduto(produto);
            setModalOpen(true);
        }
    };

    const handleUserSubmit = () => {
        toast.success("Usuário criado com sucesso!", {
            style: {
                borderBottom: "3px solid #03541a",
                padding: "10px 15px",
                color: "white",
                background: "#cf0000",
                fontSize: "1.2rem",
            },
            iconTheme: {
                primary: "#03541a",
                secondary: "#FFFAEE",
            },
        });

        if (selectedProduto) {
            setModalOpen(true);
        }

        setModalUserOpen(false);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedProduto(null);
    };

    const handleConfirmAddToCart = async (
        id: number,
        nome: string,
        imagem: string,
        quantidadeCarrinho: number,
        preco: number,
        observacoes: string,
    ) => {
        const produto: Produto = {
            id,
            nome,
            tipo: selectedProduto?.tipo || "",
            preco,
            quantidade: "",
            quantidadeDtd: "",
            quantidadeCarrinho,
            imagem,
            observacoes,
        };

        addProduto(produto, quantidadeCarrinho, observacoes);
        handleCloseModal();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
        >
            <Helmet>
                <title>Cardápio | JapaCasa! </title>
            </Helmet>

            <div className="container-cardapio">
                <div
                    className="carda_title"
                    style={{
                        backgroundImage: `url('/bkg-cardapio.webp')`,
                    }}
                
                >
                    <h1>
                        Nosso<span> Cardápio</span>
                    </h1>
                </div>

                <div className="pesquisa-filtro">
                    <div className="pesquisa">
                        <span>Pesquise pelo nome:</span>

                        <div className="pesquisa-box">
                            <input
                                type="text"
                                id="input-search"
                                value={searchTerm}
                                onChange={handleSearchInputChange}
                                placeholder="Digite um termo"
                            />

                            <span id="icon-search">
                                <FaSearch />
                            </span>
                        </div>
                    </div>

                    <div className="filtros">
                        <span>Filtre pelo tipo:</span>

                        <button
                            className="filtro-card"
                            onClick={() => handleTipoClick(null)}
                        >
                            Todos
                        </button>

                        <button
                            className={`filtro-card ${
                                selectedTipo === null
                                    ? ""
                                    : selectedTipo === "sushi"
                                      ? "selected"
                                      : ""
                            }`}
                            onClick={() => handleTipoClick("sushi")}
                        >
                            Sushi
                        </button>

                        <button
                            className={`filtro-card ${
                                selectedTipo === null
                                    ? ""
                                    : selectedTipo === "temaki"
                                      ? "selected"
                                      : ""
                            }`}
                            onClick={() => handleTipoClick("temaki")}
                        >
                            Temaki
                        </button>

                        <button
                            className={`filtro-card ${
                                selectedTipo === null
                                    ? ""
                                    : selectedTipo === "niguiri"
                                      ? "selected"
                                      : ""
                            }`}
                            onClick={() => handleTipoClick("niguiri")}
                        >
                            Niguiri
                        </button>

                        <button
                            className={`filtro-card ${
                                selectedTipo === null
                                    ? ""
                                    : selectedTipo === "uramaki"
                                      ? "selected"
                                      : ""
                            }`}
                            onClick={() => handleTipoClick("uramaki")}
                        >
                            Uramaki
                        </button>

                        <button
                            className={`filtro-card ${
                                selectedTipo === null
                                    ? ""
                                    : selectedTipo === "yakisoba"
                                      ? "selected"
                                      : ""
                            }`}
                            onClick={() => handleTipoClick("yakisoba")}
                        >
                            Yakisoba
                        </button>

                        <button
                            className={`filtro-card ${
                                selectedTipo === null
                                    ? ""
                                    : selectedTipo === "combo"
                                      ? "selected"
                                      : ""
                            }`}
                            onClick={() => handleTipoClick("combo")}
                        >
                            Combo
                        </button>
                    </div>
                </div>

                <div className="content_home">{renderProdutos()}</div>

                {carrinho.length > 0 && <BtnCarrinho />}

                <ContentLocal />
            </div>

            {modalOpen && selectedProduto && (
                <ModalCarrinho
                    produtoModal={selectedProduto}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmAddToCart}
                    modalOpen={modalOpen}
                />
            )}

            {modalUserOpen && (
                <ModalUser
                    modalOpen={modalUserOpen}
                    onConfirm={handleUserSubmit}
                    onClose={() => setModalUserOpen(false)}
                />
            )}
        </motion.div>
    );
};

export default Cardapio;
