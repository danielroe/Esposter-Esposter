<script setup lang="ts">
import type { PostWithRelations } from "@/db/schema/posts";
import dayjs from "dayjs";

interface PostCardProps {
  post: PostWithRelations;
}

const { post } = defineProps<PostCardProps>();
const { session } = useAuth();
const { surfaceOpacity80 } = useColors();
const createdAt = computed(() => dayjs(post.createdAt).fromNow());
const isOwner = computed(() => session.value?.user.id === post.creatorId);
</script>

<template>
  <StyledCard class="card">
    <PostLikeSection absolute top-2 left-2 :post="post" />
    <v-card px-2="!" pt-2="!">
      <v-avatar>
        <v-img v-if="post.creator.image" :src="post.creator.image" />
      </v-avatar>
      Posted by <span font-bold>{{ post.creator.name }}</span> <span class="text-grey">{{ createdAt }}</span>
      <v-card-title class="text-h6" px-0="!" font-bold="!" whitespace="normal!">
        {{ post.title }}
      </v-card-title>
      <v-card-text class="text-subtitle-1 card-content" px-0="!" pb-0="!" v-html="post.description" />
      <v-card-actions p-0="!">
        <PostUpdateButton v-if="isOwner" :post-id="post.id" />
        <PostConfirmDeleteDialogButton v-if="isOwner" :post-id="post.id" />
      </v-card-actions>
    </v-card>
  </StyledCard>
</template>

<style scoped lang="scss">
.card {
  padding-left: 2.5rem;
  background-color: v-bind(surfaceOpacity80);
}

:deep(.card-content) {
  ul,
  ol {
    padding: 0 1rem;
  }
}
</style>
