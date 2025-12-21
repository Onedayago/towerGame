import { _decorator, Component, Graphics, Node, UITransform, EventTouch, Prefab } from 'cc';
import { UiConfig } from '../../config/Index';
import { GridHelper } from '../../utils/Index';
import { EnemyManager, GameManager, WeaponManager, BulletManager } from '../../managers/Index';
import { MapDragHandler } from '../../business/Index';
import { EnemyType } from '../../constants/Index';
const { ccclass, property } = _decorator;

@ccclass('WarView')
export class WarView extends Component {

    private graphics: Graphics | null = null;
    private enemyManager: EnemyManager | null = null;
    private weaponManager: WeaponManager | null = null;
    private bulletManager: BulletManager | null = null;
    private dragHandler: MapDragHandler | null = null;
    private gameManager: GameManager;

    @property(Prefab)
    public enemyTankPrefab: Prefab = null;

    @property(Prefab)
    public enemyFastTankPrefab: Prefab = null;

    @property(Prefab)
    public enemyHeavyTankPrefab: Prefab = null;

    @property(Prefab)
    public enemyBossPrefab: Prefab = null;

    onLoad() {
        this.initTransform();
        this.initManagers();
        this.initEventListeners();
        this.drawGrid();
    }

    /**
     * 初始化节点变换属性
     */
    private initTransform() {
        this.graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        
        const width = UiConfig.GAME_WIDTH * 2;
        const height = UiConfig.CELL_SIZE * 8;
        transform.setContentSize(width, height);
        transform.setAnchorPoint(0, 0);
        this.node.setPosition(0, 0, 0);
    }

    /**
     * 初始化管理器
     */
    private initManagers() {
        this.gameManager = GameManager.getInstance();
        
        // 初始化地图拖拽处理器
        const parent = this.node.parent;
        this.dragHandler = new MapDragHandler(this.node, parent);

        // 初始化敌人管理器
        const enemyPrefabs = this.buildEnemyPrefabMap();
        this.enemyManager = new EnemyManager(this.node, enemyPrefabs);
        
        // 初始化武器管理器
        this.weaponManager = new WeaponManager(this.node);
        
        // 初始化子弹管理器
        this.bulletManager = new BulletManager(this.node);
        
        // 设置管理器的依赖
        this.weaponManager.setBulletManager(this.bulletManager);
        this.weaponManager.setEnemyManager(this.enemyManager);
        this.bulletManager.setEnemyManager(this.enemyManager);
        this.bulletManager.setWeaponManager(this.weaponManager);
        this.enemyManager.setManagers(this.bulletManager, this.weaponManager);
    }

    /**
     * 构建敌人预制体映射表
     * @returns 敌人类型到预制体的映射
     */
    private buildEnemyPrefabMap(): Map<EnemyType, Prefab> {
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
        
        return enemyPrefabs;
    }

    /**
     * 初始化事件监听器
     */
    private initEventListeners() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    /**
     * 触摸开始事件处理（地图拖拽）
     */
    onTouchStart(event: EventTouch) {
        this.dragHandler?.onTouchStart(event);
    }

    /**
     * 触摸移动事件处理（地图拖拽）
     */
    onTouchMove(event: EventTouch) {
        this.dragHandler?.onTouchMove(event);
    }

    /**
     * 触摸结束事件处理（地图拖拽）
     */
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
        
        if (this.weaponManager) {
            this.weaponManager.clearAll();
        }
        
        if (this.bulletManager) {
            this.bulletManager.clearAll();
        }
    }

    start() {
        // 初始化完成后的逻辑可以在这里添加
    }

    update(deltaTime: number) {
        // 只有游戏开始后才更新管理器
        if (!this.gameManager.canUpdate()) return;

        // 更新敌人管理器
        if (this.enemyManager) {
            this.enemyManager.update(deltaTime);
        }
        
        // 更新武器管理器
        if (this.weaponManager) {
            this.weaponManager.update(deltaTime);
        }
        
        // 更新子弹管理器
        if (this.bulletManager) {
            this.bulletManager.update(deltaTime);
        }
    }
    
    /**
     * 获取武器管理器
     * @returns 武器管理器实例，如果未初始化则返回 null
     */
    getWeaponManager(): WeaponManager | null {
        return this.weaponManager;
    }

    /**
     * 获取敌人管理器
     * @returns 敌人管理器实例，如果未初始化则返回 null
     */
    getEnemyManager(): EnemyManager | null {
        return this.enemyManager;
    }

    /**
     * 绘制网格
     */
    private drawGrid() {
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

