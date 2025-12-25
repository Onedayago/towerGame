import { _decorator, Component, Button, EventTouch, Label, director } from 'cc';
import { GameManager } from '../../managers/Index';
import { StartScreenRenderer } from '../../renderers/Index';
const { ccclass, property } = _decorator;

/**
 * 开始界面
 * 显示游戏开始界面，处理开始按钮点击
 * 参考原游戏实现
 */
@ccclass('StartScreen')
export class StartScreen extends Component {

    private gameManager: GameManager;
    
    // 组件引用（通过编辑器绑定）
    @property({ type: Label, displayName: '标题标签' })
    private titleLabel: Label | null = null;
    
    @property({ type: Label, displayName: '副标题标签' })
    private subtitleLabel: Label | null = null;
    
    @property({ type: Button, displayName: '开始按钮' })
    private startButton: Button | null = null;
    
    @property({ type: Button, displayName: '帮助按钮' })
    private helpButton: Button | null = null;

    onLoad() {
        this.initGameManager();
        this.styleUIElements();
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
     * 初始化游戏管理器
     */
    private initGameManager() {
        this.gameManager = GameManager.getInstance();
        // 在开始界面时，确保游戏未开始（游戏场景加载后会自动开始）
        this.gameManager.stopGame();
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

