import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { articleConfirmationSchema } from "@/features/parts/searchParts/model/articlePhotoSchema.js";
export function useArticleConfirmation(result, onConfirm) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(articleConfirmationSchema),
    defaultValues: { number: "" },
  });
  useEffect(() => {
    reset({ number: result?.candidates?.[0] || "" });
  }, [result, reset]);
  return {
    register,
    errors,
    submit: handleSubmit(({ number }) => onConfirm(number)),
    pick: (value) => setValue("number", value, { shouldValidate: true }),
  };
}
