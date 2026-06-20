import { Page } from "@/payload-types";

type FormProps = Extract<Page["layout"][0], { blockType: "form" }>;

export default function Form({ block }: { block: FormProps }) {
    return (
        <form className="bg-[#0a0a0a] text-gray-400 px-16 py-8 pb-20 flex flex-col h-full">
            <h2 className="mb-[5%] mt-[10%] text-4xl">{block.title}</h2>


            {block.input_elements.map((item) => (
                <div key={item.id} className={`${item.add_margin ? `mb-[4%]`: ``} text-xl`}>
                    {
                        item.input_name && (
                            <p className="mb-[2%]">{item.input_name}</p>
                        )
                    }

                    {
                        item.input_type == "text" && (
                            item.input_fields.map((input_field) => (
                                <input 
                                    key={input_field.id} 
                                    className="block w-2/5 px-4 py-2 mb-[2%] py-2 border border-gray-300 rounded-md hover:bg-gray-800 focus:outline-none" 
                                    type="text" 
                                    name={input_field.input_name} 
                                    defaultValue="" 
                                    placeholder={input_field.input_label} 
                                />
                            ))
                        )
                    }

                    {
                        item.input_type == "password" && (
                            item.input_fields.map((input_field) => (
                                <input 
                                    key={input_field.id} 
                                    className="block w-2/5 px-4 py-2 mb-[2%] py-2 border border-gray-300 rounded-md hover:bg-gray-800 focus:outline-none" 
                                    type="password" 
                                    name={input_field.input_name} 
                                    defaultValue="" 
                                    placeholder={input_field.input_label} 
                                />
                            ))
                        )
                    }

                    {
                        item.input_type == "checkbox" && (
                            item.input_fields.map((input_field) => (
                                <div key={input_field.id} className="text-xl">
                                    <input type="checkbox" className="w-6 h-6 mb-[1%] mr-[1.3%] border-gray-300 rounded-lg" value={input_field.input_name} name={input_field.input_name} />
                                    {input_field.input_label}
                                </div>
                            ))
                        )
                    }

                    {
                        item.input_type == "dropdown" && (
                            <select className="w-1/5 p-3 mb-[2%] border border-gray-300 rounded-md focus:outline-none hover:bg-gray-800" name={block.title}>
                                {
                                    item.input_fields.map((input_field) => (
                                        <option key={input_field.id} className="text-lg px-4 py-2" value={input_field.input_name}>
                                            {input_field.input_label}
                                        </option>
                                    ))
                                }
                            </select>
                        )
                    }
                </div>
            ))}

            <button
                className="block mx-auto rounded w-1/4 px-5 py-2.5 bg-[rgb(190,18,60)] hover:bg-[rgba(227,26,76,1)] text-white text-xl font-bold text-gray-500"
            >
                Submit
            </button>

        </form>
    )
}
