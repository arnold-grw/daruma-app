import {Daruma} from "../types/daruma";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";
import { DrawingData } from "@/types/drawing";

export const TEST_DARUMAS: Daruma[] = [
    {
        id: uuidv4(),
        userId: 'test-user',
        goal: 'reach gym goal',
        notes: '150g protein, 3000kcal per day',
        color: 'red',
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        userId: 'test-user',
        goal: 'pass math exam',
        notes: 'study 2h every day, do practice exams',
        color: 'blue',
        isCompleted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
]

export const TEST_DARUMA: Daruma = 
    {
        id: uuidv4(),
        userId: 'test-user',
        goal: 'test drawing',
        notes: '-',
        color: 'blue',
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        leftEyeDrawing: {
            lines: [
                {
                    points: [{ x: -0.0, y: -0.0 }, { x: 0.0, y: 0.0 }],
                    width: 1.5
                }
            ]
        },
        rightEyeDrawing: {
            lines: [
                {
                    points: [{ x: -0.0, y: -0.0 }, { x: 0.0, y: 0.0 }],
                    width: 1.5
                }
            ]
        }
    };