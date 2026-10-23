import Daruma3D, { VIEW_HEIGHT_RATIO } from '@/components/3d/daruma_model';
import BottomActionBar from '@/components/action_bar';
import { DarumaDetails } from '@/components/daruma/daruma_details';
import { DarumaDisplay } from '@/components/daruma/daruma_display';
import { drawingLayout, DrawingSpace } from '@/components/drawing/drawing_space';
import { PaintTitle, usePaintLayout } from '@/components/drawing/paint_title';
import { Text } from '@/components/typography';
import { ANIMATION_DURATION } from '@/constants/animations';
import useTheme from "@/constants/theme";
import { useDarumaStore } from "@/store/daruma_store";
import { NAVIGATION } from '@/constants/navigation';
import { useSwipeBack, useSystemBack } from '@/utils/navigation';
import { Drawing, DrawingData } from '@/types/drawing';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useTranslation } from "react-i18next";
import Animated, { FadeInLeft, FadeInRight, FadeOutLeft, FadeOutRight, LayoutAnimationConfig } from 'react-native-reanimated';

// size of the drawing area (the eye)
const DRAWING_SIZE = 300;
// from this screen width (px) the first eye is on screen next to the canvas and gets drawn
const SHOW_FIRST_EYE_WIDTH = 600;
// Height kept free for the title above and the space below the 3D daruma on the confirm step
const TEXT_SPACE = 200;
// Largest daruma height on the confirm step, relative to the screen width and absolute
const MAX_SIZE_RATIO = 0.9;
const MAX_SIZE = 400;

// Same step change as in new.tsx: forward moves the content to the left, back to the right
const STEP_ANIMATIONS = {
    forward: {
        entering: FadeInRight.duration(ANIMATION_DURATION.stepChange),
        exiting: FadeOutLeft.duration(ANIMATION_DURATION.stepChange),
    },
    back: {
        entering: FadeInLeft.duration(ANIMATION_DURATION.stepChange),
        exiting: FadeOutRight.duration(ANIMATION_DURATION.stepChange),
    },
};

