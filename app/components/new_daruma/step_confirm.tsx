// components/new_daruma/step_confirm.tsx
import { DarumaDisplay } from "@/components/daruma/daruma_display";
import { Text } from "@/components/typography";
import useTheme from "@/constants/theme";
import { createDaruma } from "@/domain/daruma_domain";
import { Daruma } from "@/types/daruma";
import { StepProps } from "@/types/step_props";
import { DEFAULT_DATE_FORMAT, formatDate } from "@/utils/date_formatter";
import { View } from "react-native";

export function StepConfirm({ draft }: StepProps) {

  const colors = useTheme().colors;
  const showDaruma: Daruma = draft.goal?.trim().length > 0
  ? createDaruma(draft)
  : {
      id: "preview",
      userId: "preview",
      goal: draft.goal ?? "",
      color: draft.color ?? "red",
      notes: draft.notes ?? "",
      deadline: draft.deadline,
      isCompleted: false,
      isFailed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      leftEyeDrawing: draft.leftEyeDrawing
    };

  return (
    <View style={{justifyContent: "center", alignItems: "center", gap: 20, backgroundColor: colors.background, flex: 1}}>
        <Text style={{ fontSize: 24, textAlign: "center", paddingBottom: 20}}>ready to start your journey?</Text>
        <DarumaDisplay daruma={showDaruma} />
        <Text style={{ color: colors.textSecondary, fontSize: 18, textAlign: "center", maxWidth: 280, paddingTop: 40 }}>
            your goal: "
            <Text style={{ color: colors.text, fontSize:20 }}>
                {showDaruma.goal}
            </Text>
            "
        </Text>
        {showDaruma.deadline && (
            <Text style={{ color: colors.textSecondary, fontSize: 18, textAlign: "center", maxWidth: 280 }}>
                your deadline:
                <Text style={{ color: colors.text, fontSize:20 }}> {formatDate(showDaruma.deadline, DEFAULT_DATE_FORMAT)}</Text>
            </Text>
        )}
    </View>
  );
}