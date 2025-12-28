import { _decorator, Component, Node, Label, Button, Graphics, UITransform, UIOpacity, Color, director, EventTouch, Vec2, tween } from 'cc';
import { GameManager, GuideStateManager } from '../../managers/Index';
import { CyberpunkColors } from '../../constants/Index';
import { UiFontConfig, UiConfig } from '../../config/Index';
import { UIStyleHelper } from '../../utils/Index';
const { ccclass, property } = _decorator;

/**
 * 开始界面组件
 * 参考 GameOverView 和 PauseView 实现：显示游戏开始界面，带有开始和帮助按钮
 */
@ccclass('StartScreen')
export class StartScreen extends Component {
    @property({ type: Label, displayName: '标题标签', tooltip: '显示游戏标题的标签' })
    private titleLabel: Label | null = null;

    @property({ type: Label, displayName: '副标题标签', tooltip: '显示副标题的标签（可选）' })
    private subtitleLabel: Label | null = null;

    @property({ type: Button, displayName: '开始按钮', tooltip: '开始游戏的按钮' })
    private startButton: Button | null = null;

    @property({ type: Button, displayName: '帮助按钮', tooltip: '帮助按钮（可选）' })
    private helpButton: Button | null = null;

    private backgroundGraphics: Graphics | null = null;

    private gameManager: GameManager | null = null;
    private uiOpacity: UIOpacity | null = null;
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

