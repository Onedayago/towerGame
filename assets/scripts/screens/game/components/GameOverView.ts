import { _decorator, Component, Node, Label, Button, Graphics, UITransform, UIOpacity, Color, director, EventTouch, Vec2, tween } from 'cc';
import { GameManager } from '../../../managers/Index';
import { CyberpunkColors } from '../../../constants/Index';
import { UiFontConfig, UiConfig } from '../../../config/Index';
import { UIStyleHelper } from '../../../utils/Index';
import { UiColors } from '../../../constants/Index';
const { ccclass, property } = _decorator;

/**
 * 游戏结束界面组件
 * 参考原游戏实现：显示游戏结束信息，带有重新开始和返回主菜单按钮
 */
@ccclass('GameOverView')
export class GameOverView extends Component {
    @property({ type: Label, displayName: '游戏结束标题', tooltip: '显示"游戏结束"的标题标签' })
    private titleLabel: Label | null = null;

    @property({ type: Label, displayName: '波次信息标签', tooltip: '显示最终波次的标签（可选）' })
    private waveLabel: Label | null = null;

    @property({ type: Button, displayName: '重新开始按钮', tooltip: '重新开始游戏的按钮' })
    private restartButton: Button | null = null;

    @property({ type: Button, displayName: '返回主菜单按钮', tooltip: '返回主菜单的按钮' })
    private menuButton: Button | null = null;

    private backgroundGraphics: Graphics | null = null;

    private gameManager: GameManager | null = null;
    private uiOpacity: UIOpacity | null = null;
    private isShowing: boolean = false;
    private isLoadingScene: boolean = false;

    onLoad() {
        this.gameManager = GameManager.getInstance();
        
        // 获取或添加 Graphics 组件作为背景
        this.backgroundGraphics = this.node.getComponent(Graphics);
        if (!this.backgroundGraphics) {
            this.backgroundGraphics = this.node.addComponent(Graphics);
        }
        
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
        if (this.titleLabel) {
            this.initTitleLabel();
        }

        if (this.waveLabel) {
            this.initWaveLabel();
        }

        // 初始化按钮
        if (this.restartButton) {
            this.initRestartButton();
        }

        if (this.menuButton) {
            this.initMenuButton();
        }
    }

    /**
     * 初始化背景
     */
    private initBackground() {
        if (!this.backgroundGraphics) return;

        const transform = this.node.getComponent(UITransform);
        if (!transform) return;

        // 设置背景大小为全屏
        const parentTransform = this.node.parent?.getComponent(UITransform);
        if (parentTransform) {
            transform.setContentSize(parentTransform.width, parentTransform.height);
        } else {
            transform.setContentSize(UiConfig.GAME_WIDTH, UiConfig.GAME_HEIGHT);
        }
        transform.setAnchorPoint(0.5, 0.5);

        // 绘制背景
        this.drawBackground();
    }

