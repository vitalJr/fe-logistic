"use server";

export async function showroomDemoAction(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 700));
}
