import { _decorator, Component, Node, Label, Graphics, UITransform, UIOpacity, tween, Vec3, Vec2, Color } from 'cc';
import { CyberpunkColors } from '../../../constants/Index';
import { UiFontConfig } from '../../../config/Index';
import { UIStyleHelper } from '../../../utils/Index';
const { ccclass, property } = _decorator;

/**
 * 波次 Toast 提示组件
 * 参考原游戏实现：在屏幕中央显示波次信息，带有淡入淡出动画
 * 由 WarView 控制展示
 */
@ccclass('WaveToast')
export class WaveToast extends Component {
    @property({ type: Label, displayName: '波次文本标签', tooltip: '显示波次信息的文本标签' })
    private waveLabel: Label | null = null;

    @property({ type: Graphics, displayName: '背景图形', tooltip: 'Toast 背景图形组件' })
    private backgroundGraphics: Graphics | null = null;

    private isShowing: boolean = false;
    private uiOpacity: UIOpacity | null = null;

    onLoad() {
        this.uiOpacity = this.node.getComponent(UIOpacity);
        if (!this.uiOpacity) {
            this.uiOpacity = this.node.addComponent(UIOpacity);
        }
        
        // 初始状态：隐藏
        this.uiOpacity.opacity = 0;
        this.node.active = false;
    }

    start() {
        // 初始化 UI 元素
        this.initUI();
    }

    /**
     * 初始化 UI 元素
     */
    private initUI() {
        // 初始化背景
        if (this.backgroundGraphics) {
            this.initBackground();
        }

        // 初始化文本标签
        if (this.waveLabel) {
            this.initLabel();
        } else {
            // 如果没有指定标签，尝试查找子节点
            this.waveLabel = this.node.getChildByName('WaveLabel')?.getComponent(Label) || null;
            if (this.waveLabel) {
                this.initLabel();
            }
        }
    }

    /**
     * 初始化背景
     */
    private initBackground() {
        if (!this.backgroundGraphics) return;

        const transform = this.backgroundGraphics.getComponent(UITransform);
        if (!transform) return;

        // 设置背景大小
        transform.setContentSize(300, 80);
        transform.setAnchorPoint(0.5, 0.5);

        // 绘制赛博朋克风格背景
        this.drawBackground();
    }

    /**
     * 绘制背景（赛博朋克风格，高对比度设计）
     */
    private drawBackground() {
        if (!this.backgroundGraphics) return;

        const transform = this.backgroundGraphics.getComponent(UITransform);
        if (!transform) return;

        const width = transform.width;
        const height = transform.height;

        this.backgroundGraphics.clear();

        // 绘制深色背景（更不透明，提高对比度）
        this.backgroundGraphics.fillColor = new Color(0, 0, 0, 250);
        this.backgroundGraphics.roundRect(-width / 2, -height / 2, width, height, 8);
        this.backgroundGraphics.fill();

        // 绘制内层亮色背景（增强对比）
        this.backgroundGraphics.fillColor = new Color(20, 20, 30, 200);
        this.backgroundGraphics.roundRect(-width / 2 + 2, -height / 2 + 2, width - 4, height - 4, 6);
        this.backgroundGraphics.fill();

        // 绘制霓虹黄色边框（多层发光效果，更醒目）
        // 最外层光晕（大范围）
        this.backgroundGraphics.strokeColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_YELLOW, 0.4);
        this.backgroundGraphics.lineWidth = 6;
        this.backgroundGraphics.roundRect(-width / 2 - 3, -height / 2 - 3, width + 6, height + 6, 12);
        this.backgroundGraphics.stroke();

