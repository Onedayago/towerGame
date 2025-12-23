import { _decorator, Component, Button, Label } from 'cc';
import { GameManager } from '../../managers/Index';
import { GameStateBtnRenderer } from '../../renderers/Index';
const { ccclass } = _decorator;

/**
 * 游戏状态按钮
 * 用于暂停和恢复游戏
 */
@ccclass('GameStateBtn')
export class GameStateBtn extends Component {
    private button: Button | null = null;
    private label: Label | null = null;
    private gameManager: GameManager;

    onLoad() {
        this.gameManager = GameManager.getInstance();
        this.initComponents();
        this.styleButton();
        this.initButtonEvents();
        this.updateButtonText();
    }

    /**
     * 初始化组件引用
     * 按钮节点应该是 Button 类型，可能包含 Label 子节点用于显示文本
     */
    private initComponents() {
        // 获取按钮组件（可能在当前节点上）
        this.button = this.node.getComponent(Button);
        
        // 如果没有，尝试从子节点获取
        if (!this.button) {
            const buttonNode = this.node.getChildByName('Button');
            if (buttonNode) {
                this.button = buttonNode.getComponent(Button);
            }
        }

        // 查找 Label 组件（可能在按钮节点上或子节点中）
        if (this.button && this.button.node) {
            this.label = this.button.node.getComponent(Label);
            
            // 如果没有，尝试从子节点获取
            if (!this.label) {
                const labelNode = this.button.node.getChildByName('Label');
                if (labelNode) {
                    this.label = labelNode.getComponent(Label);
                }
            }
        }
    }

    /**
     * 美化按钮和文字
     */
    private styleButton() {
        // 美化按钮样式
        GameStateBtnRenderer.styleButton(this.button);
        
        // 美化文字样式
        GameStateBtnRenderer.styleLabel(this.label);
    }

    /**
     * 初始化按钮事件
     */
    private initButtonEvents() {
        if (this.button) {
            this.button.node.on(Button.EventType.CLICK, this.onButtonClick, this);
        }
    }

    /**
     * 按钮点击事件处理
     */
    private onButtonClick() {
        if (this.gameManager.isPaused()) {
            // 如果已暂停，则恢复游戏
            this.gameManager.resumeGame();
        } else {
            // 如果未暂停，则暂停游戏
            this.gameManager.pauseGame();
        }
        
        // 更新按钮文本
        this.updateButtonText();
    }

    /**
     * 更新按钮文本
     * 根据游戏暂停状态显示"暂停"或"继续"
     */
    private updateButtonText() {
        if (this.label) {
            if (this.gameManager.isPaused()) {
                this.label.string = '继续';
            } else {
                this.label.string = '暂停';
            }
        }
    }

    onDestroy() {
        // 清理事件监听
        if (this.button && this.button.node) {
            this.button.node.off(Button.EventType.CLICK, this.onButtonClick, this);
        }
    }
}

