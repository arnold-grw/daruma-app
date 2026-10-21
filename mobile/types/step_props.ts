// types/step_props.ts
import { DarumaDraft } from "@/store/daruma_store";

export interface StepProps {
  draft: DarumaDraft;
  setDraft: (values: Partial<DarumaDraft>) => void;
  onValidChange: (valid: boolean) => void;
}