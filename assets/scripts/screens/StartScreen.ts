import { _decorator, Component, UITransform, Graphics } from 'cc';
import { UiConfig } from '../config/Index';
import { GameManager } from '../managers/Index';
import { StartScreenRenderer } from '../renderers/Index';
const { ccclass } = _decorator;

/**
 * 开始界面
 * 显示游戏开始界面，处理开始按钮点击
 * 参考微信小游戏的背景设计
 */
@ccclass('StartScreen')
export class StartScreen extends Component {

    private gameManager: GameManager;
    private graphics: Graphics | null = null;

    onLoad() {
        this.initTransform();
        this.initGameManager();
        this.renderBackground();
    }

    /**
     * 初始化节点变换属性
     */
    private initTransform() {
        const transform = this.node.getComponent(UITransform);
        transform.setAnchorPoint(0, 0);
        transform.setContentSize(UiConfig.GAME_WIDTH, UiConfig.GAME_HEIGHT);
        this.node.setPosition(0, 0, 0);

        // 初始化 Graphics 组件用于绘制背景
        this.graphics = this.node.getComponent(Graphics);
        if (!this.graphics) {
            this.graphics = this.node.addComponent(Graphics);
        }
    }

    /**
     * 初始化游戏管理器
     */
    private initGameManager() {
        this.gameManager = GameManager.getInstance();
        // 确保游戏未开始
        this.gameManager.stopGame();
    }

    /**
     * 渲染背景
     * 使用渲染器处理绘制逻辑
     */
    private renderBackground() {
        if (!this.graphics) return;

        const transform = this.node.getComponent(UITransform);
        if (!transform) return;

        StartScreenRenderer.renderBackground(this.graphics, transform);
    }

    update(deltaTime: number) {
        // 更新逻辑可以在这里添加
    }

    /**
     * 开始按钮点击事件处理
     */
    onStartButtonClick() {
        // 开始游戏
        this.gameManager.startGame();
        // 隐藏开始界面
        this.hide();
    }

    /**
     * 显示开始界面
     */
    show() {
        this.node.active = true;
    }

    /**
     * 隐藏开始界面
     */
    hide() {
        this.node.active = false;
    }
}

