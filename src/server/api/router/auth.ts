import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { auth } from "@clerk/nextjs";

export const authRouter = createTRPCRouter({
  me: publicProcedure.query(async ({ ctx }) => {
    const { userId } = auth();
    if (!userId) {
      return null;
    }
    const user = await ctx.db.user2.findFirst({
      where: {
        id: userId,
      },
    });
    return user;
  }),
  getUserId: publicProcedure.query(async ({ ctx }) => {
    const { userId } = auth();
    if (!userId) {
      return null;
    }
    return userId;
  }),
  createUser: publicProcedure
    .input(
      z.object({
        avatar: z.string(),
        nickname: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = auth();
      if (!userId) {
        return null;
      }
      const user = await ctx.db.user2.create({
        data: {
          id: userId,
          nickname: input.nickname,
          avatar: input.avatar,
        },
      });
      return user;
    }),
  updateUser: publicProcedure
    .input(
      z.object({
        avatar: z.string(),
        nickname: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = auth();
      if (!userId) {
        return null;
      }
      const user = await ctx.db.user2.update({
        where: {
          id: userId,
        },
        data: {
          nickname: input.nickname,
          avatar: input.avatar,
        },
      });
      return user;
    }),
});
