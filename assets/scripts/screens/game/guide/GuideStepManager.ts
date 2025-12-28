import { Component, Label, Node } from 'cc';
import { WeaponManager, GameManager } from '../../../managers/Index';
import { GuideStepBase } from './GuideStepBase';
import { GuideStepMiniMap } from './GuideStepMiniMap';
import { GuideStepGold } from './GuideStepGold';
import { GuideStepWave } from './GuideStepWave';
import { GuideStepPause } from './GuideStepPause';
import { GuideStepWeaponDrag } from './GuideStepWeaponDrag';
import { GuideStepBaseView } from './GuideStepBaseView';
import { GuideStepEnemySpawn } from './GuideStepEnemySpawn';
import { GuideHighlightManager } from './GuideHighlightManager';
import { GuideWarViewController } from './GuideWarViewController';

/**
 * 引导步骤管理器
 * 管理所有引导步骤的执行
 */
export class GuideStepManager {
    private guideComponent: Component;
    private guideLabel: Label | null = null;
    private weaponManager: WeaponManager | null = null;
    private steps: GuideStepBase[] = [];
    private currentStepIndex: number = 0;
    private targetNodeMap: Map<string, Node | null> = new Map();
    private highlightManager: GuideHighlightManager | null = null;
    private warViewController: GuideWarViewController | null = null;
    private blinkTimer: number = 0;
    private blinkInterval: number = 0.6;
    
    constructor(
        guideComponent: Component,
        guideLabel: Label | null,
        weaponManager: WeaponManager | null,
        targetNodes?: {
            miniMapNode?: Node | null;
            goldViewNode?: Node | null;
            waveViewNode?: Node | null;
            pauseButtonNode?: Node | null;
            warViewNode?: Node | null;
        }
    ) {
        this.guideComponent = guideComponent;
        this.guideLabel = guideLabel;
        this.weaponManager = weaponManager;
        
        // 存储目标节点映射
        if (targetNodes) {
            this.targetNodeMap.set('MiniMapView', targetNodes.miniMapNode || null);
            this.targetNodeMap.set('GoldView', targetNodes.goldViewNode || null);
            this.targetNodeMap.set('WaveView', targetNodes.waveViewNode || null);
            this.targetNodeMap.set('PauseBtn', targetNodes.pauseButtonNode || null);
        }
        
        // 初始化步骤列表
        this.steps = [
            new GuideStepMiniMap(guideComponent, guideLabel),
            new GuideStepGold(guideComponent, guideLabel),
            new GuideStepWave(guideComponent, guideLabel),
            new GuideStepPause(guideComponent, guideLabel),
            new GuideStepEnemySpawn(guideComponent, guideLabel), // 敌人生成列引导
            new GuideStepBaseView(guideComponent, guideLabel),
            new GuideStepWeaponDrag(guideComponent, guideLabel, weaponManager)
        ];
        
        // 初始化高亮管理器
        this.highlightManager = new GuideHighlightManager(
            guideComponent,
            this.targetNodeMap,
            this.steps,
            () => this.currentStepIndex
        );
        
        // 初始化 WarView 控制器
        const warViewNode = targetNodes?.warViewNode || null;
        let dragHandler: any = null;
        if (warViewNode) {
            const warViewComponent = warViewNode.getComponent('WarView');
            if (warViewComponent && (warViewComponent as any).dragHandler) {
                dragHandler = (warViewComponent as any).dragHandler;
            }
        }
        this.warViewController = new GuideWarViewController(warViewNode, dragHandler);
    }
    
    /**
     * 开始引导
     */
    start() {
        // 保存 WarView 的初始位置（如果还没有保存）
        if (this.warViewController) {
            this.warViewController.saveInitialPosition();
        }
        
        this.currentStepIndex = 0;
        if (this.steps.length > 0) {
            this.startStep(0);
        }
    }
    
    /**
     * 开始指定步骤
     */
    private startStep(stepIndex: number) {
        if (stepIndex >= this.steps.length) {
            this.complete();
            return;
        }
        
        // 清理上一个步骤
        if (stepIndex > 0) {
            this.steps[stepIndex - 1].cleanup();
        }
        
        const step = this.steps[stepIndex];
        this.currentStepIndex = stepIndex;
        
        // 检查是否需要启用拖拽（基地引导步骤）
        const stepId = step.getStepId();
        if (this.warViewController) {
            this.warViewController.disableDrag();
        }
        
        // 开始步骤
        step.start();
        
        // 处理高亮
        if (step.shouldHighlightTarget()) {
            const targetNodeName = step.getTargetNodeName();
            if (this.highlightManager) {
                this.highlightManager.highlightTarget(targetNodeName);
            }
        } else {
            if (this.highlightManager) {
                this.highlightManager.hideHighlight();
            }
        }
        
        // 只有基地引导步骤需要移动 WarView
        if (stepId === 'base_view' && this.warViewController) {
            // 使用 scheduleOnce 延迟一小段时间，确保节点已准备好
            if (this.guideComponent && this.guideComponent.node) {
                this.guideComponent.scheduleOnce(() => {
                    this.warViewController!.moveToTarget();
                }, 0.1);
            }
        }
    }
    
