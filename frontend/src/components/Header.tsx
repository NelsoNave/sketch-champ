import { useState } from "react";
import LoginModal from "./LoginModal";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex justify-between items-center py-5 px-2 md:px-8">
      <div className="font-russo_one">Kawaii Logo</div>
      <nav>
        <button onClick={openModal} className="text-md font-bold">
          Log in
        </button>
      </nav>
      {isModalOpen && <LoginModal closeModal={closeModal} />}
    </div>
  );
};

export default Header;
