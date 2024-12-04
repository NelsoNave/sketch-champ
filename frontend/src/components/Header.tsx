import { useState } from "react";
import Modal from "./Login";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex justify-between items-center py-5 px-2 md:px-8">
      <div>Kawaii Logo</div>
      <nav>
        <button onClick={openModal} className="text-sm">
          Log in
        </button>
      </nav>
      {isModalOpen && <Modal closeModal={closeModal} />}
    </div>
  );
};

export default Header;
