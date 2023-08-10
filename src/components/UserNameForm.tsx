'use client'

import { UserNameRequest, UserNameValidator } from "@/lib/validators/username"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/Button"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { cn } from "@/lib/utils"

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
    user: Pick<User, 'id' | 'username'>
  }

  type FormData = z.infer<typeof UserNameValidator>
  export function UserNameForm({ user, className, ...props }: UserNameFormProps) {

    const {loginToast} = useCustomToast()

    const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(UserNameValidator),
    defaultValues: {
      name: user?.username || '',
    },
  })
  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ name }: FormData) => {
      const payload: FormData = { name }

      const { data } = await axios.patch(`/api/username/`, payload)
      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: 'Username already taken.',
            description: 'Please choose another username.',
            variant: 'destructive',
          })
        }
        if (err.response?.status === 422) {
          return toast({
              title: 'Invalid user name',
              description: 'A valid username is between 3 and 21 Alphanumeric characters only (special characters not allowed)',
              variant: 'destructive'
          })
      }
      }

      return toast({
        title: 'Something went wrong.',
        description: 'Your username was not updated. Please try again.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      toast({
        description: 'Your username has been updated.',
      })
      router.refresh()
    },
  })


  return (
    <form
    className={cn(className)}
    onSubmit={handleSubmit((e) => updateUsername(e))}
    {...props}>
        <Card>
        <CardHeader>
          <CardTitle>Your username</CardTitle>
          <CardDescription>
            Please enter a username
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='relative grid gap-1'>
            <div className='absolute top-0 left-0 w-8 h-10 grid place-items-center'>
              <span className='text-sm'>u/</span>
            </div>
            <Label className='sr-only' htmlFor='name'>
              Name
            </Label>
            <Input
              id='name'
              className='pl-6'
              size={32}
              {...register('name')}
            />
            {errors?.name && (
              <p className='px-1 text-xs text-red-600'>{errors.name.message}</p>
            )}
          </div>
        </CardContent>
            <CardFooter>
                <Button isLoading={isLoading}>Change Username</Button>
            </CardFooter>
        </Card>
    </form>
  )
}
