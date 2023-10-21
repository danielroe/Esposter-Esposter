import { SurveyEntity } from "@/models/surveyer/SurveyEntity";
import type { CreateSurveyInput, DeleteSurveyInput, UpdateSurveyInput } from "@/server/trpc/routers/surveyer";
import { DEFAULT_PARTITION_KEY } from "@/services/azure/constants";
import { SURVEYER_STORE } from "@/services/surveyer/constants";
import { NIL } from "@/util/uuid";

export const useSurveyStore = defineStore("surveyer/survey", () => {
  const { $client } = useNuxtApp();
  const { session, status } = useAuth();
  const surveyList = ref<SurveyEntity[]>([]);
  const pushSurveyList = (surveys: SurveyEntity[]) => surveyList.value.push(...surveys);

  const surveyListNextCursor = ref<string | null>(null);
  const updateSurveyListNextCursor = (nextCursor: string | null) => {
    surveyListNextCursor.value = nextCursor;
  };

  const initialiseSurveyList = (surveys: SurveyEntity[]) => {
    surveyList.value = surveys;
  };
  const createSurvey = async (input: CreateSurveyInput) => {
    if (status.value === "authenticated") {
      const newSurvey = await $client.surveyer.createSurvey.mutate(input);
      surveyList.value.push(newSurvey);
    } else if (status.value === "unauthenticated") {
      const createdAt = new Date();
      const newSurvey = new SurveyEntity({
        ...input,
        partitionKey: DEFAULT_PARTITION_KEY,
        rowKey: crypto.randomUUID(),
        modelVersion: 1,
        createdAt,
        updatedAt: createdAt,
      });
      surveyList.value.push(newSurvey);
      unauthedSave();
    }
  };
  const updateSurvey = async (input: UpdateSurveyInput) => {
    if (status.value === "authenticated") {
      const updatedSurvey = await $client.surveyer.updateSurvey.mutate(input);

      const index = surveyList.value.findIndex(
        (r) => r.partitionKey === session.value?.user.id && r.rowKey === updatedSurvey.rowKey,
      );
      if (index > -1) surveyList.value[index] = { ...surveyList.value[index], ...updatedSurvey };
    } else if (status.value === "unauthenticated") {
      const index = surveyList.value.findIndex((r) => r.partitionKey === NIL && r.rowKey === input.rowKey);
      if (index > -1) surveyList.value[index] = { ...surveyList.value[index], ...input };
      unauthedSave();
    }
  };
  const deleteSurvey = async (input: DeleteSurveyInput) => {
    if (status.value === "authenticated") {
      await $client.surveyer.deleteSurvey.mutate(input);
      surveyList.value = surveyList.value.filter(
        (s) => !(s.partitionKey === session.value?.user.id && s.rowKey === input.rowKey),
      );
    } else if (status.value === "unauthenticated") {
      surveyList.value = surveyList.value.filter((s) => !(s.partitionKey === NIL && s.rowKey === input.rowKey));
      unauthedSave();
    }
  };
  // Survey argument is only used for autosaving from survey creator
  const unauthedSave = (survey?: SurveyEntity) => {
    if (survey) survey.modelVersion++;
    localStorage.setItem(SURVEYER_STORE, JSON.stringify(surveyList.value));
    return true;
  };

  const searchQuery = ref("");

  return {
    surveyList,
    pushSurveyList,
    surveyListNextCursor,
    updateSurveyListNextCursor,
    initialiseSurveyList,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    searchQuery,
    unauthedSave,
  };
});
