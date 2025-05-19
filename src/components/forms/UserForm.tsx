"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Stack } from "@/components/layout/Stack"
import { trpc } // This will be a placeholder for now
  from "@/lib/trpc/client" // Assuming trpc client will be here
import { useToast } from "@/hooks/useToast"
import { Label } from "../ui/Label" // Changed to relative path
import type { TRPCClientErrorLike } from "@trpc/react-query"; // Changed to TRPCClientErrorLike
import type { AppRouter } from "../../api/index"; // Changed to relative path

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
})

type UserFormData = z.infer<typeof userSchema>

export function UserForm({ onSuccess }: { onSuccess?: (data: any) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const utils = trpc.useUtils()
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  const createUser = trpc.user.create.useMutation({
    onSuccess: (data: any) => { // Added type for data
      toast({
        title: "Success!",
        description: "User created successfully.",
        variant: "success",
      })
      reset()
      utils.user.list.invalidate() // Invalidate user list to refetch
      if (onSuccess) onSuccess(data);
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => { // Use TRPCClientErrorLike<AppRouter>
      toast({
        title: "Error",
        description: error.message || "Failed to create user. Please try again.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true)
    createUser.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <Stack gap="md">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="e.g. John Doe"
            error={errors.name?.message}
            {...register("name")}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="e.g. john.doe@example.com"
            error={errors.email?.message}
            {...register("email")}
            className="mt-1"
          />
        </div>
        
        <Button type="submit" loading={isSubmitting} fullWidth>
          Create User
        </Button>
      </Stack>
    </form>
  )
}
