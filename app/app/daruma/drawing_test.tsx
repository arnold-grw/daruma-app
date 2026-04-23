import { View, ScrollView } from "react-native";
import { Text } from '@/components/typography';
import { Point, Line, Drawing, DrawingSettings } from '@/types/drawing';
import Svg, { Polyline } from 'react-native-svg';
import { DrawingRenderer } from "@/components/drawing/drawing_renderer";
import { TEST_DARUMA } from "@/constants/test_data";
import { Daruma } from "@/types/daruma";
import { DrawingSpace } from "@/components/drawing/drawing_space";
import { useState } from "react";

export default function DrawingTest() {

    const points = [
        { x: -1.0, y: -1.0 },
        { x: 1.0, y: 1.0 },
    ];
    const points2 = [
        { x: -1.0, y: 1.0 },
        { x: 1.0, y: -1.0 },
    ];
    const testline = new Line(points.map(p => new Point(p.x, p.y)), 0.0);
    const testline2 = new Line(points2.map(p => new Point(p.x, p.y)), 1.0);
    const testDrawing = new Drawing([testline, testline2]);

    const testDaruma: Daruma = TEST_DARUMA

    const [settings, setSettings] = useState<DrawingSettings>({ thickness: 0.25 });


  return (
    <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: 'white', flex: 1 }}>
        <Text style={{ color: 'black', fontSize: 24 }}>Drawing Test</Text>
        <DrawingSpace></DrawingSpace>
    </View>
  );
}