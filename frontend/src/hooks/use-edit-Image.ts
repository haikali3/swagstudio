import { useMutation } from "@tanstack/react-query";
import { editImage } from "@/lib/api/edit-image";

export function useEditImage(onSuccess: (blobUrl: string) => void, onError?: (err: any) => void) {
  return useMutation({
    mutationFn: editImage,
    onSuccess,
    onError,
  });
}
