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
    
    // UI 节点引用（自动查找子节点）
    private titleLabel: Label | null = null;
    private resumeButton: Button | null = null;
    private menuButton: Button | null = null;
    
    onLoad() {
        this.gameManager = GameManager.getInstance();
        this.initTransform();
        this.initGraphics();
        this.initComponents();
        this.styleUI();
        this.initButtonEvents();
        // 初始时隐藏
        this.node.active = false;
    }
    
    /**
     * 初始化节点变换属性
     */
    private initTransform() {
        const transform = this.node.getComponent(UITransform);
        if (!transform) {
            this.node.addComponent(UITransform);
        }
        
       
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
     * 初始化组件引用（自动查找子节点）
     */
    private initComponents() {
        // 自动查找子节点
        this.titleLabel = this.findComponent<Label>(this.node, 'TitleLabel', Label);
        this.resumeButton = this.findComponent<Button>(this.node, 'ResumeButton', Button);
        this.menuButton = this.findComponent<Button>(this.node, 'MenuButton', Button);
    }
    
    /**
     * 查找组件（辅助方法）
     */
    private findComponent<T>(parent: Node, name: string, componentType: typeof Component): T | null {
        const child = parent.getChildByName(name);
        if (child) {
            return child.getComponent(componentType) as T;
        }
        return null;
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
     * 初始化按钮事件
     */
    private initButtonEvents() {
        // 继续按钮
        if (this.resumeButton) {
            this.resumeButton.node.on(Button.EventType.CLICK, this.onResumeClick, this);
        }
        
        // 返回主菜单按钮
        if (this.menuButton) {
            this.menuButton.node.on(Button.EventType.CLICK, this.onMenuClick, this);
        }
    }
    
    /**
     * 继续按钮点击事件
     */
    private onResumeClick() {
        if (this.gameManager.isPaused()) {
            this.gameManager.resumeGame();
            this.hide();
        }
    }
    
    /**
     * 返回主菜单按钮点击事件
     */
    private onMenuClick() {
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
    
    onDestroy() {
        // 清理事件监听
        if (this.resumeButton) {
            this.resumeButton.node.off(Button.EventType.CLICK, this.onResumeClick, this);
        }
        
        if (this.menuButton) {
            this.menuButton.node.off(Button.EventType.CLICK, this.onMenuClick, this);
        }
    }
}
