import { _decorator, Component, Node, Label, UITransform, Button, Graphics, Color } from 'cc';
import { WeaponManager } from '../../managers/Index';
import { WarView } from './components/Index';
import { GuideStepManager } from './guide/GuideStepManager';
import { GuideButtonRenderer, GuideLabelRenderer } from '../../renderers/Index';
import { UiConfig } from '../../config/Index';
import { UiColors } from '../../constants/Index';
const { ccclass, property } = _decorator;

/**
 * 游戏操作引导组件
 * 引导玩家完成游戏基本操作
 */
@ccclass('Guide')
export class Guide extends Component {
    
    // 组件引用（通过编辑器绑定）
    @property({ type: Label, displayName: '引导文字标签' })
    private guideLabel: Label | null = null;
    
    @property({ type: Button, displayName: '下一步按钮' })
    private nextButton: Button | null = null;
    
    @property({ type: Button, displayName: '跳过按钮' })
    private skipButton: Button | null = null;
    
    @property({ type: WarView, displayName: '战场视图组件' })
    private warView: WarView | null = null;
    
    @property({ type: Node, displayName: '小地图节点' })
    private miniMapNode: Node | null = null;
    
    @property({ type: Node, displayName: '金币视图节点' })
    private goldViewNode: Node | null = null;
    
    @property({ type: Node, displayName: '波次视图节点' })
    private waveViewNode: Node | null = null;
    
    @property({ type: Node, displayName: '暂停按钮节点' })
    private pauseButtonNode: Node | null = null;
    
    private weaponManager: WeaponManager | null = null;
    private stepManager: GuideStepManager | null = null;
    private backgroundGraphics: Graphics | null = null;
    private backgroundNode: Node | null = null;
    
    @property({ displayName: '是否自动开始引导', tooltip: '游戏开始后是否自动显示引导' })
    public autoStart: boolean = true;
    
    onLoad() {
        this.initTransform();
        this.initBackground();
        this.initComponents();
    }
    
    /**
     * 初始化半透明背景
     */
    private initBackground() {
        // 创建背景节点
        this.backgroundNode = new Node('GuideBackground');
        this.backgroundNode.setParent(this.node);
        
        // 将背景节点放在最下层（索引 0）
        this.backgroundNode.setSiblingIndex(0);
        
        const transform = this.backgroundNode.addComponent(UITransform);
        transform.setAnchorPoint(0, 0);
        transform.setContentSize(UiConfig.GAME_WIDTH, UiConfig.GAME_HEIGHT);
        this.backgroundNode.setPosition(0, 0, 0);
        
        // 添加 Graphics 组件用于绘制背景
        this.backgroundGraphics = this.backgroundNode.addComponent(Graphics);
        
        // 绘制半透明背景
        this.renderBackground();
    }
    
    /**
     * 绘制半透明背景（参考暂停界面）
     */
    private renderBackground() {
        if (!this.backgroundGraphics) return;
        
        const width = UiConfig.GAME_WIDTH;
        const height = UiConfig.GAME_HEIGHT;
        const x = 0;
        const y = 0;
        
        this.backgroundGraphics.clear();
        
        // 绘制半透明深色渐变遮罩（参考暂停界面）
        const darkPurpleBg = { r: 15, g: 10, b: 30, a: 0.75 }; // 半透明深蓝紫色
        const darkBg = { r: 5, g: 5, b: 15, a: 0.75 }; // 半透明深色
        
        // 绘制渐变背景（从上到下）
        const steps = 30;
        for (let i = 0; i < steps; i++) {
            const ratio = i / (steps - 1);
            const color = UiColors.createGradientColor(darkPurpleBg, darkBg, ratio);
            
            const stepHeight = height / steps;
            this.backgroundGraphics.fillColor = color;
            this.backgroundGraphics.rect(x, y + i * stepHeight, width, stepHeight + 1);
            this.backgroundGraphics.fill();
        }
    }
    
    
    /**
     * 初始化节点变换属性
     */
    private initTransform() {
        const transform = this.node.getComponent(UITransform);
        if (transform) {
            transform.setAnchorPoint(0, 0);
        }
    }
    
    start() {
        // 延迟一小段时间后开始引导，确保场景完全加载
        this.scheduleOnce(() => {
            if (this.autoStart) {
                this.startGuide();
            }
        }, 0.5);
    }
    
