import { _decorator, Component, Node, Label, UITransform, Button, Graphics } from 'cc';
import { WeaponManager } from '../../managers/Index';
import { WarView } from './components/Index';
import { GuideStepManager } from './guide/GuideStepManager';
import { GuideButtonRenderer, GuideLabelRenderer } from '../../renderers/Index';
import { CyberpunkColors } from '../../constants/Index';
import { UiConfig } from '../../config/Index';
const { ccclass, property } = _decorator;

/**
 * 游戏操作引导组件
 * 引导玩家完成游戏基本操作
 */
@ccclass('Guide')
export class Guide extends Component {
    
    private guideLabel: Label | null = null;
    private weaponManager: WeaponManager | null = null;
    private warView: WarView | null = null;
    private stepManager: GuideStepManager | null = null;
    private nextButton: Button | null = null;
    private skipButton: Button | null = null;
    private backgroundGraphics: Graphics | null = null;
    private backgroundNode: Node | null = null;
    
    @property({ displayName: '引导持续时间（秒）', tooltip: '每个引导步骤的显示时间' })
    public stepDuration: number = 2.0;
    
    @property({ displayName: '是否自动开始引导', tooltip: '游戏开始后是否自动显示引导' })
    public autoStart: boolean = true;
    
    onLoad() {
        this.initTransform();
        this.initBackground();
        this.initComponents();
    }
    
    /**
     * 初始化透明背景
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
        
        // 绘制透明背景
        this.renderBackground();
    }
    
    /**
     * 绘制透明背景
     */
    private renderBackground() {
        if (!this.backgroundGraphics) return;
        
        this.backgroundGraphics.clear();
        
        // 绘制半透明深色背景（赛博朋克风格）
        const bgColor = CyberpunkColors.createNeonGlow(CyberpunkColors.DARK_BG, 0.7);
        this.backgroundGraphics.fillColor = bgColor;
        this.backgroundGraphics.rect(0, 0, UiConfig.GAME_WIDTH, UiConfig.GAME_HEIGHT);
        this.backgroundGraphics.fill();
        
        // 绘制边框（霓虹青色，低透明度）
        const borderColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_CYAN, 0.3);
        this.backgroundGraphics.strokeColor = borderColor;
        this.backgroundGraphics.lineWidth = 2;
        this.backgroundGraphics.rect(0, 0, UiConfig.GAME_WIDTH, UiConfig.GAME_HEIGHT);
        this.backgroundGraphics.stroke();
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
        // 自动查找引导文字节点（在 Guide 组件下查找名为 'GuideLabelNode' 的子节点）
        const labelNode = this.node.getChildByName('GuideLabelNode');
        
        if (labelNode) {
            // 直接获取 Label 组件
            this.guideLabel = labelNode.getComponent(Label);
            // 美化引导文字
            if (this.guideLabel) {
                GuideLabelRenderer.styleLabel(this.guideLabel);
            }
        }
        
        // 自动查找下一步按钮（在 Guide 组件下查找名为 'NextButton' 的子节点）
        const nextButtonNode = this.node.getChildByName('NextButton');
        if (nextButtonNode) {
            this.nextButton = nextButtonNode.getComponent(Button);
            if (this.nextButton) {
                this.nextButton.node.on(Button.EventType.CLICK, this.onNextButtonClick, this);
                // 美化下一步按钮
                GuideButtonRenderer.styleNextButton(this.nextButton);
                // 美化按钮文字
                const nextLabel = this.nextButton.node.getComponent(Label) || 
                                 this.nextButton.node.getChildByName('Label')?.getComponent(Label);
                GuideButtonRenderer.styleLabel(nextLabel);
            }
        }
        
        // 自动查找跳过按钮（在 Guide 组件下查找名为 'SkipButton' 的子节点）
        const skipButtonNode = this.node.getChildByName('SkipButton');
        if (skipButtonNode) {
            this.skipButton = skipButtonNode.getComponent(Button);
            if (this.skipButton) {
                this.skipButton.node.on(Button.EventType.CLICK, this.onSkipButtonClick, this);
                // 美化跳过按钮
                GuideButtonRenderer.styleSkipButton(this.skipButton);
                // 美化按钮文字
                const skipLabel = this.skipButton.node.getComponent(Label) || 
                                 this.skipButton.node.getChildByName('Label')?.getComponent(Label);
                GuideButtonRenderer.styleLabel(skipLabel);
            }
        }
        
        // 查找 WarView 组件和 WeaponManager
        const scene = this.node.scene;
        if (scene) {
            this.warView = this.findNodeWithComponent(scene, WarView)?.getComponent(WarView) || null;
            if (this.warView) {
                this.weaponManager = this.warView.getWeaponManager();
            }
        }
        
        // 初始化步骤管理器
        this.stepManager = new GuideStepManager(
            this,
            this.guideLabel,
            this.weaponManager,
            this.stepDuration
        );
    }
    
    /**
     * 递归查找包含指定组件的节点
     */
    private findNodeWithComponent(node: Node, componentType: typeof Component): Node | null {
        if (node.getComponent(componentType)) {
            return node;
        }
        for (let child of node.children) {
            const result = this.findNodeWithComponent(child, componentType);
            if (result) {
                return result;
            }
        }
        return null;
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
