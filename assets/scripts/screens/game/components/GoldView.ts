import { _decorator, Component, Node, Label, UITransform, Graphics, Color } from 'cc';
import { GoldManager } from '../../../managers/Index';
const { ccclass, property } = _decorator;

/**
 * 金币显示组件
 * 显示当前金币数量，参考原游戏的设计
 */
@ccclass('GoldView')
export class GoldView extends Component {
    
    private goldManager: GoldManager | null = null;
    
    // 组件引用（通过编辑器绑定）
    @property({ type: Label, displayName: '金币标签' })
    private goldLabel: Label | null = null;
    
    @property({ type: Node, displayName: '金币图标节点' })
    private goldIconNode: Node | null = null;
    
    private lastGoldValue: number = -1; // 缓存上次的金币值，避免重复更新
    
    onLoad() {
        // 初始化金币管理器
        this.goldManager = GoldManager.getInstance();
        // 如果未初始化，则初始化默认金币
        if (this.goldManager.getGold() === 0) {
            this.goldManager.init(1000);
        }
        
        // 如果图标节点存在且有 Graphics 组件，绘制图标
        if (this.goldIconNode) {
            let graphics = this.goldIconNode.getComponent(Graphics);
            if (graphics) {
                this.drawGoldIcon(graphics);
            }
        }
    }
    
    start() {
        // 更新显示
        this.updateGoldDisplay();
    }
    
    update(deltaTime: number) {
        // 只在金币数量变化时更新显示
        if (this.goldManager) {
            const currentGold = this.goldManager.getGold();
            if (currentGold !== this.lastGoldValue) {
                this.updateGoldDisplay();
                this.lastGoldValue = currentGold;
            }
        }
    }
    
    
    /**
     * 绘制金币图标
     * 参考原游戏的设计，绘制一个金色圆形
     */
    private drawGoldIcon(graphics: Graphics) {
        const iconTransform = this.goldIconNode?.getComponent(UITransform);
        if (!iconTransform) return;
        
        const radius = Math.min(iconTransform.width, iconTransform.height) / 2 - 2;
        const centerX = 0;
        const centerY = 0;
        
        // 清除之前的绘制
        graphics.clear();
        
        // 绘制金币（金色圆形）
        // 外圈（深金色）
        graphics.fillColor = new Color(255, 193, 7, 255);
        graphics.circle(centerX, centerY, radius);
        graphics.fill();
        
        // 内圈（亮金色）
        graphics.fillColor = new Color(255, 215, 0, 255);
        graphics.circle(centerX, centerY, radius * 0.7);
        graphics.fill();
        
        // 边框（金色）
        graphics.strokeColor = new Color(255, 215, 0, 255);
        graphics.lineWidth = 1.5;
        graphics.circle(centerX, centerY, radius);
        graphics.stroke();
    }
    
    /**
     * 更新金币显示
     */
    private updateGoldDisplay() {
        if (this.goldManager && this.goldLabel) {
            const currentGold = this.goldManager.getGold();
            this.goldLabel.string = `${currentGold}`;
        }
    }
    
    /**
     * 获取当前金币数量（供外部调用）
     */
    public getCurrentGold(): number {
        return this.goldManager?.getGold() || 0;
    }
}