// Two steps: paint the second eye, then look at the finished daruma in 3D and confirm it
export default function PaintFinish() {

    const { darumaId } = useLocalSearchParams();
    const { complete } = useDarumaStore()
    const daruma = useDarumaStore(state => state.darumas.find(d => d.id === darumaId));

    const drawingSpaceRef = useRef<any>(null);
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { width: windowWidth } = useWindowDimensions();
    // on narrow screens the canvas moves left to make room for the toolbar
    const { canvasShift } = drawingLayout(windowWidth, DRAWING_SIZE);

    const [step, setStep] = useState<'paint' | 'confirm'>('paint');
    const [direction, setDirection] = useState<'forward' | 'back'>('forward');
    // the painted eye, kept while switching steps so the canvas shows it again when going back
    const [rightEye, setRightEye] = useState<DrawingData | undefined>(undefined);
    // something is painted on the canvas, so "next" is possible
    const [hasDrawing, setHasDrawing] = useState(false);
    const [areaHeight, setAreaHeight] = useState(0);
    const [paintAreaHeight, setPaintAreaHeight] = useState(0);
    // title above the canvas; on short screens the canvas moves down to make room for it
    const paintLayout = usePaintLayout(paintAreaHeight, DRAWING_SIZE);

    // the 3D daruma shrinks on short screens so the title still fits
    const fitsWidth = Math.min(windowWidth * MAX_SIZE_RATIO, MAX_SIZE);
    const fitsHeight = areaHeight > 0 ? (areaHeight - TEXT_SPACE) / VIEW_HEIGHT_RATIO : fitsWidth;
    const darumaSize = Math.max(0, Math.min(fitsWidth, fitsHeight));

    // The old step plays the exit animation it had in its last render, so the direction
    // is set first and the step changes one frame later (same as in new.tsx)
    const changeStep = (newStep: 'paint' | 'confirm') => {
        setDirection(newStep === 'confirm' ? 'forward' : 'back');
        requestAnimationFrame(() => setStep(newStep));
    };

    // no swipe back while painting (iOS); the Android system back goes from the confirm step back to painting
    useSwipeBack(NAVIGATION.swipeBackWhilePainting);
    useSystemBack(() => {
        if (step !== 'confirm') return false;
        changeStep('paint');
        return true;
    });

    function handleToConfirm() {
        const drawingData = drawingSpaceRef.current?.getDrawingData();
        if (!drawingData) return;
        setRightEye(drawingData);
        changeStep('confirm');
    }

    async function handleComplete() {
        if (!daruma || !darumaId || !rightEye) return;
        //set the darumas rightEyeDrawing
        await complete(darumaId as string, rightEye);
        //push archive with the id: archive fires the confetti and slides the card in
        router.push({
            pathname: '/archive',
            params: { completedDarumaId: darumaId as string }
        });
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <LayoutAnimationConfig skipEntering>
                <Animated.View
                    key={step}
                    style={{ flex: 1 }}
                    entering={STEP_ANIMATIONS[direction].entering}
                    exiting={STEP_ANIMATIONS[direction].exiting}
                >
                    {step === 'paint' ? (
                        <View
                            style={{ flex: 1, justifyContent: "center", alignItems: "center", overflow: 'hidden' }}
                            onLayout={(e) => setPaintAreaHeight(e.nativeEvent.layout.height)}
                        >
                            {/* the drawing area is centered, the title sits in the middle of the space above it */}
                            <PaintTitle text={t("finish.title")} layout={paintLayout} shadowOpacity={0.25} />

                            <View style={{ zIndex: -1, transform: [{ translateX: canvasShift }, { translateY: paintLayout.canvasOffsetY }] }}>
                              <View style={{ position: 'absolute', top: '50%', transform: [{ translateX: -270 }, {translateY: -435 }] }}>
                                {/* on wide screens the first eye is visible next to the canvas, so it is shown painted */}
                                {daruma && windowWidth >= SHOW_FIRST_EYE_WIDTH ? (
                                  <DarumaDisplay daruma={daruma} width={315*4} height={324*4} />
                                ) : (
                                  <DarumaDetails color={daruma?.color || "red"} width={315*4} height={324*4} />
                                )}
                              </View>
                              <DrawingSpace
                                ref={drawingSpaceRef}
                                size={DRAWING_SIZE}
                                initialDrawing={rightEye}
                                onDrawingChange={(drawing: Drawing) => setHasDrawing(drawing.lines.length > 0)}
                              />
                            </View>
                        </View>
                    ) : (
                        // the finished daruma with both eyes, in 3D: drag to turn, tap to wobble
                        <View
                            style={{ flex: 1, alignItems: "center", justifyContent: "center"}}
                            onLayout={(e) => setAreaHeight(e.nativeEvent.layout.height)}
                        >
                            <View>
                                <Text style={{ fontSize: 24, textAlign: "center", paddingHorizontal: 20, minHeight:100 }}>{t("finish.confirm_title")}</Text>
                            </View>
                            <Daruma3D
                                color={daruma?.color || "red"}
                                leftEye={daruma?.leftEyeDrawing}
                                rightEye={rightEye}
                                size={darumaSize}
                            />
                            
                        </View>
                    )}
                </Animated.View>
            </LayoutAnimationConfig>

            {step === 'paint' ? (
                <BottomActionBar
                    onConfirm={handleToConfirm}
                    canConfirm={hasDrawing}
                    confirmLabel={t("common.next")}
                    cancelLabel={t("common.return")}
                />
            ) : (
                <BottomActionBar
                    onConfirm={handleComplete}
                    onCancel={() => changeStep('paint')}
                    confirmLabel={t("common.finish")}
                    cancelLabel={t("common.back")}
                />
            )}
        </View>
  );
}
