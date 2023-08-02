'use client'

import dynamic from "next/dynamic"
import Image from "next/image"
import { Suspense } from "react"
import { Label } from "./ui/label"

const Output = dynamic(
    async () => (await import('editorjs-react-renderer')).default,
    {
        ssr: false,
    }
)

interface EditorOutputProps {
    content: any,
}

const style = {
    paragraph: {
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
    },
}

const CustomImageRenderer = ({ data }: any) => {
    const src = data.file.url
    return (
        <div className="relative w-full min-h-[15rem]">
            <Image alt='image' src={src} fill className="object-contain" />
        </div>
    )
}

const CustomCodeRenderer = ({ data }: any) => {
    return (
        <div className="">
            <Label htmlFor="code" className="my-2">
                <kbd className="border p-1 rounded-full">code</kbd>
            </Label>
            <pre id="code" className="w-full overflow-x-scroll border-2 scrollbar-thin scrollbar-thumb-current scrollbar-thumb-rounded-sm rounded-md p-4">

                <code className="w-fit text-sm">{data.code}</code>
            </pre>
        </div>
    )
}

const renderers = {
    image: CustomImageRenderer,
    code: CustomCodeRenderer,
}

export default function EditorOutput({ content }: EditorOutputProps) {


    return (
        <Output style={style} data={content} className='text-sm' renderers={renderers} />
    )
}
