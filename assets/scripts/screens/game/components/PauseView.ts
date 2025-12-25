import { _decorator, Component, Graphics, UITransform, Label, Button, Node } from 'cc';
import { GameManager } from '../../../managers/Index';
import { PauseViewRenderer } from '../../../renderers/Index';
const { ccclass, property } = _decorator;

/**
 * 暂停界面组件
 * 显示游戏暂停时的界面
 * 参考原游戏：半透明遮罩 + 标题 + 按钮
 */
@ccclass('PauseView')
export class PauseView extends Component {
    private graphics: Graphics | null = null;
    private gameManager: GameManager;
    
    // 组件引用（通过编辑器绑定）
    @property({ type: Label, displayName: '标题标签' })
    private titleLabel: Label | null = null;
    
    @property({ type: Button, displayName: '继续按钮' })
    private resumeButton: Button | null = null;
    
    @property({ type: Button, displayName: '返回主菜单按钮' })
    private menuButton: Button | null = null;
    
    onLoad() {
        this.gameManager = GameManager.getInstance();
        this.initGraphics();
        this.styleUI();
        // 初始时隐藏
        this.node.active = false;
    }
    
    /**
     * 初始化 Graphics 组件
     */
    private initGraphics() {
        this.graphics = this.node.getComponent(Graphics);
        if (!this.graphics) {
            this.graphics = this.node.addComponent(Graphics);
        }
    }
    
    /**
     * 美化 UI 元素
     */
    private styleUI() {
        // 美化标题（会自动设置文字内容）
        PauseViewRenderer.styleTitleLabel(this.titleLabel);
        
        // 美化继续按钮（会自动设置文字内容）
        PauseViewRenderer.styleResumeButton(this.resumeButton);
        
        // 美化返回主菜单按钮（如果存在，会自动设置文字内容）
        if (this.menuButton) {
            PauseViewRenderer.styleMenuButton(this.menuButton);
        }
    }
    
    /**
     * 继续按钮点击事件（通过编辑器绑定）
     */
    public onResumeClick() {
        if (this.gameManager.isPaused()) {
            this.gameManager.resumeGame();
            this.hide();
            // 更新暂停按钮的文字（使用时动态查找）
            this.updatePauseButtonText();
        }
    }
    
    /**
     * 更新暂停按钮的文字
     */
    private updatePauseButtonText() {
        const scene = this.node.scene;
        if (!scene) return;
        
        // 查找 PauseBtn 组件
        const pauseBtnNode = this.findNodeWithComponent(scene, 'PauseBtn');
        if (pauseBtnNode) {
            const pauseBtn = pauseBtnNode.getComponent('PauseBtn' as any) as any;
            if (pauseBtn && typeof pauseBtn.updateButtonText === 'function') {
                pauseBtn.updateButtonText();
            }
        }
    }
    
    /**
     * 递归查找包含指定组件的节点
     */
    private findNodeWithComponent(node: Node, componentName: string): Node | null {
        if (node.getComponent(componentName as any)) {
            return node;
        }
        for (let child of node.children) {
            const result = this.findNodeWithComponent(child, componentName);
            if (result) {
                return result;
            }
        }
        return null;
    }
    
    /**
     * 返回主菜单按钮点击事件（通过编辑器绑定）
     */
    public onMenuClick() {
        // TODO: 实现返回主菜单的逻辑
        console.log('返回主菜单');
    }
    
    /**
     * 显示暂停界面
     */
    show() {
        this.node.active = true;
        if (this.graphics) {
            const transform = this.node.getComponent(UITransform);
            if (transform) {
                // 绘制背景
                PauseViewRenderer.renderBackground(this.graphics, transform);
            }
        }
    }
    
    /**
     * 隐藏暂停界面
     */
    hide() {
        this.node.active = false;
    }
}
