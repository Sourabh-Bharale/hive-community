'use client'
import { useTheme } from "next-themes"
import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";


export default function Theme() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme();
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <div className="flex flex-col items-center justify-center w-full gap-4">
            <h1 className="flex self-start font-semibold text-lg text-start">Change theme</h1>
            <RadioGroup defaultValue={theme} className="flex lg:flex-row flex-col w-full">
                <div className="flex items-center w-full">
                    <div onClick={() => setTheme('light')} className="flex bg-white flex-col w-full gap-4 max-w-xs p-2 rounded-xl border">
                        <Skeleton className="w-24  border h-2" />
                        <div className="flex gap-3">
                            <Skeleton className="w-full  border h-12" />
                            <Skeleton className="w-20  border h-6" />
                        </div>
                        <div className="flex gap-2 items-center">
                        <RadioGroupItem value="light" className="bg-[#030711]" id="light" />
                        <Label htmlFor="light" className="font-semibold text-lg text-center text-[#030711]">Light</Label>
                        </div>
                    </div>
                </div>
                <div className="flex items-center w-full">
                    <div className="flex bg-[#030711] flex-col w-full gap-4 max-w-xs p-2 rounded-xl border">
                        <Skeleton className="w-24  border h-2" />
                        <div className="flex gap-3">
                            <Skeleton className="w-full  border h-12" />
                            <Skeleton className="w-20  border h-6" />
                        </div>
                        <div className="flex gap-2 items-center">
                        <RadioGroupItem value="dark" className="bg-white" id="dark" onClick={() => setTheme('dark')} />
                        <Label htmlFor="dark" className="font-semibold text-lg text-center text-white">dark</Label>
                        </div>
                    </div>
                </div>
                <div className="flex items-center w-full">
                    <div className="flex  flex-col w-full gap-4 max-w-xs p-2 rounded-xl border">
                        <Skeleton className="w-24  border h-2" />
                        <div className="flex gap-3">
                            <Skeleton className="w-full  border h-12" />
                            <Skeleton className="w-20  border h-6" />
                        </div>
                        <div className="flex gap-2 items-center">
                        <RadioGroupItem className="bg-inherit" value="system" id="system" onClick={() => setTheme('system')} />
                        <Label htmlFor="system" className="font-semibold text-lg text-center ">system</Label>
                        </div>
                    </div>
                </div>
            </RadioGroup>

        </div>
    )
}
