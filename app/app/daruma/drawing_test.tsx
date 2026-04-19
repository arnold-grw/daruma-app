import { View, ScrollView } from "react-native";
import { Text } from '@/components/typography';
import { Point, Line, Drawing } from '@/types/drawing';
import Svg, { Polyline } from 'react-native-svg';
import { DrawingRenderer } from "@/components/drawing/drawing_renderer";
import { TEST_DARUMA } from "@/constants/test_data";
import { Daruma } from "@/types/daruma";

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


  return (
    <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: 'white', flex: 1 }}>
        <Text style={{ color: 'black', fontSize: 24 }}>Drawing Test</Text>
        
        {testDaruma.leftEyeDrawing && (
            <DrawingRenderer drawingData={testDaruma.leftEyeDrawing} width={100} height={100} />
        )}
    </View>
  );
}