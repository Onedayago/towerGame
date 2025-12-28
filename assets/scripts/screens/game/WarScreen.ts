import { _decorator, Component, UITransform, Graphics } from 'cc';
import { UiConfig } from '../../config/Index';
import { WarScreenRenderer } from '../../renderers/Index';
import { Guide } from './Guide';
import { GuideStateManager } from '../../managers/Index';
const { ccclass, property } = _decorator;

/**
 * 战争界面
 * 显示游戏主界面
 */
@ccclass('WarScreen')
export class WarScreen extends Component {

    private graphics: Graphics | null = null;

    @property({ type: Guide, displayName: '引导组件' })
    private guide: Guide | null = null;

    onLoad() {
        this.initTransform();
        this.initBackground();
    }

    start() {
        // 延迟一小段时间后检查是否需要显示引导
        this.scheduleOnce(() => {
            this.checkAndShowGuide();
        }, 0.5);
    }

    /**
     * 检查并显示引导
     */
    private checkAndShowGuide() {
        const guideStateManager = GuideStateManager.getInstance();
        const shouldShowGuide = guideStateManager.getShouldShowGuide();
        
        // 只有明确设置了应该显示引导时，才显示引导
        if (shouldShowGuide === true && this.guide) {
        
            this.guide.startGuide();
        } else {
            // 如果不显示引导，隐藏引导的所有子节点
            if (this.guide) {
                this.guide.hideGuide();
            }
        }
        
        // 重置状态，以便下次使用
        guideStateManager.reset();
    }

    /**
     * 初始化节点变换属性
     */
    private initTransform() {
        const transform = this.node.getComponent(UITransform);
        transform.setAnchorPoint(0, 0);
        transform.setContentSize(UiConfig.GAME_WIDTH, UiConfig.GAME_HEIGHT);
        this.node.setPosition(0, 0, 0);
    }
    
    /**
     * 初始化背景
     */
    private initBackground() {
        // 获取或创建 Graphics 组件
        this.graphics = this.node.getComponent(Graphics);
        if (!this.graphics) {
            this.graphics = this.node.addComponent(Graphics);
        }
        
        // 绘制背景（只绘制边框）
        const transform = this.node.getComponent(UITransform);
        if (transform && this.graphics) {
            WarScreenRenderer.renderBackground(this.graphics, transform);
        }
    }
}