        // 中层光晕
        this.backgroundGraphics.strokeColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_YELLOW, 0.6);
        this.backgroundGraphics.lineWidth = 4;
        this.backgroundGraphics.roundRect(-width / 2 - 2, -height / 2 - 2, width + 4, height + 4, 10);
        this.backgroundGraphics.stroke();

        // 主边框（霓虹黄色，高亮度）
        this.backgroundGraphics.strokeColor = CyberpunkColors.NEON_YELLOW;
        this.backgroundGraphics.lineWidth = 3;
        this.backgroundGraphics.roundRect(-width / 2, -height / 2, width, height, 8);
        this.backgroundGraphics.stroke();

        // 内层白色高光边框（增强对比）
        this.backgroundGraphics.strokeColor = new Color(255, 255, 255, 180);
        this.backgroundGraphics.lineWidth = 1.5;
        this.backgroundGraphics.roundRect(-width / 2 + 3, -height / 2 + 3, width - 6, height - 6, 6);
        this.backgroundGraphics.stroke();
    }

    /**
     * 初始化文本标签（高对比度设计）
     */
    private initLabel() {
        if (!this.waveLabel) return;

        // 确保文字节点在背景之上
        if (this.waveLabel.node && this.backgroundGraphics && this.backgroundGraphics.node) {
            const labelIndex = this.waveLabel.node.getSiblingIndex();
            const bgIndex = this.backgroundGraphics.node.getSiblingIndex();
            if (labelIndex <= bgIndex) {
                this.waveLabel.node.setSiblingIndex(bgIndex + 1);
            }
        }

        // 确保文字节点可见
        this.waveLabel.node.active = true;

        // 设置文本样式（使用亮黄色，高对比度）
        UIStyleHelper.styleLabel(
            this.waveLabel,
            UiFontConfig.LARGE_FONT_SIZE,
            CyberpunkColors.NEON_YELLOW, // 使用霓虹黄色，更醒目
            6, // 增加描边宽度
            new Color(0, 0, 0, 255), // 黑色描边，完全不透明
            true
        );

        // 添加多层高亮阴影效果（强烈发光）
        this.waveLabel.enableShadow = true;
        // 主阴影：黄色发光（与边框呼应）
        this.waveLabel.shadowColor = new Color(255, 255, 0, 200); // 黄色阴影
        this.waveLabel.shadowOffset = new Vec2(0, 0); // 无偏移，创建发光效果
        this.waveLabel.shadowBlur = 12; // 模糊半径，增强发光效果

        // 确保文字颜色完全不透明
        this.waveLabel.color = new Color(255, 255, 0, 255);

        // 设置文本内容
        this.waveLabel.string = '第一波';
    }

    /**
     * 显示波次 Toast（由 WarView 调用）
     * @param waveNumber 波次编号
     */
    showWave(waveNumber: number) {
        if (this.isShowing) {
            // 如果正在显示，先停止当前动画
            this.stopAllTweens();
        }

        if (waveNumber <= 0) {
            return;
        }

        if (this.isShowing) {
            // 如果正在显示，先停止当前动画
            this.stopAllTweens();
        }

        this.isShowing = true;
        this.node.active = true;

        // 更新文本内容
        if (this.waveLabel) {
            this.waveLabel.string = `第 ${waveNumber} 波`;
        }

        // 重置透明度
        if (this.uiOpacity) {
            this.uiOpacity.opacity = 0;
        }

        // 重置缩放
        this.node.setScale(0.8, 0.8, 1);

        // 淡入动画
        const fadeInDuration = 0.3;
        const showDuration = 1.5;
        const fadeOutDuration = 0.3;

        // 淡入 + 缩放
        tween(this.uiOpacity)
            .to(fadeInDuration, { opacity: 255 }, { easing: 'sineOut' })
            .start();

        tween(this.node)
            .to(fadeInDuration, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .delay(showDuration)
            .call(() => {
                // 淡出动画
                tween(this.uiOpacity)
                    .to(fadeOutDuration, { opacity: 0 }, { easing: 'sineIn' })
                    .call(() => {
                        this.node.active = false;
                        this.isShowing = false;
                    })
                    .start();

                tween(this.node)
                    .to(fadeOutDuration, { scale: new Vec3(0.8, 0.8, 1) }, { easing: 'backIn' })
                    .start();
            })
            .start();
    }

    /**
     * 停止所有动画
     */
    private stopAllTweens() {
        if (this.uiOpacity) {
            tween(this.uiOpacity).stop();
        }
        tween(this.node).stop();
    }
}
