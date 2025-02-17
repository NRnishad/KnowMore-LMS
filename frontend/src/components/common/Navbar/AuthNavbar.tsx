import Logo from "../../../assets/LearnLab-Main-LOGO.svg";

const AuthNavbar = () => {
  return (
    <div className="shadow-md w-full fixed top-0 left-0 bg-white py-4 px-6 flex justify-center">
      <img src={Logo} alt="Logo" className="h-auto w-32" />
    </div>
  );
};
export default AuthNavbar;