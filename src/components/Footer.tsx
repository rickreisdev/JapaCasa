import "../assets/styles/footer.scss";
import rickreisLogo from "../assets/svg/logo-rickreis.svg";

const currentYear = new Date().getFullYear();

const Footer = () => {
    return (
        <>
            <footer>
                <div className="container-footer">
                    <div className="logos">
                        <div className="jpc">
                            {currentYear}
                            <div className="jpc-logo">
                                <span>Japa</span>Casa!
                            </div>
                        </div>

                        <a target="_blank" href="https://rickreis.dev.br">
                            <img
                                src={rickreisLogo}
                                alt="Logo rickreis"
                                className="rickreisme"
                                style={{
                                    width: "7rem",
                                    marginBottom: "0.5rem",
                                }}
                            />
                        </a>
                    </div>

                    <div className="credits">Desenvolvido por Rick Reis</div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
