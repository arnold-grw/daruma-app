import { View } from 'react-native';
import { Text } from '@/components/typography';
import BottomActionBar from '@/components/bottom_action_bar';
import { router, useLocalSearchParams } from 'expo-router';
import useTheme from "@/constants/theme";
import { useDarumaStore } from "@/store/daruma_store";

export default function PaintFinish() {

    const { darumaId } = useLocalSearchParams();
    const { complete, updateNotes, delete: deleteDaruma } = useDarumaStore()
    const daruma = useDarumaStore(state => state.darumas.find(d => d.id === darumaId));

    async function handleComplete() {
        if (!daruma || !darumaId) return;
        await complete(darumaId as string);
        router.push('/');
    }
    
    return (
        <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 24, marginTop: 50, textAlign: "center", paddingHorizontal: 20 }}>Paint the second eye to complete your goal</Text>

            <BottomActionBar
                onConfirm={() => {
                handleComplete();
                }}
                confirmLabel="Finish"
                cancelLabel="Return"
                ></BottomActionBar>
        </View>
  );
}