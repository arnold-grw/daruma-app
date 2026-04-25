import { View } from 'react-native';
import { Text } from '@/components/typography';
import BottomActionBar from '@/components/bottom_action_bar';
import { router, useLocalSearchParams } from 'expo-router';
import useTheme from "@/constants/theme";
import { useDarumaStore } from "@/store/daruma_store";
import { useRef } from 'react';
import { DarumaDetails } from '@/components/daruma_details';
import { DrawingSpace } from '@/components/drawing/drawing_space';

export default function PaintFinish() {

    const { darumaId } = useLocalSearchParams();
    const { complete, updateNotes, delete: deleteDaruma } = useDarumaStore()
    const daruma = useDarumaStore(state => state.darumas.find(d => d.id === darumaId));

    const drawingSpaceRef = useRef<any>(null);

    async function handleComplete() {
        if (!daruma || !darumaId) return;
        // Get the drawing data from DrawingSpace
        if (drawingSpaceRef.current) {
            const drawingData = drawingSpaceRef.current.getDrawingData();
            if (drawingData) {
                //set the darumas rightEyeDrawing
                await complete(darumaId as string, drawingData);
                router.push('/');
            }
        }
        //failed
    }
    
    return (
        <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center", overflow: 'hidden', backgroundColor: useTheme().colors.background }}>
            <Text style={{ fontSize: 24, marginTop: 50, textAlign: "center", paddingHorizontal: 20, backgroundColor: useTheme().colors.background, maxWidth:300, padding: 20, borderRadius: 10 }}>Paint the second eye to complete your goal</Text>

            <View style={{ zIndex: -1 }}>
              <View style={{ position: 'absolute', top: '50%', transform: [{ translateX: -270 }, {translateY: -435 }] }}>
                <DarumaDetails color={daruma?.color || "red"} width={315*4} height={324*4} />
              </View>
              <DrawingSpace ref={drawingSpaceRef} size={300} />
            </View>

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