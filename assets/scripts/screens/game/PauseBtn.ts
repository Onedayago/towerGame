import { _decorator, Component, Button, Label } from 'cc';
import { GameManager, AudioManager } from '../../managers/Index';
import { GameStateBtnRenderer } from '../../renderers/Index';
import { PauseView } from './components/Index';
const { ccclass, property } = _decorator;

/**
 * 暂停按钮组件
 * 用于暂停和恢复游戏
 */
@ccclass('PauseBtn')
export class PauseBtn extends Component {
    private gameManager: GameManager;
    private buttonEnabled: boolean = true; // 是否启用按钮
    
    // 组件引用（通过编辑器绑定）
    @property({ type: Button, displayName: '按钮组件' })
    private button: Button | null = null;
    
    @property({ type: Label, displayName: '文字标签' })
    private label: Label | null = null;
    
    @property({ type: PauseView, displayName: '暂停界面组件' })
    private pauseView: PauseView | null = null;

    onLoad() {
        this.gameManager = GameManager.getInstance();
        this.styleButton();
        this.updateButtonText();
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
     * 按钮点击事件处理（通过编辑器绑定）
     */
    public onButtonClick() {
        if (!this.buttonEnabled) return;
        
        const audioManager = AudioManager.getInstance();
        
        if (this.gameManager.isPaused()) {
            // 如果已暂停，则恢复游戏
            this.gameManager.resumeGame();
            // 恢复背景音乐
            audioManager.resumeBackgroundMusic();
            // 隐藏暂停界面
            if (this.pauseView) {
                this.pauseView.hide();
            }
        } else {
            // 如果未暂停，则暂停游戏
            this.gameManager.pauseGame();
            // 暂停背景音乐
            audioManager.pauseBackgroundMusic();
            // 显示暂停界面
            if (this.pauseView) {
                this.pauseView.show();
            }
        }
        
        // 更新按钮文本
        this.updateButtonText();
    }
    
    /**
     * 设置是否启用按钮
     * @param enabled 是否启用
     */
    setEnabled(enabled: boolean) {
        this.buttonEnabled = enabled;
        if (this.button) {
            this.button.interactable = enabled;
        }
    }

    /**
     * 更新按钮文本
     * 根据游戏暂停状态显示"暂停"或"继续"
     */
    public updateButtonText() {
        if (this.label) {
            if (this.gameManager.isPaused()) {
                this.label.string = '继续';
            } else {
                this.label.string = '暂停';
            }
        }
    }

}

