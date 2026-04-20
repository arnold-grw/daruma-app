import { View } from 'react-native';
import { Text } from '@/components/typography';
//import { PinchGestureHandler } from 'react-native-gesture-handler';
import BottomActionBar from '@/components/bottom_action_bar';
import { router } from 'expo-router';
import useTheme from "@/constants/theme";
import { useDarumaStore } from "@/store/daruma_store";
import { DarumaDetails } from '@/components/daruma_details';

export default function PaintStart() {

    const { draft, setDraft, commitDraft } = useDarumaStore()

    const handleConfirm = async () => {
    //return if nothing drawn
    await commitDraft();
    router.push('/');
  }
    
    return (
        <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center", overflow: 'hidden', backgroundColor: useTheme().colors.background }}>
            <Text style={{ fontSize: 24, marginTop: 50, textAlign: "center", paddingHorizontal: 20 }}>Paint the left eye to start your Journey</Text>

            <View style={{ position: 'absolute', top: '50%', transform: [{ translateX: -140 }, {translateY: -200 }], zIndex: -1 }}>
                <DarumaDetails color={draft.color} width={315*2.5} height={324*2.5} />
            </View>

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