    /**
     * 初始化组件
     */
    private initComponents() {
        // 美化引导文字
        if (this.guideLabel) {
            GuideLabelRenderer.styleLabel(this.guideLabel);
        }
        
        // 初始化下一步按钮
        if (this.nextButton) {
            this.nextButton.node.on(Button.EventType.CLICK, this.onNextButtonClick, this);
            // 美化下一步按钮
            GuideButtonRenderer.styleNextButton(this.nextButton);
            // 美化按钮文字
            const nextLabel = this.nextButton.node.getComponent(Label) || 
                             this.nextButton.node.getChildByName('Label')?.getComponent(Label);
            GuideButtonRenderer.styleLabel(nextLabel);
        }
        
        // 初始化跳过按钮
        if (this.skipButton) {
            this.skipButton.node.on(Button.EventType.CLICK, this.onSkipButtonClick, this);
            // 美化跳过按钮
            GuideButtonRenderer.styleSkipButton(this.skipButton);
            // 美化按钮文字
            const skipLabel = this.skipButton.node.getComponent(Label) || 
                             this.skipButton.node.getChildByName('Label')?.getComponent(Label);
            GuideButtonRenderer.styleLabel(skipLabel);
        }
        
        // 获取 WeaponManager
        if (this.warView) {
            this.weaponManager = this.warView.getWeaponManager();
        }
        
        // 初始化步骤管理器
        this.stepManager = new GuideStepManager(
            this,
            this.guideLabel,
            this.weaponManager,
            {
                miniMapNode: this.miniMapNode,
                goldViewNode: this.goldViewNode,
                waveViewNode: this.waveViewNode,
                pauseButtonNode: this.pauseButtonNode
            }
        );
    }
    
    /**
     * 开始引导
     */
    startGuide() {
        if (this.stepManager) {
            this.node.active = true;
            // 显示背景
            if (this.backgroundNode) {
                this.backgroundNode.active = true;
            }
            // 禁用地图拖拽、小地图和暂停按钮
            this.disableInteractions();
            this.stepManager.start();
        }
    }
    
    /**
     * 跳过引导
     */
    skipGuide() {
        if (this.stepManager) {
            this.stepManager.skip();
        }
        // 启用地图拖拽、小地图和暂停按钮
        this.enableInteractions();
    }
    
    /**
     * 下一步按钮点击事件
     */
    private onNextButtonClick() {
        if (this.stepManager) {
            this.stepManager.nextStep();
        }
    }
    
    /**
     * 跳过按钮点击事件
     */
    private onSkipButtonClick() {
        if (this.stepManager) {
            this.stepManager.skip();
        }
    }
    
    /**
     * 完成当前步骤，进入下一步
     * 外部可以调用此方法来手动完成当前步骤
     */
    onStepComplete() {
        // 步骤管理器会自动检测步骤完成，不需要手动调用
    }
    
    update(deltaTime: number) {
        if (this.stepManager) {
            this.stepManager.update(deltaTime);
            // 更新按钮显示状态
            this.updateButtonVisibility();
        }
    }
    
    /**
     * 更新按钮显示状态
     */
    private updateButtonVisibility() {
        if (!this.stepManager) return;
        
        // 如果没有下一步，隐藏下一步按钮
        if (this.nextButton) {
            const hasNext = this.stepManager.hasNextStep();
            this.nextButton.node.active = hasNext;
        }
    }
    
    /**
     * 禁用交互（地图拖拽、暂停按钮）
     */
    private disableInteractions() {
        // 禁用地图拖拽
        if (this.warView) {
            const dragHandler = (this.warView as any).dragHandler;
            if (dragHandler && typeof dragHandler.setEnabled === 'function') {
                dragHandler.setEnabled(false);
            }
        }
        
        // 禁用暂停按钮
        if (this.pauseButtonNode) {
            const pauseBtn = this.pauseButtonNode.getComponent('PauseBtn' as any) as any;
            if (pauseBtn && typeof pauseBtn.setEnabled === 'function') {
                pauseBtn.setEnabled(false);
            }
        }
    }
    
    /**
     * 启用交互（地图拖拽、暂停按钮）
     */
    enableInteractions() {
        // 启用地图拖拽
        if (this.warView) {
            const dragHandler = (this.warView as any).dragHandler;
            if (dragHandler && typeof dragHandler.setEnabled === 'function') {
                dragHandler.setEnabled(true);
            }
        }
        
        // 启用暂停按钮
        if (this.pauseButtonNode) {
            const pauseBtn = this.pauseButtonNode.getComponent('PauseBtn' as any) as any;
            if (pauseBtn && typeof pauseBtn.setEnabled === 'function') {
                pauseBtn.setEnabled(true);
            }
        }
    }
    
    onDestroy() {
        // 移除按钮事件监听
        if (this.nextButton) {
            this.nextButton.node.off(Button.EventType.CLICK, this.onNextButtonClick, this);
        }
        if (this.skipButton) {
            this.skipButton.node.off(Button.EventType.CLICK, this.onSkipButtonClick, this);
        }
        
        if (this.stepManager) {
            this.stepManager.cleanup();
        }
    }
}
