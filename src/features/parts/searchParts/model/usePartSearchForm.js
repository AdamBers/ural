import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { partSearchSchema } from "@/features/parts/searchParts/model/partSearchSchema.js";
import {
  fetchBrands,
  setNumber,
} from "@/features/parts/searchParts/model/searchSlice.js";
export function usePartSearchForm({ initialNumber, mode }) {
  const dispatch = useDispatch();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setFocus,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(partSearchSchema),
    mode: "onChange",
    defaultValues: { number: initialNumber },
  });
  const value = useWatch({ control, name: "number" });
  // RHF owns the input; Redux keeps the shared search/results context.
  useEffect(() => {
    dispatch(setNumber(value));
  }, [value, dispatch]);
  useEffect(() => {
    if (!value.trim()) return;
    let active = true;
    let request;
    const timer = setTimeout(() => {
      void handleSubmit(({ number }) => {
        if (active) request = dispatch(fetchBrands({ number, mode }));
      })();
    }, 500);
    return () => {
      active = false;
      clearTimeout(timer);
      request?.abort();
    };
  }, [value, mode, dispatch, handleSubmit]);
  return {
    register,
    error: errors.number?.message,
    chooseNumber: (number) => {
      setValue("number", number, { shouldDirty: true, shouldValidate: true });
      requestAnimationFrame(() => setFocus("number"));
    },
    clearNumber: () => {
      reset({ number: "" });
      setFocus("number");
    },
    onSubmit: (event) => {
      event.preventDefault();
      // Enter validates without bypassing the single debounced request path.
      void trigger("number");
    },
  };
}
