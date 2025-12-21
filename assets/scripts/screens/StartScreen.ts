import { _decorator, Component, Graphics, Node, Color, UITransform } from 'cc';
import { UiConfig } from '../config/Index';
import { GameManager } from '../managers/Index';
const { ccclass, property } = _decorator;

@ccclass('StartScreen')
export class StartScreen extends Component {

    private graphics: Graphics | null = null;
    private gameManager: GameManager;

    onLoad() {
        this.graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        transform.setAnchorPoint(0, 0);
        transform.setContentSize(UiConfig.GAME_WIDTH, UiConfig.GAME_HEIGHT);
        this.node.setPosition(0, 0, 0);
        
        this.gameManager = GameManager.getInstance();
        
        // 确保游戏未开始
        this.gameManager.stopGame();
    }

    start() {
        
    }

    update(deltaTime: number) {
        
    }

    onStartButtonClick() {
        console.log('onStartButtonClick');
        // 开始游戏
        this.gameManager.startGame();
        // 隐藏开始界面
        this.hide();
    }

    show() {
        this.node.active = true;
    }

    hide() {
        this.node.active = false;
    }
}

