import { _decorator, Component, Graphics, Node, UITransform, EventTouch, Prefab, Vec3 } from 'cc';
import { UiConfig, GOLD_CONFIG } from '../../../config/Index';
import { EnemyManager, GameManager, WeaponManager, BulletManager, GoldManager, ObstacleManager } from '../../../managers/Index';
import { MapDragHandler } from '../../../business/Index';
import { EnemyType, ObstacleType } from '../../../constants/Index';
import { WarGridRenderer, BaseRenderer } from '../../../renderers/Index';
const { ccclass, property } = _decorator;

@ccclass('WarView')
export class WarView extends Component {

    private graphics: Graphics | null = null;
    private enemyManager: EnemyManager | null = null;
    private weaponManager: WeaponManager | null = null;
    private bulletManager: BulletManager | null = null;
    private obstacleManager: ObstacleManager | null = null;
    private dragHandler: MapDragHandler | null = null;
    private gameManager: GameManager;
    private homeNode: Node | null = null; // 基地节点

    @property(Prefab)
    public enemyTankPrefab: Prefab = null;

    @property(Prefab)
    public enemyFastTankPrefab: Prefab = null;

    @property(Prefab)
    public enemyHeavyTankPrefab: Prefab = null;

    @property(Prefab)
    public enemyBossPrefab: Prefab = null;
    
    @property({ type: Prefab, displayName: '敌人生成特效预制体', tooltip: '敌人生成时的特效预制体' })
    public enemySpawnEffectPrefab: Prefab | null = null;
    
    @property({ type: Prefab, displayName: '岩石障碍物预制体', tooltip: '岩石障碍物预制体' })
    public rockObstaclePrefab: Prefab | null = null;
    
    @property({ type: Prefab, displayName: '墙壁障碍物预制体', tooltip: '墙壁障碍物预制体' })
    public wallObstaclePrefab: Prefab | null = null;
    
    @property({ type: Prefab, displayName: '树木障碍物预制体', tooltip: '树木障碍物预制体' })
    public treeObstaclePrefab: Prefab | null = null;
    
    @property({ type: Prefab, displayName: '箱子障碍物预制体', tooltip: '箱子障碍物预制体' })
    public boxObstaclePrefab: Prefab | null = null;

    onLoad() {
        this.initTransform();
        this.initManagers();
        this.initEventListeners();
        this.drawGrid();
        this.initBase();
    }
    
    /**
     * 绘制战场格子
     */
    private drawGrid() {
        if (!this.graphics) return;
        
        const transform = this.node.getComponent(UITransform);
        if (!transform) return;
        
        const width = transform.width;
        const height = transform.height;
        
        // 绘制格子
        WarGridRenderer.renderGrid(this.graphics, width, height);
    }
    
    /**
     * 初始化我方基地
     * 在 Home 节点创建基地，位置在战场右边中间
     */
    private initBase() {
        // 查找或创建 Home 节点
        this.homeNode = this.node.getChildByName('Home');
        if (!this.homeNode) {
            this.homeNode = new Node('Home');
            this.homeNode.setParent(this.node);
        }
        
        // 获取战场尺寸
        const transform = this.node.getComponent(UITransform);
        if (!transform) return;
        
        const battlefieldWidth = transform.width;
        const battlefieldHeight = transform.height;
        const cellSize = UiConfig.CELL_SIZE;
        
        // 基地尺寸：2x2 格子
        const baseWidth = cellSize * 2;
        const baseHeight = cellSize * 2;
        
        // 设置 Home 节点的变换
        const homeTransform = this.homeNode.getComponent(UITransform);
        if (!homeTransform) {
            this.homeNode.addComponent(UITransform);
        }
        const homeUITransform = this.homeNode.getComponent(UITransform);
        if (homeUITransform) {
            homeUITransform.setAnchorPoint(0, 0);
            homeUITransform.setContentSize(baseWidth, baseHeight);
        }
        
        // 计算位置：右边中间
        // X 位置：战场宽度 - 基地宽度（右边对齐）
        const baseX = battlefieldWidth - baseWidth;
        // Y 位置：战场高度的一半 - 基地高度的一半（垂直居中）
        const baseY = (battlefieldHeight - baseHeight) / 2;
        this.homeNode.setPosition(baseX, baseY, 0);
        
        // 添加 Graphics 组件并绘制基地
        let baseGraphics = this.homeNode.getComponent(Graphics);
        if (!baseGraphics) {
            baseGraphics = this.homeNode.addComponent(Graphics);
        }
        
        // 绘制基地
        BaseRenderer.render(baseGraphics, baseWidth, baseHeight);
        
        // 基地创建后，生成障碍物（排除基地周围3个格子范围）
        this.generateRandomObstacles(undefined, 0.08);
    }

    /**
     * 初始化节点变换属性
     */
    private initTransform() {
        this.graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        
        const width = UiConfig.GAME_WIDTH * 2;
        const height = UiConfig.CELL_SIZE * 12;
        transform.setContentSize(width, height);
        transform.setAnchorPoint(0, 0);
        this.node.setPosition(0, 0, 0);
    }

