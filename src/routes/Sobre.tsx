import { Helmet } from "react-helmet-async";
import "../assets/styles/sobre.scss";
import sushi2 from "../assets/img/sushi-gd99e253f0_640.jpg";
import sushi3 from "../assets/img/japanese-sushi.jpg";
import sushi4 from "../assets/img/sushi-2370272_960_720.jpg";
import hotroll from "../assets/img/hotroll.png";
import niguiri from "../assets/img/niguiri-urumaki.jpg";
import TextCardJP from "../components/TextCardJP";
import ContentLocal from "../components/ContentLocal";
import { motion } from "framer-motion";

const Sobre = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
        >
            <Helmet>
                <title>Sobre | JapaCasa! </title>
            </Helmet>

            <div className="container-sobre">
                <div className="content_sobre">
                    <motion.div
                        className="sobre_titulo"
                        style={{
                            backgroundImage: `url('/bkg-sobre.webp')`,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                    >
                        <h1>
                            Sobre <span>nós</span>
                        </h1>
                    </motion.div>

                    <div className="sobre_colunas">
                        <div className="home_esquerda">
                            <h3>Uma Experiência</h3>
                            <h4>
                                Embarque em uma jornada culinária que celebra os
                                sabores autênticos do Japão, diretamente para o
                                conforto da sua casa. Aqui, no JapaCasa!,
                                estamos comprometidos em proporcionar a você uma
                                experiência gastronômica única, onde a tradição
                                encontra a inovação.
                            </h4>

                            <h4>
                                Com nossa seleção cuidadosamente elaborada de
                                pratos japoneses clássicos e contemporâneos,
                                cada refeição é uma oportunidade para explorar
                                uma explosão de sabores e texturas. Desde nossos
                                sushis frescos e coloridos até nossos deliciosos
                                pratos quentes, cada item é preparado com os
                                melhores ingredientes e amorosos detalhes.
                            </h4>
                        </div>

                        <div className="home_direita">
                            <img src={sushi2} />
                        </div>
                    </div>
                </div>

                <div className="content_center">
                    <img src={sushi3} />
                    <img src={hotroll} />
                    <img src={sushi4} />
                </div>

                <div className="content_sobre">
                    <div className="sobre_colunas">
                        <div className="home_direita">
                            <img src={niguiri} />
                        </div>

                        <div className="home_esquerda">
                            <h3>Nosso trabalho</h3>

                            <h4>
                                Atualmente, oferecemos opções de delivery e
                                retirada no local para garantir que você possa
                                desfrutar do seu sabor favorito do JapaCasa!
                                onde quer que esteja. E enquanto nossa unidade
                                física está sendo reformada, aguardamos
                                ansiosamente a oportunidade de recebê-lo em
                                nosso novo espaço, onde você poderá desfrutar
                                não apenas da nossa comida excepcional, mas
                                também de uma atmosfera acolhedora e
                                hospitalidade japonesa autêntica.
                            </h4>

                            <h4>
                                Explore nosso menu, faça seu pedido e deixe-nos
                                levá-lo em uma jornada gastronômica memorável.
                                Obrigado por escolher o JapaCasa!
                            </h4>
                        </div>
                    </div>
                </div>

                <TextCardJP />

                <ContentLocal />
            </div>
        </motion.div>
    );
};

export default Sobre;