        // 初始化游戏管理器
        this.initGameManager();
    }

    start() {
        // 初始化 UI 元素
        this.initUI();
    }

    /**
     * 初始化游戏管理器
     */
    private initGameManager() {
        // 在开始界面时，确保游戏未开始（游戏场景加载后会自动开始）
        if (this.gameManager) {
            this.gameManager.stopGame();
        }
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

        if (this.subtitleLabel) {
            this.initSubtitleLabel();
        }

        // 初始化按钮
        if (this.startButton) {
            this.initStartButton();
        }

        if (this.helpButton) {
            this.initHelpButton();
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
     * 绘制背景（赛博朋克风格，渐变背景）
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
    }

    /**
     * 初始化标题标签
     */
    private initTitleLabel() {
        if (!this.titleLabel) return;

        const fontSize = UiFontConfig.LARGE_FONT_SIZE;
        
        // 设置文本样式（赛博朋克风格，使用霓虹青色，科技感强）
        UIStyleHelper.styleLabel(
            this.titleLabel,
            fontSize,
            CyberpunkColors.NEON_CYAN, // 霓虹青色，科技感
            6, // 更粗的描边
            new Color(0, 0, 0, 255), // 黑色描边，高对比度
            true
        );

        // 设置行高（与字体大小相同）
        this.titleLabel.lineHeight = fontSize;

        // 添加多层发光阴影效果（赛博朋克风格）
        this.titleLabel.enableShadow = true;
        // 主阴影：青色发光（与文字颜色呼应）
        this.titleLabel.shadowColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_CYAN, 0.8);
        this.titleLabel.shadowOffset = new Vec2(0, 0); // 无偏移，创建发光效果
        this.titleLabel.shadowBlur = 20; // 更大的模糊半径，增强发光效果

        // 确保文字颜色完全不透明
        this.titleLabel.color = CyberpunkColors.NEON_CYAN;

        this.titleLabel.string = '防御塔防';
    }

    /**
     * 初始化副标题标签
     */
    private initSubtitleLabel() {
        if (!this.subtitleLabel) return;

        const fontSize = UiFontConfig.MEDIUM_FONT_SIZE;
        
        // 使用霓虹蓝色，科技感强，符合游戏风格
        UIStyleHelper.styleLabel(
            this.subtitleLabel,
            fontSize,
            CyberpunkColors.NEON_BLUE, // 霓虹蓝色，科技感
            3, // 描边宽度
            new Color(0, 0, 0, 255), // 黑色描边
            true
        );

        // 设置行高（与字体大小相同）
        this.subtitleLabel.lineHeight = fontSize;

        // 添加发光阴影效果
        this.subtitleLabel.enableShadow = true;
        this.subtitleLabel.shadowColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_BLUE, 0.7);
        this.subtitleLabel.shadowOffset = new Vec2(0, 0);
        this.subtitleLabel.shadowBlur = 8;

        // 确保文字颜色完全不透明
        this.subtitleLabel.color = CyberpunkColors.NEON_BLUE;

        this.subtitleLabel.string = '准备开始你的防御之旅';
    }

    /**
     * 初始化开始按钮
     */
    private initStartButton() {
        if (!this.startButton) return;

        // 设置按钮样式（使用霓虹绿色，代表开始/希望）
        UIStyleHelper.styleButton(this.startButton, CyberpunkColors.NEON_GREEN);

        // 设置按钮文字
        const buttonLabel = this.startButton.node.getChildByName('Label')?.getComponent(Label);
        if (buttonLabel) {
            const fontSize = UiFontConfig.MEDIUM_FONT_SIZE;
            // 使用白色文字，高对比度
            UIStyleHelper.styleLabel(buttonLabel, fontSize, Color.WHITE, 2);
            // 设置行高（与字体大小相同）
            buttonLabel.lineHeight = fontSize;
            buttonLabel.string = '开始游戏';
        }

        // 绑定点击事件
        this.startButton.node.on(Button.EventType.CLICK, this.onStartButtonClick, this);
    }

    /**
     * 初始化帮助按钮
     */
    private initHelpButton() {
        if (!this.helpButton) return;

        // 设置按钮样式（使用霓虹紫色，神秘感）
        UIStyleHelper.styleButton(this.helpButton, CyberpunkColors.NEON_PURPLE);

        // 设置按钮文字
        const buttonLabel = this.helpButton.node.getChildByName('Label')?.getComponent(Label);
        if (buttonLabel) {
            const fontSize = UiFontConfig.MEDIUM_FONT_SIZE;
            // 使用白色文字，高对比度
            UIStyleHelper.styleLabel(buttonLabel, fontSize, Color.WHITE, 2);
            // 设置行高（与字体大小相同）
            buttonLabel.lineHeight = fontSize;
            buttonLabel.string = '游戏引导';
        }

        // 绑定点击事件
        this.helpButton.node.on(Button.EventType.CLICK, this.onHelpButtonClick, this);
    }

    /**
     * 显示开始界面
     */
    show() {
        this.node.active = true;
        
        // 淡入动画
        if (this.uiOpacity) {
            this.uiOpacity.opacity = 0;
            tween(this.uiOpacity)
                .to(0.5, { opacity: 255 }, { easing: 'sineOut' })
                .start();
        }
    }

    /**
     * 隐藏开始界面
     */
    hide() {
        this.node.active = false;
        if (this.uiOpacity) {
            this.uiOpacity.opacity = 0;
        }
    }

    /**
     * 开始按钮点击事件
     */
    private onStartButtonClick(event?: EventTouch) {
        if (event) {
            event.propagationStopped = true;
        }

        // 防止重复加载场景
        if (this.isLoadingScene) {
            return;
        }

        this.isLoadingScene = true;
        
        // 设置不显示引导
        const guideStateManager = GuideStateManager.getInstance();
        guideStateManager.setShouldShowGuide(false);
        
        // 跳转到游戏场景
        director.loadScene('game');
    }

    /**
     * 帮助按钮点击事件（游戏引导）
     */
    private onHelpButtonClick(event?: EventTouch) {
        if (event) {
            event.propagationStopped = true;
        }

        // 防止重复加载场景
        if (this.isLoadingScene) {
            return;
        }

        this.isLoadingScene = true;
        
        // 设置显示引导
        const guideStateManager = GuideStateManager.getInstance();
        guideStateManager.setShouldShowGuide(true);
        
        // 跳转到游戏场景
        director.loadScene('game');
    }
}
