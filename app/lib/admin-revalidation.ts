import { revalidatePath } from "next/cache";

export function revalidateProjectViews() {
  revalidatePath("/");
  revalidatePath("/search");
}

export function revalidateNowViews() {
  revalidatePath("/");
}

export function revalidateTinyThoughtViews() {
  revalidatePath("/");
  revalidatePath("/tiny-thoughts");
  revalidatePath("/updates");
  revalidatePath("/search");
  revalidatePath("/tiny-thoughts/rss.xml");
}

export function revalidateGuestbookViews() {
  revalidatePath("/");
}
