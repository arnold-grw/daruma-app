import BottomActionBar from '@/components/bottom_action_bar';
import { DarumaDetails } from '@/components/daruma/daruma_details';
import { DrawingSpace } from '@/components/drawing/drawing_space';
import { Text } from '@/components/typography';
import useTheme from "@/constants/theme";
import { useDarumaStore } from "@/store/daruma_store";
import { router, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { View } from 'react-native';

export default function PaintFinish() {

    const { darumaId } = useLocalSearchParams();
    const { complete, updateNotes, delete: deleteDaruma } = useDarumaStore()
    const daruma = useDarumaStore(state => state.darumas.find(d => d.id === darumaId));

    const drawingSpaceRef = useRef<any>(null);
    const { colors, shadows } = useTheme();

    async function handleComplete() {
        if (!daruma || !darumaId) return;
        // Get the drawing data from DrawingSpace
        if (drawingSpaceRef.current) {
            const drawingData = drawingSpaceRef.current.getDrawingData();
            if (drawingData) {
                //set the darumas rightEyeDrawing
                await complete(darumaId as string, drawingData);
                //push archive with celebrate param to trigger confetti animation
                router.push({
                    pathname: '/archive',
                    params: { celebrate: 'true' }
                });
            }
        }
        //failed
    }
    
    return (
        <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center", overflow: 'hidden', backgroundColor: colors.background }}>
            <Text style={{ fontSize: 24, marginTop: 50, textAlign: "center", paddingHorizontal: 20, backgroundColor: colors.background, maxWidth:300, padding: 20, borderRadius: 10,
                shadowColor: shadows.color, shadowOffset: { width: shadows.x_offset, height: shadows.y_offset }, shadowOpacity: 0.25, shadowRadius: shadows.radius, elevation: shadows.elevation
             }}>Paint the second eye to complete your goal</Text>

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