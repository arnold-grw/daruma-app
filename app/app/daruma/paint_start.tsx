import { View } from 'react-native';
import { Text } from '@/components/typography';
import BottomActionBar from '@/components/bottom_action_bar';
import { router } from 'expo-router';
import useTheme from "@/constants/theme";
import { useDarumaStore } from "@/store/daruma_store";

export default function PaintStart() {

    const { draft, setDraft, commitDraft } = useDarumaStore()

    const handleConfirm = async () => {
    //return if nothing drawn
    await commitDraft();
    router.push('/');
  }
    
    return (
        <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center", backgroundColor: useTheme().colors.background }}>
            <Text style={{ fontSize: 24, marginTop: 50, textAlign: "center", paddingHorizontal: 20 }}>Paint the left eye to start your Journey</Text>

            <BottomActionBar
                onConfirm={() => {
                handleConfirm();
                }}
                confirmLabel="Confirm"
                cancelLabel="Return"
                ></BottomActionBar>
        </View>
  );
}