    /**
     * 初始化管理器
     */
    private initManagers() {
        this.gameManager = GameManager.getInstance();
        
        // 初始化金币管理器
        const goldManager = GoldManager.getInstance();
        goldManager.init(GOLD_CONFIG.INITIAL_GOLD);
        
        // 初始化地图拖拽处理器
        const parent = this.node.parent;
        this.dragHandler = new MapDragHandler(this.node, parent);

        // 初始化敌人管理器
        const enemyPrefabs = this.buildEnemyPrefabMap();
        this.enemyManager = new EnemyManager(this.node, enemyPrefabs);
        
        // 设置敌人生成特效预制体
        if (this.enemySpawnEffectPrefab) {
            this.enemyManager.setSpawnEffectPrefab(this.enemySpawnEffectPrefab);
        }
        
        // 初始化武器管理器
        this.weaponManager = new WeaponManager(this.node);
        
        // 初始化子弹管理器
        this.bulletManager = new BulletManager(this.node);
        
        // 初始化障碍物管理器
        const obstaclePrefabs = this.buildObstaclePrefabMap();
        this.obstacleManager = new ObstacleManager(this.node, obstaclePrefabs);
        
        // 设置管理器的依赖
        this.weaponManager.setBulletManager(this.bulletManager);
        this.weaponManager.setEnemyManager(this.enemyManager);
        this.bulletManager.setEnemyManager(this.enemyManager);
        this.bulletManager.setWeaponManager(this.weaponManager);
        this.enemyManager.setManagers(this.bulletManager, this.weaponManager);
    }
    
    /**
     * 构建障碍物预制体映射表
     * @returns 障碍物类型到预制体的映射
     */
    private buildObstaclePrefabMap(): Map<ObstacleType, Prefab> {
        const obstaclePrefabs = new Map<ObstacleType, Prefab>();
        
        if (this.rockObstaclePrefab) {
            obstaclePrefabs.set(ObstacleType.ROCK, this.rockObstaclePrefab);
        }
        if (this.wallObstaclePrefab) {
            obstaclePrefabs.set(ObstacleType.WALL, this.wallObstaclePrefab);
        }
        if (this.treeObstaclePrefab) {
            obstaclePrefabs.set(ObstacleType.TREE, this.treeObstaclePrefab);
        }
        if (this.boxObstaclePrefab) {
            obstaclePrefabs.set(ObstacleType.BOX, this.boxObstaclePrefab);
        }
        
        return obstaclePrefabs;
    }
    
    /**
     * 随机生成障碍物
     * @param count 生成数量（可选，如果不指定则根据密度计算）
     * @param density 生成密度（0-1，表示占用格子的比例，默认 0.15 即 15%）
     */
    private generateRandomObstacles(count?: number, density: number = 0.15) {
        if (!this.obstacleManager) return;
        
        const transform = this.node.getComponent(UITransform);
        if (!transform) return;
        
        const width = transform.width;
        const height = transform.height;
        
        // 计算基地周围3个格子范围的排除位置
        const excludePositions: { x: number; y: number }[] = [];
        if (this.homeNode) {
            const homePos = this.homeNode.position;
            const homeTransform = this.homeNode.getComponent(UITransform);
            if (homeTransform) {
                const cellSize = UiConfig.CELL_SIZE;
                const baseWidth = homeTransform.width;
                const baseHeight = homeTransform.height;
                
                // 基地占据的格子范围
                const baseStartCol = Math.floor(homePos.x / cellSize);
                const baseEndCol = Math.floor((homePos.x + baseWidth) / cellSize);
                const baseStartRow = Math.floor(homePos.y / cellSize);
                const baseEndRow = Math.floor((homePos.y + baseHeight) / cellSize);
                
                // 基地周围3个格子的范围
                const excludeStartCol = Math.max(0, baseStartCol - 3);
                const excludeEndCol = Math.min(Math.floor(width / cellSize) - 1, baseEndCol + 3);
                const excludeStartRow = Math.max(0, baseStartRow - 3);
                const excludeEndRow = Math.min(Math.floor(height / cellSize) - 1, baseEndRow + 3);
                
                // 生成所有需要排除的格子位置
                for (let row = excludeStartRow; row <= excludeEndRow; row++) {
                    for (let col = excludeStartCol; col <= excludeEndCol; col++) {
                        const gridX = col * cellSize;
                        const gridY = row * cellSize;
                        excludePositions.push({ x: gridX, y: gridY });
                    }
                }
            }
        }
        
        this.obstacleManager.generateRandomObstacles(count, density, width, height, excludePositions);
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
     * 触摸结束事件处理（地图拖拽和武器选中）
     */
    onTouchEnd(event: EventTouch) {
        // 先处理地图拖拽
        this.dragHandler?.onTouchEnd(event);
        
        // 如果拖拽处理器没有消耗事件，检查是否点击了武器
        if (!event.propagationStopped && this.weaponManager) {
            // 获取触摸位置（转换为本地坐标）
            const touchLocation = event.getUILocation();
            const localPos = new Vec3();
            const transform = this.node.getComponent(UITransform);
            if (transform) {
                transform.convertToNodeSpaceAR(new Vec3(touchLocation.x, touchLocation.y, 0), localPos);
                
                // 尝试获取点击位置的武器
                const weapon = this.weaponManager.getWeaponAtLocalPosition({ x: localPos.x, y: localPos.y });
                if (weapon) {
                    // 选中武器
                    this.weaponManager.selectWeapon(weapon);
                    event.propagationStopped = true;
                } else {
                    // 点击空白处，取消选中
                    this.weaponManager.deselectWeapon();
                }
            }
        }
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
        
        if (this.obstacleManager) {
            this.obstacleManager.clearAll();
        }
    }

    start() {
        // 场景加载后，游戏不自动开始，等待引导完成或跳过
        // 游戏开始由引导系统控制
        if (this.gameManager) {
            this.gameManager.stopGame(); // 确保游戏未开始
        }
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
     * 获取障碍物管理器
     * @returns 障碍物管理器实例，如果未初始化则返回 null
     */
    getObstacleManager(): ObstacleManager | null {
        return this.obstacleManager;
    }

}

