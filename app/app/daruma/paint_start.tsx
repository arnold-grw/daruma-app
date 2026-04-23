import { View } from 'react-native';
import { Text } from '@/components/typography';
//import { PinchGestureHandler } from 'react-native-gesture-handler';
import BottomActionBar from '@/components/bottom_action_bar';
import { router } from 'expo-router';
import useTheme from "@/constants/theme";
import { useDarumaStore } from "@/store/daruma_store";
import { DarumaDetails } from '@/components/daruma_details';
import { DrawingSpace } from '@/components/drawing/drawing_space';
import { useRef } from 'react';

import { TEST_DARUMA } from '@/constants/test_data';
import { Daruma } from '@/types/daruma';

export default function PaintStart() {

    const { draft, setDraft, commitDraft } = useDarumaStore()
    const drawingSpaceRef = useRef<any>(null);

    const handleConfirm = async () => {
      // Get the drawing data from DrawingSpace
      if (drawingSpaceRef.current) {
        const drawingData = drawingSpaceRef.current.getDrawingData();
        if (drawingData) {
          setDraft({ leftEyeDrawing: drawingData });
        }
      }

      await commitDraft();
      router.push('/');
    }


    
    return (
        <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center", overflow: 'hidden', backgroundColor: useTheme().colors.background }}>
            <Text style={{ fontSize: 24, marginTop: 50, textAlign: "center", paddingHorizontal: 20 }}>Paint the left eye to start your Journey</Text>

            <View style={{ position: 'absolute', top: '50%', transform: [{ translateX: -220 }, {translateY: -332 }], zIndex: -1 }}>
                <DarumaDetails color={draft.color} width={315*3.5} height={324*3.5} />
            </View>
            <DrawingSpace ref={drawingSpaceRef} size={300} />

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