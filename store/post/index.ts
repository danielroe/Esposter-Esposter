import type { PostWithRelations } from "@/db/schema/posts";
import type { CreatePostInput, DeletePostInput, UpdatePostInput } from "@/server/trpc/routers/post";
import { createPaginationData } from "@/services/shared/pagination/createPaginationData";

export const usePostStore = defineStore("post", () => {
  const { $client } = useNuxtApp();
  const { items: postList, ...rest } = createPaginationData<PostWithRelations>();
  const pushPosts = (posts: PostWithRelations[]) => {
    postList.value.push(...posts);
  };
  const createPost = async (input: CreatePostInput) => {
    const newPost = await $client.post.createPost.mutate(input);
    if (newPost) postList.value.push(newPost);
  };
  const updatePost = async (input: UpdatePostInput) => {
    const updatedPost = await $client.post.updatePost.mutate(input);
    if (updatedPost) {
      const index = postList.value.findIndex((r) => r.id === updatedPost.id);
      if (index > -1) postList.value[index] = { ...postList.value[index], ...updatedPost };
    }
  };
  const deletePost = async (id: DeletePostInput) => {
    await $client.post.deletePost.mutate(id);
    postList.value = postList.value.filter((r) => r.id !== id);
  };

  return {
    postList,
    ...rest,
    pushPosts,
    createPost,
    updatePost,
    deletePost,
  };
});
