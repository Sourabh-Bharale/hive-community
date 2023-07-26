import dynamic from "next/dynamic"
import Image from "next/image"

const Output = dynamic(
    async()=>(await import('editorjs-react-renderer')).default,
    {
        ssr: false,
    }
)
interface EditorOutputProps{
    content : any,
}

const style = {
    paragraph : {
        fontSize:'0.875rem',
        lineHeight:'1.25rem',
    },
}

const CustomImageRenderer = ({data}:any)=>{
    const src = data.file.url
    return (
        <div className="relative w-full min-h-[15rem]">
            <Image alt='image' src={src} fill className="object-contain"/>
        </div>
    )
}

const CustomCodeRenderer = ({data}:any)=>{

    return (
       <pre className="w-fit rounded-md p-4">
        <code className="text-sm">{data.code}</code>
       </pre>
    )
}

const renderers = {
    image: CustomImageRenderer,
    code:CustomCodeRenderer,
}

export default function EditorOutput({content}:EditorOutputProps) {
  return (
    <Output style={style} data={content} className='text-sm' renderers={renderers}/>
  )
}
