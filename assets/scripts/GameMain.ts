import { _decorator, Component, UITransform } from 'cc';
import { UiConfig } from './config/Index';
const { ccclass } = _decorator;

/**
 * 游戏主组件
 * 游戏根节点组件，负责初始化游戏画布
 */
@ccclass('gameMain')
export class gameMain extends Component {
    // 帧率统计
    private frameCount: number = 0;
    private frameTime: number = 0;
    private readonly FPS_UPDATE_INTERVAL: number = 1.0; // 每秒更新一次帧率显示
    private fpsUpdateTimer: number = 0;
    private currentFPS: number = 0;

    start() {
        this.initTransform();
    }

    /**
     * 初始化节点变换属性
     */
    private initTransform() {
        const transform = this.node.getComponent(UITransform);
        transform.setContentSize(UiConfig.GAME_WIDTH, UiConfig.GAME_HEIGHT);
        transform.setAnchorPoint(0, 0);
        // 设置位置使画布居中
        this.node.setPosition(-UiConfig.GAME_WIDTH / 2, -UiConfig.GAME_HEIGHT / 2, 0);
    }

    update(deltaTime: number) {
        // 帧率统计
        // this.frameCount++;
        // this.frameTime += deltaTime;
        // this.fpsUpdateTimer += deltaTime;

        // // 每秒更新一次帧率显示
        // if (this.fpsUpdateTimer >= this.FPS_UPDATE_INTERVAL) {
        //     this.currentFPS = Math.round(this.frameCount / this.fpsUpdateTimer);
        //     console.log(`FPS: ${this.currentFPS}`);
            
        //     // 重置计数器
        //     this.frameCount = 0;
        //     this.fpsUpdateTimer = 0;
        // }
    }
}

