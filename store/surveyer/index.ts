import type { Survey } from "@/models/surveyer/Survey";
import type { SurveyerConfiguration } from "@/models/surveyer/SurveyerConfiguration";
import { SURVEYER_STORE } from "@/services/surveyer/constants";

export const useSurveyerStore = defineStore("surveyer", () => {
  const { status } = useAuth();
  const surveyerConfiguration = ref<SurveyerConfiguration | null>(null);

  const createSurvey = (newSurvey: Survey) => {
    if (!surveyerConfiguration.value) return;

    surveyerConfiguration.value.push(newSurvey);
    save();
  };
  const updateSurvey = (updatedSurvey: Survey) => {
    if (!surveyerConfiguration.value) return;

    const index = surveyerConfiguration.value.findIndex((r) => r.id === updatedSurvey.id);
    if (index > -1) surveyerConfiguration.value[index] = { ...surveyerConfiguration.value[index], ...updatedSurvey };
    save();
  };
  const deleteSurvey = (id: string) => {
    if (!surveyerConfiguration.value) return;

    surveyerConfiguration.value = surveyerConfiguration.value.filter((s) => s.id !== id);
    save();
  };

  const searchQuery = ref("");

  const save = () => {
    if (!surveyerConfiguration.value) return;

    // @NOTE: Implement saving data from blob when user is authed
    if (status.value === "authenticated") return;

    localStorage.setItem(SURVEYER_STORE, JSON.stringify(surveyerConfiguration.value));
  };

  return {
    surveyerConfiguration,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    searchQuery,
    save,
  };
});
