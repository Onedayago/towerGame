import { _decorator, Component, UITransform, Graphics, Node, Button, EventTouch, Label, director } from 'cc';
import { UiConfig } from '../../config/Index';
import { GameManager } from '../../managers/Index';
import { StartScreenRenderer } from '../../renderers/Index';
const { ccclass } = _decorator;

/**
 * 开始界面
 * 显示游戏开始界面，处理开始按钮点击
 * 参考原游戏实现
 */
@ccclass('StartScreen')
export class StartScreen extends Component {

    private gameManager: GameManager;
    private graphics: Graphics | null = null;
    
    // 组件引用（从编辑器创建）
    private titleLabel: Label | null = null;
    private subtitleLabel: Label | null = null;
    private startButton: Button | null = null;
    private helpButton: Button | null = null;

    onLoad() {
        this.initTransform();
        this.initGameManager();
        this.initComponents();
        this.renderBackground();
        this.styleUIElements();
        this.initButtonEvents();
    }
    
    /**
     * 初始化组件引用
     * titleLabelNode 和 subtitleLabelNode 是 Label 类型
     * startButtonNode 和 helpButtonNode 是 Button 类型
     */
    private initComponents() {
        // 查找 Label 组件（通过子节点名称）
        const titleLabelNode = this.node.getChildByName('TitleLabel');
        if (titleLabelNode) {
            this.titleLabel = titleLabelNode.getComponent(Label);
        }
        
        const subtitleLabelNode = this.node.getChildByName('SubtitleLabel');
        if (subtitleLabelNode) {
            this.subtitleLabel = subtitleLabelNode.getComponent(Label);
        }
        
        // 查找 Button 组件（通过子节点名称）
        const startButtonNode = this.node.getChildByName('StartButton');
        if (startButtonNode) {
            this.startButton = startButtonNode.getComponent(Button);
        }
        
        const helpButtonNode = this.node.getChildByName('HelpButton');
        if (helpButtonNode) {
            this.helpButton = helpButtonNode.getComponent(Button);
        }
    }
    
    /**
     * 美化UI元素
     */
    private styleUIElements() {
        // 美化标题
        if (this.titleLabel) {
            StartScreenRenderer.styleTitleLabel(this.titleLabel);
        }
        
        // 美化副标题
        if (this.subtitleLabel) {
            StartScreenRenderer.styleSubtitleLabel(this.subtitleLabel);
        }
        
        // 美化开始按钮
        if (this.startButton) {
            StartScreenRenderer.styleStartButton(this.startButton);
        }
        
        // 美化帮助按钮（如果存在）
        if (this.helpButton) {
            StartScreenRenderer.styleHelpButton(this.helpButton);
        }
    }
    
    /**
     * 初始化按钮事件
     */
    private initButtonEvents() {
        // 开始按钮事件
        if (this.startButton) {
            this.startButton.node.on(Button.EventType.CLICK, this.onStartButtonClick, this);
        }
        
        // 帮助按钮事件（如果存在）
        if (this.helpButton) {
            this.helpButton.node.on(Button.EventType.CLICK, this.onHelpButtonClick, this);
        }
    }

    /**
     * 初始化节点变换属性
     * 锚点设置为 (0.5, 0.5) 中心点
     */
    private initTransform() {
        const transform = this.node.getComponent(UITransform);
        // 设置锚点为中心点 (0.5, 0.5)
        transform.setAnchorPoint(0.5, 0.5);
        transform.setContentSize(UiConfig.GAME_WIDTH, UiConfig.GAME_HEIGHT);
        // 锚点在中心，位置设置为 (0, 0, 0) 即可居中
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
        // 在开始界面时，确保游戏未开始（游戏场景加载后会自动开始）
        this.gameManager.stopGame();
    }

    /**
     * 渲染背景
     * 使用渲染器处理绘制逻辑（只绘制边框）
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
    onStartButtonClick(event?: EventTouch) {
        // 阻止事件冒泡
        if (event) {
            event.propagationStopped = true;
        }
        
        // 跳转到游戏场景
        director.loadScene('game');
    }
    
    /**
     * 帮助按钮点击事件处理（可选）
     */
    onHelpButtonClick(event?: EventTouch) {
        // 阻止事件冒泡
        if (event) {
            event.propagationStopped = true;
        }
        
        // TODO: 实现帮助界面显示逻辑
        console.log('Help button clicked');
    }
    
    /**
     * 组件销毁时清理事件监听
     */
    onDestroy() {
        // 清理开始按钮事件
        if (this.startButton && this.startButton.node && this.startButton.node.isValid) {
            this.startButton.node.off(Button.EventType.CLICK, this.onStartButtonClick, this);
        }
        
        // 清理帮助按钮事件
        if (this.helpButton && this.helpButton.node && this.helpButton.node.isValid) {
            this.helpButton.node.off(Button.EventType.CLICK, this.onHelpButtonClick, this);
        }
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

