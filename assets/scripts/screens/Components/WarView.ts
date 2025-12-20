import { _decorator, Component, Graphics, Node, UITransform, EventTouch, Prefab } from 'cc';
import { UiConfig } from '../../config/Index';
import { GridHelper } from '../../utils/Index';
import { EnemyManager } from '../../managers/Index';
import { MapDragHandler } from '../../business/Index';
import { EnemyType } from '../../constants/Index';
const { ccclass, property } = _decorator;

@ccclass('WarView')
export class WarView extends Component {

    private graphics: Graphics | null = null;
    private enemyManager: EnemyManager | null = null;
    private dragHandler: MapDragHandler | null = null;

    @property(Prefab)
    public enemyTankPrefab: Prefab = null;

    @property(Prefab)
    public enemyFastTankPrefab: Prefab = null;

    @property(Prefab)
    public enemyHeavyTankPrefab: Prefab = null;

    @property(Prefab)
    public enemyBossPrefab: Prefab = null;

    onLoad() {
        this.graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        
        const width = UiConfig.GAME_WIDTH * 2;
        const height = UiConfig.CELL_SIZE * 8;
        transform.setContentSize(width, height);
        transform.setAnchorPoint(0, 0);
        this.node.setPosition(0, 0, 0);
        
        // 初始化拖拽处理器
        const parent = this.node.parent;
        this.dragHandler = new MapDragHandler(this.node, parent);

        // 初始化敌人管理器，支持多种敌人类型
        const enemyPrefabs = new Map<EnemyType, Prefab>();
        if (this.enemyTankPrefab) {
            enemyPrefabs.set(EnemyType.TANK, this.enemyTankPrefab);
        }
        if (this.enemyFastTankPrefab) {
            enemyPrefabs.set(EnemyType.FAST_TANK, this.enemyFastTankPrefab);
        }
        if (this.enemyHeavyTankPrefab) {
            enemyPrefabs.set(EnemyType.HEAVY_TANK, this.enemyHeavyTankPrefab);
        }
        if (this.enemyBossPrefab) {
            enemyPrefabs.set(EnemyType.BOSS, this.enemyBossPrefab);
        }
        
        this.enemyManager = new EnemyManager(this.node, enemyPrefabs);

        // 启用触摸事件
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        
        this.drawGrid();
    }

    onTouchStart(event: EventTouch) {
        this.dragHandler?.onTouchStart(event);
    }

    onTouchMove(event: EventTouch) {
        this.dragHandler?.onTouchMove(event);
    }

    onTouchEnd(event: EventTouch) {
        this.dragHandler?.onTouchEnd(event);
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        
        if (this.dragHandler) {
            this.dragHandler.destroy();
            this.dragHandler = null;
        }
        
        if (this.enemyManager) {
            this.enemyManager.clearAll();
        }
    }

    start() {
        
    }

    update(deltaTime: number) {
        if (this.enemyManager) {
            this.enemyManager.update(deltaTime);
        }
    }

    drawGrid() {
        if (!this.graphics) return;
        
        const transform = this.node.getComponent(UITransform);
        if (!transform) return;

        GridHelper.drawGrid(
            this.graphics,
            transform.width,
            transform.height
        );
    }
}

