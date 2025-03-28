import { Button } from '@/components/ui/button'
import { Form , FormControl, FormField, FormMessage, FormItem} from '@/components/ui/form'
import { Pencil } from 'lucide-react'
import React, { useState } from 'react'
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Combobox } from '@/components/ui/combobox';

interface CategoryFormProps {
    initialData: {
        categoryId: string;
    },
    courseId: string,
    options: {label: string, value: string}[]
}

const formSchema = z.object({
    categoryId: z.string().min(1, {
        message : 'Description is required',
    })
})
const CategoryForm = ({
    initialData,
    courseId,
    options
} : CategoryFormProps) => {

    const [isEditing , setIsEditing] = useState(false)
    const toggleEdit = () => setIsEditing((current) => !current)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues : {categoryId : initialData.categoryId}
    })
    const {isSubmitting, isValid} = form.formState
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
    }

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
        <div className='font-medium flex items-center justify-between'>
            Course category
            <Button variant='ghost' onClick={toggleEdit}>
                {isEditing ? (
                    <>Cancel</>
                ) : (
                    <>
                    <Pencil className='h-4 w-4 mr-2'/>
                    Edit category
                    </>
                )}
                
            </Button>
        </div>

        {!isEditing && (
            <p className='text-sm mt-2 italic'>No description</p>
        )}
        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                    <FormField control={form.control}
                    name='categoryId'
                    render={({field})=> (
                        <FormItem>
                            <FormControl>
                                <Combobox 
                                options={[...options]}
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
        )}/>
        <div className='flex items-center gap-x-2'>
        <Button 
        type='submit'
        disabled={!isValid || isSubmitting}>
            Save
            </Button>
        </div>
                </form>

            </Form>
        )}
    </div>
  )
}

export default CategoryForm