    /**
     * 更新引导
     */
    update(deltaTime: number) {
        if (this.currentStepIndex >= this.steps.length) return;
        
        const currentStep = this.steps[this.currentStepIndex];
        currentStep.update(deltaTime);
        
        // 只有武器拖拽步骤需要自动检测完成（其他步骤需要用户点击下一步按钮）
        if (currentStep.getStepId() === 'weapon_drag' && currentStep.isCompleted()) {
            this.nextStep();
        }
        
        // 更新高亮闪烁
        if (this.highlightManager) {
            this.highlightManager.update(deltaTime);
        }
        
        // 更新引导文字闪烁
        this.blinkTimer += deltaTime;
        this.updateLabelBlink(deltaTime);
    }
    
    /**
     * 更新引导文字闪烁效果
     */
    private updateLabelBlink(deltaTime: number) {
        if (!this.guideLabel || !this.guideLabel.node.active) return;
        
        // 使用与高亮框相同的闪烁逻辑
        const alpha = Math.floor(150 + 105 * Math.sin((this.blinkTimer / this.blinkInterval) * Math.PI * 2));
        const color = this.guideLabel.color.clone();
        color.a = alpha;
        this.guideLabel.color = color;
    }
    
    /**
     * 下一步（公共方法，供外部调用）
     */
    nextStep() {
        if (this.currentStepIndex < this.steps.length) {
            // 强制完成当前步骤
            const currentStep = this.steps[this.currentStepIndex];
            currentStep.complete();
            
            // 如果当前步骤是基地引导，在进入下一步前禁用拖拽并恢复位置
            const stepId = currentStep.getStepId();
            if (stepId === 'base_view' && this.warViewController) {
                this.warViewController.disableDrag();
                this.warViewController.restorePosition();
            }
        }
        
        if (this.highlightManager) {
            this.highlightManager.hideHighlight();
        }
        this.startStep(this.currentStepIndex + 1);
    }
    
    /**
     * 完成引导
     */
    private complete() {
        if (this.highlightManager) {
            this.highlightManager.hideHighlight();
        }
        
        if (this.guideLabel) {
            this.guideLabel.node.active = false;
        }
        
        // 清理所有步骤
        this.steps.forEach(step => step.cleanup());
        
        // 恢复 WarView 到初始位置并禁用拖拽
        if (this.warViewController) {
            this.warViewController.restorePosition();
            this.warViewController.disableDrag();
        }
        
        // 隐藏引导组件（通过调用 hideGuide 方法隐藏子节点）
        if (this.guideComponent && typeof (this.guideComponent as any).hideGuide === 'function') {
            (this.guideComponent as any).hideGuide();
        }
        
        // 启用交互
        if (this.guideComponent && typeof (this.guideComponent as any).enableInteractions === 'function') {
            (this.guideComponent as any).enableInteractions();
        }
        
        // 引导完成后，开始游戏
        const gameManager = GameManager.getInstance();
        gameManager.startGame();
        
        // 通知引导组件启用交互
        if (this.guideComponent && typeof (this.guideComponent as any).enableInteractions === 'function') {
            (this.guideComponent as any).enableInteractions();
        }
    }
    
    /**
     * 跳过引导
     */
    skip() {
        // 恢复 WarView 到初始位置并禁用拖拽
        if (this.warViewController) {
            this.warViewController.restorePosition();
            this.warViewController.disableDrag();
        }
        
        // 通知引导组件启用交互
        if (this.guideComponent && typeof (this.guideComponent as any).enableInteractions === 'function') {
            (this.guideComponent as any).enableInteractions();
        }
        this.complete();
    }
    
    
    /**
     * 获取当前步骤索引
     */
    getCurrentStepIndex(): number {
        return this.currentStepIndex;
    }
    
    /**
     * 获取总步骤数
     */
    getTotalSteps(): number {
        return this.steps.length;
    }
    
    /**
     * 是否还有下一步
     */
    hasNextStep(): boolean {
        return this.currentStepIndex < this.steps.length - 1;
    }
    
    /**
     * 清理资源
     */
    cleanup() {
        if (this.highlightManager) {
            this.highlightManager.cleanup();
        }
        if (this.warViewController) {
            this.warViewController.cleanup();
        }
        this.steps.forEach(step => step.cleanup());
    }
}

