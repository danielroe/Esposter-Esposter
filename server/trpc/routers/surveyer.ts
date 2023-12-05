import { AzureTable } from "@/models/azure/table";
import { createPaginationSchema } from "@/models/shared/pagination/Pagination";
import { SurveyEntity, surveySchema } from "@/models/surveyer/SurveyEntity";
import { router } from "@/server/trpc";
import { authedProcedure } from "@/server/trpc/procedure";
import {
  createEntity,
  deleteEntity,
  getEntity,
  getTableClient,
  getTopNEntities,
  updateEntity,
} from "@/services/azure/table";
import { getPaginationData } from "@/services/shared/pagination/getPaginationData";
import { getPublishedSurveyRowKey } from "@/services/surveyer/table";
import { z } from "zod";

// Azure table storage does not support order by
const readSurveysInputSchema = createPaginationSchema(surveySchema.keyof()).omit({ sortBy: true }).default({});
export type ReadSurveysInput = z.infer<typeof readSurveysInputSchema>;

const createSurveyInputSchema = surveySchema.pick({ name: true, group: true, model: true });
export type CreateSurveyInput = z.infer<typeof createSurveyInputSchema>;

const updateSurveyInputSchema = surveySchema
  .pick({ rowKey: true, modelVersion: true })
  .merge(surveySchema.partial().pick({ name: true, group: true, model: true }));
export type UpdateSurveyInput = z.infer<typeof updateSurveyInputSchema>;

const deleteSurveyInputSchema = surveySchema.pick({ rowKey: true });
export type DeleteSurveyInput = z.infer<typeof deleteSurveyInputSchema>;

const publishSurveyInputSchema = surveySchema.pick({ rowKey: true, publishVersion: true });
export type PublishSurveyInput = z.infer<typeof publishSurveyInputSchema>;

export const surveyerRouter = router({
  readSurveys: authedProcedure.input(readSurveysInputSchema).query(async ({ input: { cursor, limit }, ctx }) => {
    let filter = `PartitionKey eq '${ctx.session.user.id}'`;
    if (cursor) filter += ` and RowKey gt '${cursor}'`;
    const surveyClient = await getTableClient(AzureTable.Surveys);
    const surveys = await getTopNEntities(surveyClient, limit + 1, SurveyEntity, { filter });
    return getPaginationData(surveys, "rowKey", limit);
  }),
  createSurvey: authedProcedure.input(createSurveyInputSchema).mutation(async ({ input, ctx }) => {
    const createdAt = new Date();
    const newSurvey = new SurveyEntity({
      ...input,
      partitionKey: ctx.session.user.id,
      rowKey: crypto.randomUUID(),
      modelVersion: 1,
      createdAt,
      updatedAt: createdAt,
    });
    const surveyClient = await getTableClient(AzureTable.Surveys);
    await createEntity(surveyClient, newSurvey);
    return newSurvey;
  }),
  updateSurvey: authedProcedure.input(updateSurveyInputSchema).mutation(async ({ input, ctx }) => {
    const surveyClient = await getTableClient(AzureTable.Surveys);
    const survey = await getEntity(surveyClient, SurveyEntity, ctx.session.user.id, input.rowKey);
    if (!survey) throw new Error("Cannot find survey");

    if (input.model !== survey.model) {
      input.modelVersion++;
      if (input.modelVersion <= survey.modelVersion)
        throw new Error("Cannot update survey model with old model version");
    }

    await updateEntity(surveyClient, {
      ...input,
      partitionKey: ctx.session.user.id,
      updatedAt: new Date(),
    });
    return input;
  }),
  deleteSurvey: authedProcedure.input(deleteSurveyInputSchema).mutation(async ({ input, ctx }) => {
    const surveyClient = await getTableClient(AzureTable.Surveys);
    await deleteEntity(surveyClient, ctx.session.user.id, input.rowKey);
  }),
  publishSurvey: authedProcedure.input(publishSurveyInputSchema).mutation(async ({ input, ctx }) => {
    const [surveyClient, publishedSurveyClient] = await Promise.all([
      getTableClient(AzureTable.Surveys),
      getTableClient(AzureTable.PublishedSurveys),
    ]);
    const survey = await getEntity(surveyClient, SurveyEntity, ctx.session.user.id, input.rowKey);
    if (!survey) throw new Error("Cannot find survey");

    input.publishVersion++;
    if (input.publishVersion <= survey.publishVersion)
      throw new Error("Cannot update survey publish with old publish version");

    const publishedSurveyRowKey = getPublishedSurveyRowKey(input.rowKey, input.publishVersion);
    const publishedSurvey = await getEntity(
      publishedSurveyClient,
      SurveyEntity,
      ctx.session.user.id,
      publishedSurveyRowKey,
    );
    if (publishedSurvey) throw new Error("Found existing survey publish with current publish version");

    const publishedAt = new Date();
    await createEntity(publishedSurveyClient, { ...survey, rowKey: publishedSurveyRowKey, publishedAt });
    await updateEntity(surveyClient, { ...survey, publishedAt });
    return input;
  }),
});
