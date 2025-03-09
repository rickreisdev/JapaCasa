import "../assets/styles/home.scss";
import sushi from "../assets/img/sushi.jpg";
import { Helmet } from "react-helmet-async";
import TextCardJP from "../components/TextCardJP";
import ContentLocal from "../components/ContentLocal";
import { Usuario } from "../types/CarrinhoContextTypes";
import { motion } from "framer-motion";

const Home = () => {
    const getNome = () => {
        const user = localStorage.getItem("usuario");
        if (user) {
            const parsedUser = JSON.parse(user) as Usuario;
            return parsedUser.nome;
        }
        return null;
    };

    const nome = getNome();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
        >
            <Helmet>
                <title>JapaCasa! | Comida Japonesa e Delivery</title>
            </Helmet>

            <div className="container-home">
                <div
                    className="content_home"
                    style={{
                        backgroundImage: `url('/bkg-home.webp')`,
                    }}
                >
                    <h1>
                        Bem-vindo(a) ao Japa<span>Casa!</span>
                        {nome && `,`}
                        <br />
                        {nome && `${nome}`}
                    </h1>

                    <div className="content_home-text">
                        <p>
                            O melhor restaurante delivery de comida japonesa da
                            cidade!
                        </p>
                    </div>
                </div>

                <div className="content_carda">
                    <div className="home_esquerda">
                        <img src={sushi} />
                    </div>

                    <div className="home_direita">
                        <p>
                            Aqui no <span>JapaCasa!</span> você encontra as
                            melhores delícias da Terra do Sol Nascente sem
                            precisar sair de casa. <br />
                            Confira o nosso cardápio e escolha a sua próxima
                            paixão culinária!
                        </p>
                        <a href="cardapio" className="btn1">
                            Ver Cardápio
                        </a>
                    </div>
                </div>

                <div className="content_breve">
                    <h1>EM BREVE</h1>
                    <div className="home_breve">
                        <h2>
                            Aqui você vai aproveitar sua refeição como se
                            estivesse na sua casa.
                        </h2>
                        <h3>
                            Estamos reformando nosso restaurante para te
                            receber!
                        </h3>
                    </div>
                </div>

                <TextCardJP />

                <ContentLocal />
            </div>
        </motion.div>
    );
};

export default Home;
