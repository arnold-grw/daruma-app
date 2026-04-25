import { View } from 'react-native';
import { Text } from '@/components/typography';
//import { PinchGestureHandler } from 'react-native-gesture-handler';
import BottomActionBar from '@/components/bottom_action_bar';
import { router } from 'expo-router';
import useTheme from "@/constants/theme";
import { useDarumaStore } from "@/store/daruma_store";
import { DarumaDetails } from '@/components/daruma/daruma_details';
import { DrawingSpace } from '@/components/drawing/drawing_space';
import { useRef } from 'react';

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
            <Text style={{ fontSize: 24, marginTop: 50, textAlign: "center", paddingHorizontal: 20, backgroundColor: useTheme().colors.background, maxWidth:300, padding: 20, borderRadius: 10 }}>Paint the left eye to start your Journey</Text>
            <View style={{ zIndex: -1 }}>
              <View style={{ position: 'absolute', top: '50%', transform: [{ translateX: -691 }, {translateY: -435 }] }}>
                <DarumaDetails color={draft.color} width={315*4} height={324*4} />
              </View>
              <DrawingSpace ref={drawingSpaceRef} size={300} />
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