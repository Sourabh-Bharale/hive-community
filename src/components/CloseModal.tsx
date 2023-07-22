'use client'
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/Button";
import {useRouter} from 'next/navigation'

export default function CloseModal() {
    const router = useRouter()
    return (
        <Button variant={'subtle'} aria-label="close modal"
        className="h-8 w-8 p-0 rounded-full"
        onClick={()=>router.back()}>
            <XMarkIcon className="w-6 h-6" />

        </Button>
    )
}