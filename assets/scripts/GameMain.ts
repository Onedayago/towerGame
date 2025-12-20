import { _decorator, Component, Graphics, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import { UiConfig } from './config/Index';

@ccclass('gameMain')
export class gameMain extends Component {

    @property(Node)
    childNode: Node | null = null; // 在编辑器中拖拽子节点到这里

    start() {
        const graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        transform.setContentSize(UiConfig.GAME_WIDTH, UiConfig.GAME_HEIGHT);
        transform.setAnchorPoint(0, 0);
        this.node.setPosition(-UiConfig.GAME_WIDTH/2, -UiConfig.GAME_HEIGHT/2, 0);
    }

    update(deltaTime: number) {
        
    }
}

