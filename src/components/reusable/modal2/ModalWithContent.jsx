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
          <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel
                className={`relative w-full ${maxWidth} overflow-hidden text-left align-middle transition-all transform shadow-2xl rounded-2xl`}
              >
                {/* Glass morphism container */}
                <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-xl">
                  {/* Header with gradient and glass effect */}
                  <div className="relative flex flex-row-reverse items-center justify-between p-5 bg-gradient-to-r from-blue-50/80 via-purple-50/80 to-pink-50/80 backdrop-blur-md border-b border-white/30">
                    {/* Decorative gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

                    <button
                      type="button"
                      onClick={closeModal}
                      className="relative z-10 p-2 text-gray-600 transition-all duration-300 transform bg-white/60 backdrop-blur-sm rounded-xl hover:bg-red-500 hover:text-white focus:outline-none hover:scale-110 hover:rotate-90 shadow-lg hover:shadow-red-500/50 border border-white/40"
                    >
                      <AiOutlineClose size={18} />
                    </button>

                    <Dialog.Title
                      as="h1"
                      className="relative z-10 pr-8 text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent !mb-0"
                    >
                      {title}
                    </Dialog.Title>
                  </div>

                  {/* Content area with glass effect */}
                  <div
                    className={`max-h-[75vh] overflow-y-auto backdrop-blur-sm bg-white/60 ${
                      padding ? 'p-6' : ''
                    }`}
                  >
                    <div className="relative">
                      {/* Subtle gradient overlay on content */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-lg" />
                      <div className="relative z-10">{content}</div>
                    </div>
                  </div>

                  {/* Bottom decorative glow */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                </div>

                {/* Outer glow effect */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-2xl rounded-2xl" />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default React.memo(ModalWithContent);
