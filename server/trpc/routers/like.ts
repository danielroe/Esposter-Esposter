import { db } from "@/db";
import { likes, selectLikeSchema } from "@/db/schema/users";
import { prisma } from "@/prisma";
import { router } from "@/server/trpc";
import { authedProcedure } from "@/server/trpc/procedure";
import { ranking } from "@/services/post/ranking";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

const createLikeInputSchema = selectLikeSchema.pick({ postId: true, value: true });
export type CreateLikeInput = z.infer<typeof createLikeInputSchema>;

const updateLikeInputSchema = selectLikeSchema.pick({ postId: true, value: true });
export type UpdateLikeInput = z.infer<typeof updateLikeInputSchema>;

const deleteLikeInputSchema = selectLikeSchema.pick({ postId: true });
export type DeleteLikeInput = z.infer<typeof deleteLikeInputSchema>;

export const likeRouter = router({
  createLike: authedProcedure.input(createLikeInputSchema).mutation(({ input, ctx }) =>
    db.transaction(async (tx) => {
      const newLike = (
        await tx
          .insert(likes)
          .values({ ...input, userId: ctx.session.user.id })
          .returning()
      )[0];
      const post = await tx.query.posts.findFirst({ where: (posts, { eq }) => eq(posts.id, newLike.postId) });
      if (!post) {
        tx.rollback();
        return null;
      }

      const noLikesNew = post.noLikes + newLike.value;
      await prisma.post.update({
        data: { noLikes: noLikesNew, ranking: ranking(noLikesNew, post.createdAt) },
        where: { id: post.id },
      });
      return newLike;
    }),
  ),
  updateLike: authedProcedure.input(updateLikeInputSchema).mutation(async ({ input: { postId, ...rest }, ctx }) => {
    const where: Prisma.LikeWhereUniqueInput = { userId_postId: { userId: ctx.session.user.id, postId } };
    const like = await prisma.like.findUnique({ where, include: { post: true } });
    if (!like || like.value === rest.value) return null;

    const noLikesNew = like.post.noLikes + 2 * rest.value;
    const updatedLike = await prisma.like.update({
      data: {
        ...rest,
        post: { update: { noLikes: noLikesNew, ranking: ranking(noLikesNew, like.post.createdAt) } },
      },
      where,
    });
    return updatedLike;
  }),
  deleteLike: authedProcedure.input(deleteLikeInputSchema).mutation(async ({ input: { postId }, ctx }) => {
    await prisma.$transaction(async (prisma) => {
      const deletedLike = await prisma.like.delete({
        where: { userId_postId: { userId: ctx.session.user.id, postId } },
        include: { post: true },
      });
      const noLikesNew = deletedLike.post.noLikes - deletedLike.value;
      await prisma.post.update({
        data: { noLikes: noLikesNew, ranking: ranking(noLikesNew, deletedLike.post.createdAt) },
        where: { id: postId },
      });
    });
  }),
});
