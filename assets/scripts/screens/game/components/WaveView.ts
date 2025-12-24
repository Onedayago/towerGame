import { _decorator, Component, Node, Label, UITransform, Graphics, Color } from 'cc';
import { WaveManager } from '../../../managers/Index';
const { ccclass, property } = _decorator;

/**
 * 波次显示组件
 * 显示当前波次和敌人进度，参考原游戏的设计
 */
@ccclass('WaveView')
export class WaveView extends Component {
    
    private waveManager: WaveManager | null = null;
    private waveLabel: Label | null = null;
    private progressLabel: Label | null = null;
    private lastWaveLevel: number = -1;
    private lastProgress: { current: number; max: number } | null = null;
    private graphics: Graphics | null = null;
    
    onLoad() {
        // 初始化波次管理器
        this.waveManager = WaveManager.getInstance();
        this.waveManager.init();
        
        // 绘制背景
        // this.drawBackground();
        
        // 初始化UI
        this.initUI();
    }
    
    start() {
        // 更新显示
        this.updateWaveDisplay();
    }
    
    update(deltaTime: number) {
        // 只在波次或进度变化时更新显示
        if (this.waveManager) {
            const currentWave = this.waveManager.getWaveLevel();
            const currentProgress = this.waveManager.getWaveProgress();
            
            if (currentWave !== this.lastWaveLevel || 
                !this.lastProgress || 
                currentProgress.current !== this.lastProgress.current ||
                currentProgress.max !== this.lastProgress.max) {
                this.updateWaveDisplay();
                this.lastWaveLevel = currentWave;
                this.lastProgress = { ...currentProgress };
            }
        }
    }
    
    /**
     * 绘制背景
     * 参考微信小游戏，简单的深色背景和紫色边框
     * 根据节点的锚点计算绘制起点
     */
    // private drawBackground() {
    //     // 获取或创建 Graphics 组件
    //     this.graphics = this.node.getComponent(Graphics);
    //     if (!this.graphics) {
    //         this.graphics = this.node.addComponent(Graphics);
    //     }
    //     
    //     const transform = this.node.getComponent(UITransform);
    //     if (!transform || !this.graphics) return;
    //     
    //     const width = transform.width;
    //     const height = transform.height;
    //     const anchorPoint = transform.anchorPoint;
    //     
    //     // 清除之前的绘制
    //     this.graphics.clear();
    //     
    //     // 根据锚点计算绘制起点
    //     const x = -width * anchorPoint.x;
    //     const y = -height * anchorPoint.y;
    //     
    //     // 绘制深色半透明背景
    //     const bgColor = new Color(30, 35, 45, 230); // 深色背景
    //     this.graphics.fillColor = bgColor;
    //     this.graphics.rect(x, y, width, height);
    //     this.graphics.fill();
    //     
    //     // 绘制紫色边框（参考原游戏）
    //     const borderColor = new Color(157, 0, 255, 255); // 紫色边框
    //     this.graphics.strokeColor = borderColor;
    //     this.graphics.lineWidth = 2;
    //     this.graphics.rect(x, y, width, height);
    //     this.graphics.stroke();
    // }
    
    /**
     * 初始化UI
     * 查找已存在的子节点
     */
    private initUI() {
        // 查找波次标签
        const waveLabelNode = this.node.getChildByName('WaveLabel');
        if (waveLabelNode) {
            this.waveLabel = waveLabelNode.getComponent(Label);
        }
        
        // 查找进度标签
        const progressLabelNode = this.node.getChildByName('ProgressLabel');
        if (progressLabelNode) {
            this.progressLabel = progressLabelNode.getComponent(Label);
        }
    }
    
    /**
     * 更新波次显示
     */
    private updateWaveDisplay() {
        if (!this.waveManager) return;
        
        const waveLevel = this.waveManager.getWaveLevel();
        const progress = this.waveManager.getWaveProgress();
        
        // 更新波次标签（确保至少显示波次 1）
        if (this.waveLabel) {
            const displayWave = waveLevel + 1;
            this.waveLabel.string = `波次 ${displayWave}`;
        }
        
        // 更新进度标签
        if (this.progressLabel) {
            this.progressLabel.string = `${progress.current}/${progress.max}`;
        }
    }
    
    /**
     * 获取当前波次（供外部调用）
     */
    public getCurrentWave(): number {
        return this.waveManager?.getWaveLevel() || 0;
    }
    
    /**
     * 获取当前进度（供外部调用）
     */
    public getCurrentProgress(): { current: number; max: number } {
        return this.waveManager?.getWaveProgress() || { current: 0, max: 0 };
    }
}

