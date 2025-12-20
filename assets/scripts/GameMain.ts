import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { StartScreen } from './screens/StartScreen';

@ccclass('gameMain')
export class gameMain extends Component {

    @property(Node)
    childNode: Node | null = null; // 在编辑器中拖拽子节点到这里

    start() {
        
    }

    update(deltaTime: number) {
        // const startScreen = this.node.getComponent(StartScreen);
        // console.log(startScreen);
        // startScreen.show();
    }
}

