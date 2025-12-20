import { _decorator, Component, Graphics, Node, Color, UITransform } from 'cc';
import { UiConfig } from '../config/Index';
const { ccclass, property } = _decorator;

@ccclass('StartScreen')
export class StartScreen extends Component {

    private graphics: Graphics | null = null;

    onLoad() {
        this.graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        transform.setAnchorPoint(0, 0);
        transform.setContentSize(UiConfig.GAME_WIDTH, UiConfig.GAME_HEIGHT);
        this.node.setPosition(0, 0, 0);
        
    }

    start() {
        // this.hide();
        this.graphics.fillColor = Color.RED;
        this.graphics.rect(0, 0, UiConfig.GAME_WIDTH, UiConfig.GAME_HEIGHT);
        this.graphics.fill();
        
    }

    update(deltaTime: number) {
        
    }

    onStartButtonClick() {
        console.log('onStartButtonClick');
        this.hide();
    }

    show() {
        this.node.active = true;
    }

    hide() {
        this.node.active = false;
    }
}