    /**
     * 绘制背景（赛博朋克风格，半透明遮罩）
     */
    private drawBackground() {
        if (!this.backgroundGraphics) return;

        const transform = this.node.getComponent(UITransform);
        if (!transform) return;

        const width = transform.width;
        const height = transform.height;

        this.backgroundGraphics.clear();

        // 使用 CyberpunkColors 的渐变背景色（更符合游戏风格）
        const startBg = CyberpunkColors.START_SCREEN_BG_START;
        const endBg = CyberpunkColors.START_SCREEN_BG_END;

        // 绘制渐变背景（从上到下）
        const steps = 40;
        for (let i = 0; i < steps; i++) {
            const ratio = i / (steps - 1);
            const color = CyberpunkColors.createGradientColor(startBg, endBg, ratio);

            const stepHeight = height / steps;
            this.backgroundGraphics.fillColor = color;
            this.backgroundGraphics.rect(-width / 2, -height / 2 + i * stepHeight, width, stepHeight + 1);
            this.backgroundGraphics.fill();
        }

        // 添加霓虹边框效果（增强赛博朋克感）
        const borderColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_CYAN, 0.3);
        this.backgroundGraphics.strokeColor = borderColor;
        this.backgroundGraphics.lineWidth = 2;
        this.backgroundGraphics.rect(-width / 2, -height / 2, width, height);
        this.backgroundGraphics.stroke();
    }

    /**
     * 初始化标题标签
     */
    private initTitleLabel() {
        if (!this.titleLabel) return;

        const fontSize = UiFontConfig.LARGE_FONT_SIZE;
        
        // 设置文本样式（赛博朋克风格，使用霓虹红色，醒目且符合游戏风格）
        UIStyleHelper.styleLabel(
            this.titleLabel,
            fontSize,
            CyberpunkColors.ENEMY_PRIMARY, // 霓虹红色，危险感
            6, // 更粗的描边
            new Color(0, 0, 0, 255), // 黑色描边，高对比度
            true
        );

        // 设置行高（与字体大小相同）
        this.titleLabel.lineHeight = fontSize;

        // 添加多层发光阴影效果（赛博朋克风格）
        this.titleLabel.enableShadow = true;
        // 主阴影：红色发光（与文字颜色呼应）
        this.titleLabel.shadowColor = CyberpunkColors.ENEMY_GLOW; // 霓虹红色发光
        this.titleLabel.shadowOffset = new Vec2(0, 0); // 无偏移，创建发光效果
        this.titleLabel.shadowBlur = 18; // 更大的模糊半径，增强发光效果

        // 确保文字颜色完全不透明
        this.titleLabel.color = CyberpunkColors.ENEMY_PRIMARY;

        this.titleLabel.string = '游戏结束';
    }

    /**
     * 初始化波次标签
     */
    private initWaveLabel() {
        if (!this.waveLabel) return;

        const fontSize = UiFontConfig.MEDIUM_FONT_SIZE;
        
        // 使用霓虹青色，科技感强，符合游戏风格
        UIStyleHelper.styleLabel(
            this.waveLabel,
            fontSize,
            CyberpunkColors.NEON_CYAN, // 霓虹青色，科技感
            4, // 增加描边宽度，更醒目
            new Color(0, 0, 0, 255), // 黑色描边
            true
        );

        // 设置行高（与字体大小相同）
        this.waveLabel.lineHeight = fontSize;

        // 添加发光阴影效果
        this.waveLabel.enableShadow = true;
        this.waveLabel.shadowColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_CYAN, 0.8);
        this.waveLabel.shadowOffset = new Vec2(0, 0);
        this.waveLabel.shadowBlur = 10;

        // 确保文字颜色完全不透明
        this.waveLabel.color = CyberpunkColors.NEON_CYAN;

        this.waveLabel.string = '波次: 0';
    }

    /**
     * 初始化重新开始按钮
     */
    private initRestartButton() {
        if (!this.restartButton) return;

        // 设置按钮样式（使用霓虹绿色，代表重新开始/希望）
        UIStyleHelper.styleButton(this.restartButton, CyberpunkColors.NEON_GREEN);

        // 设置按钮文字
        const buttonLabel = this.restartButton.node.getChildByName('Label')?.getComponent(Label);
        if (buttonLabel) {
            const fontSize = UiFontConfig.MEDIUM_FONT_SIZE;
            // 使用白色文字，高对比度
            UIStyleHelper.styleLabel(buttonLabel, fontSize, Color.WHITE, 2);
            // 设置行高（与字体大小相同）
            buttonLabel.lineHeight = fontSize;
            buttonLabel.string = '重新开始';
        }

        // 绑定点击事件
        this.restartButton.node.on(Button.EventType.CLICK, this.onRestartClick, this);
    }

    /**
     * 初始化返回主菜单按钮
     */
    private initMenuButton() {
        if (!this.menuButton) return;

        // 设置按钮样式（使用霓虹蓝色，科技感，符合 UI 次要色）
        UIStyleHelper.styleButton(this.menuButton, CyberpunkColors.NEON_BLUE);

        // 设置按钮文字
        const buttonLabel = this.menuButton.node.getChildByName('Label')?.getComponent(Label);
        if (buttonLabel) {
            const fontSize = UiFontConfig.MEDIUM_FONT_SIZE;
            // 使用白色文字，高对比度
            UIStyleHelper.styleLabel(buttonLabel, fontSize, Color.WHITE, 2);
            // 设置行高（与字体大小相同）
            buttonLabel.lineHeight = fontSize;
            buttonLabel.string = '返回主菜单';
        }

        // 绑定点击事件
        this.menuButton.node.on(Button.EventType.CLICK, this.onMenuClick, this);
    }

    /**
     * 显示游戏结束界面
     * @param finalWave 最终波次（可选）
     */
    show(finalWave: number = 0) {
        if (this.isShowing) return;

        this.isShowing = true;
        this.node.active = true;

        // 更新波次信息
        if (this.waveLabel) {
            this.waveLabel.string = `波次: ${finalWave}`;
        }

        // 重置透明度
        if (this.uiOpacity) {
            this.uiOpacity.opacity = 0;
        }

        // 淡入动画
        if (this.uiOpacity) {
            tween(this.uiOpacity)
                .to(0.5, { opacity: 255 }, { easing: 'sineOut' })
                .start();
        }

        // 停止游戏
        // this.gameManager.stopGame();
    }

    /**
     * 隐藏游戏结束界面
     */
    hide() {
        this.isShowing = false;
        this.node.active = false;
        if (this.uiOpacity) {
            this.uiOpacity.opacity = 0;
        }
    }

    /**
     * 重新开始按钮点击事件
     */
    private onRestartClick(event?: EventTouch) {
        if (event) {
            event.propagationStopped = true;
        }

        // 防止重复加载场景
        if (this.isLoadingScene) {
            return;
        }

        this.isLoadingScene = true;
        // 重新加载游戏场景
        director.loadScene('game');
    }

    /**
     * 返回主菜单按钮点击事件
     */
    private onMenuClick(event?: EventTouch) {
        if (event) {
            event.propagationStopped = true;
        }

        // 防止重复加载场景
        if (this.isLoadingScene) {
            return;
        }

        this.isLoadingScene = true;
        // 返回开始场景
        director.loadScene('start');
    }
}
