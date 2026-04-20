import { View } from "react-native";

interface DrawingSpaceProps {
  leftEye: boolean;
}

export function DrawingSpace({ leftEye }: DrawingSpaceProps) {
    var zoomFactor = 1.0;

    

  return (
    <View>
        <View style={{}}>
            //canvas here
        </View>
    </View>
  );
}