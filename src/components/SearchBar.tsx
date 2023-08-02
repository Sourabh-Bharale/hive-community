'use client'
import { useQuery } from "@tanstack/react-query";
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem
} from "./ui/command";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Prisma, Subreddit } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { UsersIcon } from "@heroicons/react/24/outline";
import { buttonVariants } from "./ui/Button";
import debounce from "lodash.debounce";
import { CommandDialog } from "cmdk";
import { Skeleton } from "./ui/skeleton";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

interface SearchBarProps {

}

export default function SearchBar({ }: SearchBarProps) {

    const [input, setInput] = useState<string>('')
    const router = useRouter()
    const pathname = usePathname()

    const commandRef = useRef<HTMLDivElement>(null)

    useOnClickOutside(commandRef,()=>{
        setInput('')
    })

    useEffect(()=>{
        setInput('')
    },[pathname])


    const { data: queryResults, refetch, isFetched, isFetching } = useQuery({
        queryFn: async () => {
            if (!input) return []
            const { data } = await axios.get(`/api/search?q=${input}`)
            return data as (Subreddit & {
                _count: Prisma.SubredditCountOutputType
            })[]
        },
        queryKey: ['search-query'],
        enabled: false,
    })

    const request = debounce(async () => {
        refetch()
    }, 500)

    const debounceRequest = useCallback(() => {
        request()
    }, [])


    return (
        <Command ref={commandRef} className="relative rounded-lg border  max-w-lg z-50 overflow-visible backdrop-blur-md">
            <CommandInput
                value={input}
                onValueChange={(text) => {
                    setInput(text)
                    debounceRequest()
                }}
                className="outline-none focus:outline-none border-none focus:border-none ring-0"
                placeholder='Search...'
            />
            {isFetching?(
                <div className="flex items-center gap-2 p-4">
                    <Skeleton className="w-4 h-4"/>
                    <Skeleton className="w-full h-8"/>
                </div>
            ):null}
            {input.length > 0 ? (
                <CommandList className="mt-2 absolute top-full inset-x-0 border bg-white dark:bg-[#030711] shadow p-4 rounded-md">
                    {isFetched && <CommandEmpty>No results found...</CommandEmpty>}
                    {(queryResults?.length ?? 0) > 0 ? (
                        <CommandGroup heading='Communities'>
                            {queryResults?.map((subreddit) => (
                                <CommandItem className="flex items-center gap-2" key={subreddit.id} value={subreddit.name} onSelect={(e) => {
                                    router.push(`/hub/${e}`)
                                    router.refresh()
                                    setInput('')
                                }}>
                                    <UsersIcon className=" h-4 w-4" />
                                    <a href={`/hub/${subreddit.name}`}>hub/{subreddit.name}</a>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ) : null}
                </CommandList>
            ) : null}
        </Command>
    )
}
