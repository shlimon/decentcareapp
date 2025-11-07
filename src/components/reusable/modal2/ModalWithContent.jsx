import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const ModalWithContent = ({
  title,
  content,
  isOpen,
  setIsOpen,
  padding = true,
  maxWidth = 'max-w-xl',
}) => {
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`relative w-full ${maxWidth} overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg`}
              >
                <div className="flex flex-row-reverse items-start justify-between p-4 bg-white border-b">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="p-1 text-gray-500 transition-all duration-200 transform bg-gray-100 rounded-full hover:text-white hover:bg-red-500 focus:outline-none hover:scale-105"
                  >
                    <AiOutlineClose size={16} />
                  </button>

                  <Dialog.Title
                    as="h3"
                    className="pr-8 text-xl font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                </div>

                <div className={`max-h-[75vh] overflow-y-auto ${padding ? "p-4" : ""}`}>
                  {content}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default React.memo(ModalWithContent);
