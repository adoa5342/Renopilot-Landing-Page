'use client';

import { Page } from "@/payload-types"

type PopupProps = Extract<Page['layout'][0], { blockType: 'popup-form' }>

export default function PopupForm({ block }: { block: PopupProps }) {
    return (
        <div 
            className={`
                bg-[rgb(27,27,29)] 
                fixed hidden flex-col 
                top-1/2 bottom-0 left-1/2
                transform -translate-x-1/2 -translate-y-1/2 
                right-0 items-center justify-center z-1000
                text-white w-[35vw] h-[75vh] gap-5 popup`}
            {...(block.blockName ? { id: block.blockName } : {})}
        >
            <button
              className="absolute top-4 right-4 text-3xl font-bold text-gray-500 hover:text-gray-800"
              onClick={() => {
                const popups = document.getElementsByClassName("popup");
                for (let popup of popups) {
                    popup.style.display = "none";
                }
              }}
            >
              &times;
            </button>

            <h2 className="absolute top-15 text-2xl">{block.title}</h2>

            <ul className="flex flex-col justify-center w-full gap-5 p-5">
                {block.inputs.map((input) => (
                    <li key={input.id} className="w-full">
                        <input 
                            className={`w-full px-4 py-2 border border-gray-300 
                                rounded-md hover:bg-gray-800 
                                focus:outline-none`}
                            placeholder={input.field}
                            type={input.isPassword ? "password" : "text"}
                        />
                    </li>
                ))}
            </ul>

            <button
                onClick={() => window.location.href = block.button.url}
                className="bg-[rgb(190,18,60)] hover:bg-[rgba(227,26,76,1)] text-white px-5 py-2.5 rounded text-sm"
            >
                {block.button.label}
            </button>
        </div>
    )
}
